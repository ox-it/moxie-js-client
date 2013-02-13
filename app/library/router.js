define(["app", "backbone", "library/models/ItemModel", "library/collections/ItemCollection", "library/views/SearchView", "library/views/ItemView", "backbone.subroute"],
    function(app, Backbone, Item, Items, SearchView, ItemView){

    var LibraryRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "search",
            "item/:id": "detail"
        },

        search: function(params) {
            app.showView(new SearchView({
                params: params,
                collection: new Items()
            }));
        },

        detail: function(id, params) {
            app.showView(new ItemView({
                model: Item,
                params: params,
                item_id: id
            }));
        }
    });

    // Returns the Router class
    return LibraryRouter;

});
