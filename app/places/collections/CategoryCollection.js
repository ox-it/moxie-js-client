define(["backbone", "underscore", "places/models/CategoryModel", "moxie.conf"], function(Backbone, _, Category, conf) {

    var CategoryCollection = Backbone.Collection.extend({
        model: Category,
        url: conf.endpoint + conf.pathFor('places_categories'),
        parse: function(data) {
            console.log(data);
            var flattened_cats = [];
            function flatten_categories(prefix, depth, cats) {
                depth++;
                for (var i=0; i < cats.length; i++) {
                    var cat_data = cats[i];
                    var new_prefix = prefix + cat_data.type + '/';
                    cat_data.type_prefixed = new_prefix;
                    cat_data.depth = depth;
                    if (cat_data.types) {
                        cat_data.hasTypes = true;
                        flatten_categories(new_prefix, depth, cat_data.types);
                    }
                    // Don't include the recursive structure in the models
                    flattened_cats.push(_.omit(cat_data, ['types']));
                }
            }
            data.type = '';
            flatten_categories('', 0, [data]);
            return flattened_cats;
        }
    });

    return CategoryCollection;

});
