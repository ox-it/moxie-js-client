define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'favourites/collections/Favourites'],
    function($, Backbone, _, conf, Favourites) {
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this);
                this.favourites = new Favourites();
                this.favourites.fetch();
                this.updateButton();
                this.favourites.on("remove add", this.updateButton, this);
                window.addEventListener("hashchange", this.updateButton, false);
            },

            attributes: {
                'class': 'generic free-text'
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
            },
            addFavourite: function() {
                var fragment = Backbone.history.getFragment(undefined, undefined, true);
                var params = Backbone.history.getQueryParameters();
                var title = document.title.split(conf.titlePrefix, 2)[1];
                var path = Backbone.history.getFragment();
                this.favourites.create({path: path, fragment: fragment, params: params, title: title});
            },
            removeFavourite: function(favourite) {
                this.favourites.remove(favourite);
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
