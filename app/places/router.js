define(["app", "underscore", "backbone", "places/models/POIModel", "places/views/CategoriesView", "places/views/SearchView", "places/views/DetailView", "places/collections/POICollection", "places/collections/CategoryCollection", "core/views/MapView", "backbone.subroute"], function(app, _, Backbone, POI, CategoriesView, SearchView, DetailView, POIs, Categories, MapView){

    var pois = new POIs();
    var categories = new Categories();
    categories.fetch();
    var PlacesRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "categories",
            "categories": "categories",
            "categories*category_name": "categories",
            "search": "search",
            "search/map": "searchMap",
            ":id": "detail",
            ":id/map": "detailMap"

        },

        categories: function(category_name) {
            // Navigate to the list of categories (root view of places)
            var categoriesView = new CategoriesView({collection: categories, category_name: category_name});
            var options = category_name ? {} : {menu: true};
            app.renderView(categoriesView, options);
        },

        search: function(params) {
            var query = params || {};
            if (!_.isEqual(query, pois.query) || (pois.length <= 1)) {
                // If the Collection has the correct query and we have items don't bother fetching new results now
                pois.query = query;
                // Calling reset here prevents us from rendering any old results
                pois.reset();
                pois.geoFetch();
            }
            var layout = app.getLayout('MapBrowseLayout');
            var searchView = new SearchView({collection: pois});
            layout.setView('.content-browse', searchView);
            var mapView = layout.getView('.content-map');
            mapView.setCollection(pois);
            // Remove any other mapClick listeners (if the view is being reused)
            mapView.off('mapClick');
            mapView.on('mapClick', function() {
                var qstring = Backbone.history.fragment.replace(Backbone.history.getFragment(null, null, true), '');
                Backbone.history.navigate('#places/search/map'+qstring, {trigger: true, replace: false});
            });
            searchView.render();
        },

        searchMap: function(params) {
            var query = params || {};
            if (!_.isEqual(query, pois.query) || (pois.length <= 1)) {
                // If the Collection has the correct query and we have items don't bother fetching new results now
                pois.query = query;
                // Calling reset here prevents us from rendering any old results
                pois.reset();
                pois.geoFetch();
            }
            var mapView = new MapView({interactiveMap: true, fullScreen: true});
            app.renderView(mapView);
            mapView.setCollection(pois);
        },

        detailMap: function(id) {
            var poi = pois.get(id);
            var mapView = new MapView({interactiveMap: true, fullScreen: true});
            app.renderView(mapView);
            if (!poi) {
                poi = new POI({id: id});
                poi.fetch({success: function(model) { mapView.setCollection(new POIs([model])); }});
            } else {
                mapView.setCollection(new POIs([poi]));
            }
        },

        showDetail: function(poi) {
            var layout = app.getLayout('MapBrowseLayout');
            var detailView = new DetailView({
                model: poi
            });
            layout.setView('.content-browse', detailView);
            var mapView = layout.getView('.content-map');
            mapView.setCollection(new POIs([poi]));
            // Remove any other mapClick listeners (if the view is being reused)
            mapView.off('mapClick');
            mapView.on('mapClick', function() { Backbone.history.navigate('#/places/'+poi.id+'/map', {trigger: true, replace: false}); });
            detailView.render();
        },

        detail: function(id, params) {
            var query = params || {};
            var showRTI = 'rti' in query ? params.rti : null;
            var poi = pois.get(id);
            if (poi) {
                poi.set('showRTI', showRTI);
            } else {
                poi = new POI({id: id, showRTI: showRTI});
                poi.fetch({success: _.bind(function(model, response, options) {
                    pois.add(model);
                }, this) });
            }
            this.showDetail(poi);
        }

    });

    // Returns the Router class
    return PlacesRouter;

});
