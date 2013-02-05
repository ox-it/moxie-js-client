define(['jquery', 'underscore', 'backbone', 'moxie.conf', 'moxie.position', 'places/utils', 'hbs!places/templates/categories'], function($, _, Backbone, conf, userPosition, utils, categoriesTemplate){

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
                Backbone.history.navigate(path, {trigger: true, replace: false});
            }
        },

        clickCategory: function(e) {
            e.preventDefault();
            this.back_category = this.category_name;
            this.category_name = $(e.target).parents('a').data('category');
            this.renderCategories();
            if (!this.category_name) {
                this.category_name = '';
                $('#home').show();
                $('#back').hide();
            } else {
                $('#home').hide();
                $('#back').show().on('click', this.clickCategory);
            }
            Backbone.history.navigate('/places/categories/'+this.category_name, {replace:false});
        },

        setCategoryData: function(data) {
            this.category_data = data;
            this.renderCategories();
        },

        renderCategories: function() {
            var context;
            if (this.category_name) {
                var category_hierarchy = this.category_name.split('/');
                context = utils.getCategory(category_hierarchy, this.category_data);
            } else {
                context = {types: this.category_data.types};
            }
            context.category_name = (this.category_name) ? this.category_name : "";
            this.$el.html(categoriesTemplate(context));
        }
    });
    return CategoriesView;
});
