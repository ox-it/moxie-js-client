define(["app", "backbone", "library/models/ItemModel", "library/collections/ItemCollection", "library/views/SearchView", "backbone.subroute"], function(app, Backbone, Item, Items, SearchView){

    var LibraryRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "search"
        },

        search: function(params) {
            app.showView(new SearchView({
                params: params,
                collection: new Items()
            }));
        }
    });

    // Returns the Router class
    return LibraryRouter;

});
