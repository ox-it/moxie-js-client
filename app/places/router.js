define(["jquery", "backbone", "places/models/POIModel", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection", "backbone.subroute"], function($, Backbone, POI, SearchView, DetailView, POIs){

    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "search": "search",
            ":id": "detail"

        },

        search: function(params) {
            console.log("Places Search");
            searchView = new SearchView({
                collection: new POIs(),
                params: params
            });
            this.showView(searchView);
            searchView.invalidateMapSize();
        },

        detail: function(id, params) {
            console.log("Places Detail");
            detailView = new DetailView({
                model: POI,
                params: params,
                poid: id
            });
            this.showView(detailView);
            detailView.invalidateMapSize();
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
