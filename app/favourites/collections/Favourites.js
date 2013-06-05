define(["backbone", "underscore", "favourites/models/Favourite", "localstorage"],

    function(Backbone, _, Favourite) {
        var Favourites = Backbone.Collection.extend({
            initialize: function() {
                try {
                    // Possible error thrown when loading without localStorage available
                    this.localStorage = new Backbone.LocalStorage("favourites");
                } catch (e) {
                    if ('console' in window) {
                        console.log("Error accessing localStorage");
                        console.log(e);
                    }
                }
            },
            model: Favourite,

            getCurrentPage: function() {
                var fragment = Backbone.history.getFragment(undefined, undefined, true);
                var params = Backbone.history.getQueryParameters();
                return this.find(function(model) { return (model.get('fragment') === fragment && _.isEqual(model.get('params'), params)); });
            }
        });
        return Favourites;
    }

);
