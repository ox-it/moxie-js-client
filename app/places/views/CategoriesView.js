define(['underscore', 'backbone', 'moxie.conf', 'moxie.position', 'hbs!places/templates/base', 'hbs!places/templates/categories'], function(_, Backbone, conf, userPosition, baseTemplate, categoriesTemplate){

    var CategoriesView = Backbone.View.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.category_name = this.options.category_name;
        },

        render: function() {
            this.$el.html(baseTemplate());
            userPosition.follow(this.handle_geolocation_query);
            $.ajax({
                url: conf.endpoint + conf.pathFor('places_categories'),
                dataType: 'json'
            }).success(this.renderCategories);
        },

        findCategories: function(data, category_name) {
            var categories = data.types;
            return _.find(categories, function(cat) { return (cat.type===category_name); }).types;
        },

        renderCategories: function(data) {
            var context;
            if (this.category_name) {
                var cats = this.category_name.split('/');
                context = _.reduce(cats, this.findCategories, data);
            } else {
                context = {types: data.types};
            }
            context.category_name = (this.category_name) ? this.category_name : "";
            console.log(context);
            this.$('#list').html(categoriesTemplate(context));
        },

        handle_geolocation_query: function(position) {
            this.user_position = [position.coords.latitude, position.coords.longitude];
        }
    });
    return CategoriesView;
});
