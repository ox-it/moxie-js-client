define(['jquery', 'backbone', 'underscore', 'favourites/models/Favourite', 'favourites/collections/Favourites'],
    function($, Backbone, _, Favourite, Favourites) {
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this);
                this.favourites = new Favourites();
                this.favourites.fetch();
                this.updateButton();
                window.addEventListener("hashchange", this.updateButton, false);
            },

            events: {'click': 'toggleFavourite'},

            toggleFavourite: function(e) {
                e.preventDefault();
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
                this.favourites.create({fragment: fragment});
                this.$el.addClass('favourited');
            },
            removeFavourite: function(favourite) {
                favourite.destroy();
                this.$el.removeClass('favourited');
            },
            updateButton: function(favourite) {
                if (this.favourites.getCurrentPage()) {
                    this.$el.addClass('favourited');
                } else {
                    this.$el.removeClass('favourited');
                }
            }
        });
        return FavouriteButtonView;
    }
);
