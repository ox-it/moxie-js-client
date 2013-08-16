define(["backbone", "underscore", "core/collections/LocalStorageCollection", "favourites/models/Favourite", "localstorage"],
    function(Backbone, _, LocalStorageCollection, Favourite) {
        var Favourites = LocalStorageCollection.extend({
            name: "favourites",
            model: Favourite,
            getCurrentPage: function() {
                var fragment = Backbone.history.getFragment(undefined, undefined, true);
                var params = Backbone.history.getQueryParameters();
                return this.find(function(model) { return (model.get('fragment') === fragment && _.isEqual(model.get('params'), params)); });
            },
            currentPageFavourited: function() {
                return !_.isUndefined(this.getCurrentPage());
            }

        });
        return Favourites;
    }
);
