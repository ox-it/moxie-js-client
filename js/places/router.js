define(["jquery","backbone","places/models/POIModel", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection"], function($, Backbone, POI, SearchView, DetailView, POIs){

    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "search": "search",
            ":id": "detail"

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
        },

        detail: function(id, params) {
            detailView = new DetailView({
                model: POI,
                params: params,
                poid: id
            });
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
