define(["app", "backbone", "backbone.subroute"], function(app, Backbone){

    var LibraryRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "search"
        },

        search: function(params) {

        }
    });

    // Returns the Router class
    return LibraryRouter;

});
