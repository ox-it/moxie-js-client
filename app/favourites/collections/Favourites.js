define(["backbone", "favourites/models/Favourite", "localstorage"],

    function(Backbone, Favourite) {
        var Favourites = Backbone.Collection.extend({
            model: Favourite,
            localStorage: new Backbone.LocalStorage("favourites"), // Unique name within your app.

            getCurrentPage: function(fragment) {
                if (fragment === undefined) {
                    fragment = Backbone.history.fragment;
                }
                return this.find(function(model) { return (model.get('fragment') == fragment); });
            }
        });
        return Favourites;
    }

);
