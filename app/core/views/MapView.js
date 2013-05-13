define(['backbone', 'leaflet', 'underscore', 'moxie.conf', 'places/utils', 'moxie.position'], function(Backbone, L, _, MoxieConf, utils, userPosition) {
    var MapView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            this.markers = [];
            this.userPosition = null;
        },

        manage: true,
        id: "map",

        beforeRender: function() {
            this.map = utils.getMap(this.el);
            userPosition.follow(this.handle_geolocation_query);
            return this;
        },

        afterRender: function() {
            this.invalidateMapSize();
        },

        setCollection: function(collection) {
            this.unsetCollection();
            this.collection = collection;
            this.collection.on("reset", this.resetMapContents, this);
            this.collection.on("add", this.placePOI, this);
            if (this.collection.length) {
                this.resetMapContents();
            }
        },

        unsetCollection: function() {
            if (this.collection) {
                this.collection.off("reset", this.resetMapContents, this);
                this.collection.off("add", this.placePOI, this);
                this.collection = null;
            }
        },

        handle_geolocation_query: function(position) {
            this.user_position = [position.coords.latitude, position.coords.longitude];
            var you = new L.LatLng(position.coords.latitude, position.coords.longitude);
            if (this.user_marker) {
                this.map.removeLayer(this.user_marker);
            }
            this.user_marker = L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0});
            this.map.addLayer(this.user_marker);
        },

        placePOI: function(poi) {
            if (poi.has('lat') && poi.has('lon')) {
                var latlng = new L.LatLng(poi.get('lat'), poi.get('lon'));
                var marker = new L.marker(latlng, {'title': poi.get('name')});
                marker.addTo(this.map);
                this.markers.push(marker);
            }
        },

        invalidateMapSize: function() {
            this.map.invalidateSize();
            return this;
        },

        setMapBounds: function() {
            var latlngs = [];
            var query = this.collection.query;
            this.collection.each(function(poi) {
                // See paramaters in moxie.conf
                //
                // If there is a seach term we show all results. If not then we add a few nearby results.
                // This was ported verbatim from Molly.
                if (query.q || ((Math.pow((poi.get('distance')*1000), MoxieConf.map.bounds.exponent) * (latlngs.length + 1)) < MoxieConf.map.bounds.limit)) {
                    latlngs.push(new L.LatLng(poi.get('lat'), poi.get('lon')));
                }
            });
            if (latlngs.length === 0) {
                _.each(this.collection.first(MoxieConf.map.bounds.fallback), function(poi) {
                    latlngs.push(new L.LatLng(poi.get('lat'), poi.get('lon')));
                });
            }
            var bounds = new L.LatLngBounds(latlngs);
            if (this.user_position) {
                bounds.extend(this.user_position);
            }
            bounds = bounds.pad(0.2);
            this.map.fitBounds(bounds);
        },

        resetMapContents: function(){
            // Remove the existing map markers
            _.each(this.markers, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create new list of markers from search results
            this.markers = [];
            this.collection.each(this.placePOI);
            this.setMapBounds();
        },

        cleanup: function() {
            this.unsetCollection();
            userPosition.unfollow(this.handle_geolocation_query);
        }
    });
    return MapView;
});
