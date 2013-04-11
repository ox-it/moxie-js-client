define(["backbone", "underscore", "places/models/CategoryModel", "moxie.conf"], function(Backbone, _, Category, conf) {

    var CategoryCollection = Backbone.Collection.extend({
        model: Category,
        url: conf.urlFor('places_categories'),
        parse: function(data) {
            // The data Moxie presents for categories is in a (sensible) tree structure.
            // This kind of structure doesn't fit the Model/Collection paradigm in Backbone
            // too well, so we flatten the structure. We leave behind markers for 'depth'
            // and build a '/' delimited path for the branches of the tree. That way we can
            // make fast queries on the content at depth 2 without any need to traverse again.
            var flattened_cats = [];
            function flatten_categories(prefix, depth, cats) {
                depth++;
                for (var i=0; i < cats.length; i++) {
                    var cat_data = cats[i];
                    // Since the top level type is simply '/' we need this logic to stop us prefixing with '//'
                    var new_prefix = (prefix.length > 1) ? prefix + '/' + cat_data.type : prefix + cat_data.type;
                    // A '/' delimited path which reflects the tree structure
                    // eg. /transport/car-park/park-and-ride
                    cat_data.type_prefixed = new_prefix;
                    // How far into the tree are we? This is kept around as a convenience.
                    cat_data.depth = depth;
                    if (cat_data.types) {
                        cat_data.hasTypes = true;
                        flatten_categories(new_prefix, depth, cat_data.types);
                    }
                    // Don't include the recursive structure in the models
                    flattened_cats.push(_.omit(cat_data, ['types']));
                }
            }
            data.type = data.type || '/';
            flatten_categories('', 0, [data]);
            return flattened_cats;
        }
    });

    return CategoryCollection;

});
