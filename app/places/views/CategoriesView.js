define(['jquery', 'underscore', 'backbone', 'moxie.conf', 'moxie.position', 'places/utils', 'hbs!places/templates/base_categories', 'hbs!places/templates/categories'],
    function($, _, Backbone, conf, userPosition, utils, baseTemplate, categoriesTemplate){

    var CategoriesView = Backbone.View.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.category_name = this.options.category_name;
            // Used when navigating backwards
            this.back_category = null;
        },

        events: {
            'keypress :input': "searchEvent",
            'click .results-list > a[data-category]': "clickCategory",
            'click .deleteicon': "clearSearch"
        },

        clearSearch: function(e) {
            this.$('.search-input input').val('').focus();
        },

        attributes: {
            'class': 'generic'
        },

        render: function() {
            this.$el.html(baseTemplate());
            $.ajax({
                url: conf.endpoint + conf.pathFor('places_categories'),
                dataType: 'json'
            }).success(this.setCategoryData);
        },

        searchEvent: function(ev) {
            if (ev.which === 13) {
                var query = ev.target.value;
                var qstring = $.param({q: query}).replace(/\+/g, "%20");
                var path = conf.pathFor('places_search') + '?' + qstring;
                app.navigate(path, {trigger: true, replace: false});
            }
        },

        clickCategory: function(e) {
            e.preventDefault();
            this.back_category = this.category_name;
            this.category_name = $(e.target).parents('a').data('category');
            this.category_name = this.category_name ? this.category_name : '';
            app.navigate('/places/categories/'+this.category_name, {replace:false});
            this.renderCategories();
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
        }
    });
    return CategoriesView;
});
