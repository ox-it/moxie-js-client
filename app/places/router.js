define(["jquery", "backbone", "places/models/POIModel", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection", "backbone.subroute"], function($, Backbone, POI, SearchView, DetailView, POIs){

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
            searchView.render();
            $('#content').empty().html(searchView.el);
            searchView.invalidateMapSize();
        },

        detail: function(id, params) {
            detailView = new DetailView({
                model: POI,
                params: params,
                poid: id
            });
            detailView.render();
            $('#content').empty().html(detailView.el);
            detailView.invalidateMapSize();
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
