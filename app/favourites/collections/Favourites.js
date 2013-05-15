define(["backbone", "underscore", "favourites/models/Favourite", "localstorage"],

    function(Backbone, _, Favourite) {
        var Favourites = Backbone.Collection.extend({
            model: Favourite,
            localStorage: new Backbone.LocalStorage("favourites"), // Unique name within your app.

            getCurrentPage: function() {
                var fragment = Backbone.history.getFragment(undefined, undefined, true);
                var params = Backbone.history.getQueryParameters();
                return this.find(function(model) { return (model.get('fragment') === fragment && _.isEqual(model.get('params'), params)); });
            }
        });
        return Favourites;
    }

);
