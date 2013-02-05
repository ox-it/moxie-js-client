define(["app", "backbone", "library/views/SearchView", "backbone.subroute"], function(app, Backbone, SearchView){

    var LibraryRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "search"
        },

        search: function(params) {
            app.showView(new SearchView({
                params: params
            }));
        }
    });

    // Returns the Router class
    return LibraryRouter;

});
