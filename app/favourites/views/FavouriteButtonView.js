define(['jquery', 'backbone', 'underscore', 'moxie.conf'],
    function($, Backbone, _, conf) {
        var standardClass = 'fa',
            favouriteClass = 'fa-star-o',
            favouritedClass = 'fa-star favourited';
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                this.collection.on("reset remove add", this.updateButton, this);
                // Specify a namespace on the event so we don't remove all listeners
                $(window).on("hashchange.FavouriteButton", _.bind(this.updateButton, this));
            },
            manage: true,
            events: {'click': 'toggleFavourite'},
            tagName: 'a',
            attributes: {
                'class': [standardClass, favouriteClass].join(' ')
            },
            toggleFavourite: function(e) {
                e.preventDefault();
                var fav = this.collection.getCurrentPage();
                if (fav) {
                    this.removeFavourite(fav);
                } else {
                    this.addFavourite();
                }
            },
            afterRender: function() {
                this.updateButton();
            },
            addFavourite: function() {
                var fragment = Backbone.history.getFragment(undefined, undefined, true);
                var params = Backbone.history.getQueryParameters();
                var title = document.title.split(conf.titlePrefix, 2)[1];
                var path = Backbone.history.getFragment();
                this.collection.create({path: path, fragment: fragment, params: params, title: title},
                    {success: function(model) {
                        Backbone.trigger('favourited', model);
                    }
                });
            },
            removeFavourite: function(favourite) {
                this.collection.remove(favourite);
            },
            updateButton: function() {
                var favourited = this.collection.currentPageFavourited();
                this.$el.toggleClass(favouriteClass, !favourited);
                this.$el.toggleClass(favouritedClass, favourited);
            },
            cleanup: function() {
                $(window).off("hashchange.FavouriteButton");
            }
        });
        return FavouriteButtonView;
    }
);
