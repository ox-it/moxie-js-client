define(['jquery', 'backbone', 'underscore', 'favourites/collections/Favourites', 'hbs!favourites/templates/favourites'],
    function($, Backbone, _, Favourites, favouritesTemplate) {
        var FavouritesView = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this);
                this.favourites = new Favourites();
                this.favourites.fetch();
                this.favourites.on("remove add", this.render, this);
            },
            render: function() {
                Backbone.trigger('domchange:title', "Favourites");
                this.$el.html(favouritesTemplate({favourites: this.favourites.toJSON()}));
            }
        });
        return FavouritesView;
    }
);
