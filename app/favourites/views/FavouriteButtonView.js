define(['jquery', 'backbone', 'underscore', 'moxie.conf'],
    function($, Backbone, _, conf) {
        var standardClass = 'ss-standard',
            favouriteClass = 'ss-star',
            favouritedClass = 'favourited';
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                this.collection.on("reset remove add", this.updateButton, this);
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
                this.$el.toggleClass(favouritedClass, this.collection.currentPageFavourited());
            }
        });
        return FavouriteButtonView;
    }
);
