define(["jquery","backbone","places/models/POIModel", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection"], function($, Backbone, POI, SearchView, DetailView, POIs){

    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "search": "search",
            ":id": "detail"

        },

        search: function(params) {
            $('#content').html(new SearchView({
                collection: new POIs(),
                params: params
            }).render().el );
        },

        detail: function(id, params) {
            $('#content').html(new DetailView({
                model: POI,
                params: params,
                poid: id
            }).render().el);
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
