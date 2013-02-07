define(['jquery', 'backbone', 'underscore', 'favourites/models/Favourite', 'favourites/collections/Favourites'],
    function($, Backbone, _, Favourite, Favourites) {
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                this.favourites = new Favourites();
                _.bindAll(this);
            },

            events: {'click': 'toggleFavourite'},

            toggleFavourite: function(e) {
                e.preventDefault();
                console.log(this.favourites.toJSON());
                var fav = this.favourites.getCurrentPage();
                if (fav) {
                    this.removeFavourite(fav);
                } else {
                    this.addFavourite();
                }
                console.log(this.favourites.toJSON());
            },
            addFavourite: function() {
                var fragment = Backbone.history.fragment;
                this.favourites.add({fragment: fragment});
                this.$el.addClass('favourited');
            },
            removeFavourite: function(favourite) {
                this.favourites.remove(favourite);
                this.$el.removeClass('favourited');
            }
        });
        return FavouriteButtonView;
    }
);
