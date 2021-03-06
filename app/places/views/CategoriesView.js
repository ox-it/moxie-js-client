define(['jquery', 'underscore', 'backbone', 'app/app', 'app/moxie.conf', 'app/moxie.position', 'app/places/utils', 'app/places/collections/CategoryCollection', 'hbs!app/places/templates/categories'],
    function($, _, Backbone, app, conf, userPosition, utils, Categories, categoriesTemplate){

    var CategoriesView = Backbone.View.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.category_name = this.options.category_name || "/";
            this.collection.on('reset', this.render, this);
        },

        manage: true,
        template: categoriesTemplate,
        serialize: function() {
            var context = {};
            var category = this.collection.find(function(model) { return model.get('type_prefixed') === this.category_name; }, this);
            if (category) {
                context.types = new Categories(category.getChildren()).toJSON();
                context.category = category.toJSON();
            }
            return context;
        },

        cleanup: function() {
            this.collection.off('reset', this.render, this);
        },

        events: {
            'keypress :input': "searchEvent",
            'click .deleteicon': "clearSearch"
        },

        clearSearch: function(e) {
            this.$('.search-input input').val('').focus();
        },

        attributes: {
            'class': 'generic'
        },

        searchEvent: function(ev) {
            if (ev.which === 13) {
                var query = ev.target.value;
                var qstring = $.param({q: query}).replace(/\+/g, "%20");
                var path = conf.pathFor('places_search') + '?' + qstring;
                app.navigate(path, {trigger: true, replace: false});
            }
        },

        setCategoryData: function(data) {
            this.category_data = data;
            this.renderCategories();
        },

        renderCategories: function() {
            this.$(".preloader").hide();
            var context;
            if (this.category_name) {
                var category_hierarchy = this.category_name.split('/');
                context = utils.getCategory(category_hierarchy, this.category_data);
                // updating base template with type name
                this.$("#category_title").text(context.type_name_plural);
                this.$("#input_search").attr("placeholder", "Search " + context.type_name_plural.toLowerCase() + "...");
            } else {
                context = {types: this.category_data.types};
            }
            context.category_name = (this.category_name) ? this.category_name : "";
            this.$("#categories").html(categoriesTemplate(context));
        },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Places " + this.category_name);
        }
    });
    return CategoriesView;
});
