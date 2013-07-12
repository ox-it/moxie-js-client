define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'favourites/collections/Favourites'],
    function($, Backbone, _, conf, Favourites) {
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
                this.editing = !this.editing;
                this.setEditState(this.editing);
                return false;
            },
            setEditState: function(editState) {
                if (editState) {
                    this.$el.removeClass('ss-lock');
                    this.$el.addClass('ss-unlock');
                    this.editCB();
                } else {
                    this.$el.removeClass('ss-unlock');
                    this.$el.addClass('ss-lock');
                    this.saveCB();
                }
            },
            inEditMode: false,
            editMode: function(editCB, saveCB) {
                this.editCB = editCB;
                this.saveCB = saveCB;
                this.$el.removeClass('favourited');
                this.$el.removeClass('ss-star');
                this.editing = false;
                this.undelegateEvents();
                this.events = {'click': 'toggleEdit'};
                this.delegateEvents();
                this.setEditState(false);
                this.inEditMode = true;
            },
            exitEditMode: function() {
                this.$el.removeClass('ss-unlock');
                this.$el.removeClass('ss-lock');
                this.$el.addClass('ss-star');
                this.undelegateEvents();
                this.events = {'click': 'toggleFavourite'};
                this.delegateEvents();
            },
            addFavourite: function() {
                var fragment = Backbone.history.getFragment(undefined, undefined, true);
                var params = Backbone.history.getQueryParameters();
                var title = document.title.split(conf.titlePrefix, 2)[1];
                var path = Backbone.history.getFragment();
                this.collection.create({path: path, fragment: fragment, params: params, title: title,
                    success: function(model) {
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
