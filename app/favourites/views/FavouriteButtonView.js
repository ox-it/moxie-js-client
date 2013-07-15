define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'favourites/collections/Favourites'],
    function($, Backbone, _, conf, Favourites) {
        var editClass = 'ss-lock',
            saveClass = 'ss-unlock',
            favouriteClass = 'ss-star',
            favouritedClass = 'favourited';
        var FavouriteButtonView = Backbone.View.extend({
            initialize: function() {
                this.collection.on("reset remove add", this.updateButton, this);
                $(window).on("hashchange", _.bind(this.updateButton, this));
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

            editing: false,
            toggleEdit: function(e) {
                e.preventDefault();
                var editing = !this.editing;
                this.$el.toggleClass(editClass, !editing);
                this.$el.toggleClass(saveClass, editing);
                this.trigger('toggleEdit', editing);
                this.editing = editing;
                return false;
            },
            editMode: function() {
                this.$el.removeClass(favouriteClass);
                this.$el.addClass(editClass);
                this.editing = false;
                this.undelegateEvents();
                this.delegateEvents({'click': 'toggleEdit'});
            },
            exitEditMode: function() {
                this.$el.removeClass(editClass);
                this.$el.removeClass(saveClass);
                this.$el.addClass(favouriteClass);
                this.undelegateEvents();
                this.delegateEvents({'click': 'toggleFavourite'});
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
        FavouriteButtonView.extend(Backbone.Events);
        return FavouriteButtonView;
    }
);
