define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'favourites/collections/Favourites'],
    function($, Backbone, _, conf, Favourites) {
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                this.collection.on("reset remove add", this.updateButton, this);
                $(window).on("hashchange", _.bind(this.updateButton, this));
            },

            attributes: {
                'class': 'generic free-text'
            },

            events: {'click': 'toggleFavourite'},

            toggleFavourite: function(e) {
                e.preventDefault();
                var fav = this.collection.getCurrentPage();
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
                this.collection.create({path: path, fragment: fragment, params: params, title: title});
            },
            removeFavourite: function(favourite) {
                this.collection.remove(favourite);
            },
            updateButton: function() {
                if (this.collection.getCurrentPage()) {
                    this.$el.addClass('favourited');
                } else {
                    this.$el.removeClass('favourited');
                }
            }
        });
        return FavouriteButtonView;
    }
);
