define(["app", "backbone", "places/models/POIModel", "places/views/CategoriesView", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection", "backbone.subroute"], function(app, Backbone, POI, CategoriesView, SearchView, DetailView, POIs){

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
            app.renderView(categoriesView);
        },

        search: function(params) {
            var query = params || {};
            if (!_.isEqual(query, pois.query) || (pois.length <= 1)) {
                // If the Collection has the correct query and we have items don't bother fetching new results now
                pois.query = query;
                pois.geoFetch();
            }
            var layout = app.getLayout('MapBrowseLayout');
            searchView = new SearchView({collection: pois});
            layout.setView('.content-browse', searchView);
            layout.getView('.content-map').setCollection(pois);
            searchView.render();
        },

        showDetail: function(poi) {
            var layout = app.getLayout('MapBrowseLayout');
            var detailView = new DetailView({
                model: poi
            });
            layout.setView('.content-browse', detailView);
            layout.getView('.content-map').setCollection(new POIs([poi]));
            detailView.render();
        },

        detail: function(id) {
            var poi = pois.get(id);
            if (poi) {
                this.showDetail(poi);
            } else {
                poi = new POI({id: id});
                poi.fetch({success: _.bind(function(model, response, options) {
                    pois.add(model);
                    this.showDetail(model);
                }, this) });
            }
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
