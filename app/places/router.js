define(["app", "backbone", "places/models/POIModel", "places/views/CategoriesView", "places/views/SearchView", "places/views/MapView", "places/views/DetailView", "places/collections/POICollection", "hbs!places/templates/list-map-layout", "backbone.subroute"], function(app, Backbone, POI, CategoriesView, SearchView, MapView, DetailView, POIs, ListMapTemplate){

    var pois = new POIs();
    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "categories",
            "categories": "categories",
            "categories/*category_name": "categories",
            "search": "search",
            ":id": "detail"

        },

        categories: function(category_name) {
            // Navigate to the list of categories (root view of places)
            categoriesView = new CategoriesView({category_name: category_name});
            app.showView(categoriesView);
        },

        search: function(params) {
            mapView = new MapView({
                collection: pois
            });
            searchView = new SearchView({
                collection: pois,
                params: params
            });
            var layout = new Backbone.Layout({
                template: ListMapTemplate,
                views: {
                    ".content-detail": mapView,
                    "#list": searchView
                }
            });
            app.showView(layout, {back: true});
            mapView.invalidateMapSize();
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
