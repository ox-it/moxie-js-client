define(["jquery","backbone","places/models/POIModel", "places/views/SearchView", "places/collections/POICollection"], function($, Backbone, POI, SearchView, POIs){

    var Router = Backbone.Router.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "places/search": "search"

        },

        search: function(params) {
            console.log("Search called!");
            // Instantiating the mainView instance
            results = new POIs();
            searchView = new SearchView({

                // TODO: Run the default search here?
                // Declares the View's collection instance property
                collection: results,
                params: params,

            });
            console.log(searchView);

            // Renders all of the User Model's to the page
            searchView.render();

        }
    });

    // Returns the Router class
    return Router;

});
