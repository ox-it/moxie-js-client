define(['jquery', 'underscore', 'backbone', 'moxie.conf', 'moxie.position', 'hbs!places/templates/categories'], function($, _, Backbone, conf, userPosition, categoriesTemplate){

    var CategoriesView = Backbone.View.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.category_name = this.options.category_name;
            // Used when navigating backwards
            this.back_category = null;
        },

        events: {
            'click .results-list > a[data-category]': "clickCategory"
        },

        render: function() {
            $.ajax({
                url: conf.endpoint + conf.pathFor('places_categories'),
                dataType: 'json'
            }).success(this.setCategoryData);
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

        findCategories: function(data, category_name) {
            var categories = data.types;
            return _.find(categories, function(cat) { return (cat.type===category_name); }).types;
        },

        setCategoryData: function(data) {
            this.category_data = data;
            this.renderCategories();
        },

        renderCategories: function() {
            var context;
            if (this.category_name) {
                var cats = this.category_name.split('/');
                context = _.reduce(cats, this.findCategories, this.category_data);
            } else {
                context = {types: this.category_data.types};
            }
            context.category_name = (this.category_name) ? this.category_name : "";
            this.$el.html(categoriesTemplate(context));
        }
    });
    return CategoriesView;
});
