define(["app", "backbone", "places/models/POIModel", "places/views/CategoriesView", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection", "backbone.subroute"], function(app, Backbone, POI, CategoriesView, SearchView, DetailView, POIs){

    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

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
