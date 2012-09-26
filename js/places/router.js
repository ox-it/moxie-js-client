define(["jquery","backbone","places/models/POIModel", "places/views/SearchView", "places/collections/POICollection"], function($, Backbone, POI, SearchView, POIs){

    var PlacesRouter = Backbone.Router.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "places/search": "search"

        },

        search: function(params) {
            // Instantiating the mainView instance
            results = new POIs();
            searchView = new SearchView({

                // Declares the View's collection instance property
                collection: results,
                params: params
            });

            // Renders all of the User Model's to the page
            searchView.render();
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
