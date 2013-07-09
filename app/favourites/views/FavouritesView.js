define(['jquery', 'backbone', 'underscore', 'favourites/collections/Favourites', 'hbs!favourites/templates/favourites'],
    function($, Backbone, _, Favourites, favouritesTemplate) {
        var FavouritesView = Backbone.View.extend({
            initialize: function(options) {
                options = options || {};
                this.button = options.button;
                this.collection.on("remove add", this.render, this);
                this.collection.on("change", this.render, this);
            },
            manage: true,
            template: favouritesTemplate,
            serialize: function() {
                return {favourites: this.collection.toJSON()};
            },
            afterRender: function() {
                Backbone.trigger('domchange:title', "Favourites");
                this.button.editMode(_.bind(this.editCallback, this), _.bind(this.saveCallback, this));
            },
            editCallback: function() {
                console.log("Edit callback");
            },
            saveCallback: function() {
                console.log("Save callback");
            }
        });
        return FavouritesView;
    }
);
