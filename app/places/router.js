define(["app", "backbone", "places/models/POIModel", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection", "backbone.subroute"], function(app, Backbone, POI, SearchView, DetailView, POIs){

    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "search": "search",
            ":id": "detail"

        },

        search: function(params) {
            searchView = new SearchView({
                collection: new POIs(),
                params: params
            });
            app.showView(searchView);
            searchView.invalidateMapSize();
        },

        detail: function(id, params) {
            detailView = new DetailView({
                model: POI,
                params: params,
                poid: id
            });
            app.showView(detailView);
            detailView.invalidateMapSize();
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
