define(['backbone', 'places/utils', 'moxie.position'], function(Backbone, utils, userPosition) {
    var MapView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            this.latlngs = [];
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
            var latlng = new L.LatLng(poi.attributes.lat, poi.attributes.lon);
            var marker = new L.marker(latlng, {'title': poi.attributes.name});
            marker.addTo(this.map);
            this.latlngs.push(latlng);
            this.markers.push(marker);
        },

        invalidateMapSize: function() {
            this.map.invalidateSize();
            return this;
        },

        setMapBounds: function() {
            var bounds = new L.LatLngBounds(this.latlngs);
            if (this.user_position) {
                bounds.extend(this.user_position);
            }
            bounds.pad(5);
            this.map.fitBounds(bounds);
        },

        resetMapContents: function(){
            // Remove the existing map markers
            _.each(this.markers, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create new list of markers from search results
            this.latlngs = [];
            this.markers = [];
            this.collection.each(this.placePOI);
            this.setMapBounds();
        },

        cleanup: function() {
            console.log("Cleanup");
            this.unsetCollection();
            userPosition.unfollow(this.handle_geolocation_query);
        }
    });
    return MapView;
});
