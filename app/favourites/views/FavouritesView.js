define(['jquery', 'backbone', 'underscore', 'favourites/collections/Favourites', 'hbs!favourites/templates/favourites'],
    function($, Backbone, _, Favourites, favouritesTemplate) {
        var FavouritesView = Backbone.View.extend({
            initialize: function() {
                this.collection.on("remove add", this.render, this);
                this.collection.on("change", this.render, this);
            },
            render: function() {
                Backbone.trigger('domchange:title', "Favourites");
                this.$el.html(favouritesTemplate({favourites: this.collection.toJSON()}));
            }
        });
        return FavouritesView;
    }
);
