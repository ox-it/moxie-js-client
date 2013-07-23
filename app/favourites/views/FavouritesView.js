define(['jquery', 'backbone', 'underscore', 'favourites/collections/Favourites', 'hbs!favourites/templates/favourites'],
    function($, Backbone, _, Favourites, favouritesTemplate) {
        var FavouritesView = Backbone.View.extend({
            initialize: function(options) {
                options = options || {};
                this.button = options.button;
                this.button.on('toggleEdit', _.bind(this.editCallback, this));
                this.collection.on("remove add", this.render, this);
                this.collection.on("change", this.render, this);
            },
            events: {
                'click .remove-fav': 'removeFavourite'
            },
            removeFavourite: function(ev) {
                ev.preventDefault();
                var favID = ev.target.parentNode.id;
                var favourite = this.collection.get(favID);
                this.collection.remove(favourite);
                return false;
            },
            manage: true,
            editing: false,
            template: favouritesTemplate,
            serialize: function() {
                return {favourites: this.collection.toJSON(), editing: this.editing};
            },
            afterRender: function() {
                Backbone.trigger('domchange:title', "Favourites");
            },
            editCallback: function(editing) {
                // Test its actually false, not something falsy
                if (editing===false) {
                    // Save the changes
                    var favouriteInput = this.$('li');
                    _.each(favouriteInput, function(fav) {
                        var favourite = this.collection.get(fav.id);
                        favourite.set('userTitle', $(fav).find('input').val());
                        favourite.save();
                    }, this);
                }
                this.editing = editing;
                this.render();
            }
        });
        return FavouritesView;
    }
);
