define(['backbone', 'leaflet', 'underscore', 'moxie.conf', 'places/utils', 'moxie.position', 'core/media'], function(Backbone, L, _, MoxieConf, utils, userPosition, media) {
    var MapView = Backbone.View.extend({
        initialize: function(options) {
            this.options = options || {};
            this.interactiveMap = this.options.interactiveMap || media.isTablet();
            this.markers = [];
            this.userPosition = null;
        },

        attributes: {},
        manage: true,
        id: "map",

        beforeRender: function() {
            var mapOptions = {};
            if (!this.interactiveMap) {
                 mapOptions.dragging = false;
                 mapOptions.touchZoom = false;
                 mapOptions.scrollWheelZoom = false;
                 mapOptions.doubleClickZoom = false;
                 mapOptions.boxZoom = false;
            }
            this.map = utils.getMap(this.el, {mapOptions: mapOptions});
            if (!this.interactiveMap) {
                // Note: This view can be reused for example when navigating from a POI
                // SearchView to a DetailView. In which case we need to remove any lingering
                // events so we don't end up with multiple event handlers.
                //
                // See this is handled by the controllers.
                this.map.on('click', function() {
                    this.trigger('mapClick');
                }, this);
            }
            userPosition.follow(this.handle_geolocation_query, this);
            return this;
        },

        afterRender: function() {
            if (this.options.fullScreen) {
                this.$el.addClass('full-screen');
            }
            this.invalidateMapSize();
        },

        setCollection: function(collection) {
            this.unsetCollection();
            this.collection = collection;
            this.collection.on("reset", this.resetMapContents, this);
            this.collection.on("add", this.placePOI, this);
            this.collection.on("sync", this.resetMapContents, this);
            if (this.collection.length) {
                this.resetMapContents();
            }
        },

        unsetCollection: function() {
            if (this.collection) {
                this.collection.off(null, null, this);
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
            this.setMapBounds();
        },

        placePOI: function(poi) {
            if (poi.hasLocation()) {
                var latlng = new L.LatLng(poi.get('lat'), poi.get('lon'));
                var marker;
                if ('getIcon' in poi) {
                    marker = new L.marker(latlng, {title: poi.get('name'), icon: poi.getIcon()});
                } else {
                    marker = new L.marker(latlng, {title: poi.get('name')});
                }
                if (this.options.fullScreen && this.interactiveMap) {
                    // Phone View
                    marker.on('click', function(ev) {
                        Backbone.history.navigate('#/places/'+poi.id, {trigger: true, replace: false});
                    });
                } else {
                    // Tablet View
                    marker.on('click', _.bind(function(ev) {
                        var highlighted = this.collection.findWhere({'highlighted': true});
                        if (highlighted) { highlighted.set('highlighted', false); }
                        poi.set('highlighted', true);
                    }, this));
                }
                this.map.addLayer(marker);
                this.markers.push(marker);
            }
        },

        invalidateMapSize: function() {
            this.map.invalidateSize();
            return this;
        },

        setMapBounds: function() {
            var latlngs = [];
            // Only set map bounds if we have some points
            //
            if (!this.collection || this.collection.length===0) { return; }
            this.collection.each(function(poi) {
                // See paramaters in moxie.conf
                //
                // Show just a few nearby results -- since we load quite a lot of resutlts by default
                // the entire listing can be quite overwhelming and the map ends up being very zoomed out.
                // This was ported verbatim from Molly.
                if (poi.hasLocation() && (Math.pow((poi.get('distance')*1000), MoxieConf.map.bounds.exponent) * (latlngs.length + 1)) < MoxieConf.map.bounds.limit) {
                    latlngs.push(new L.LatLng(poi.get('lat'), poi.get('lon')));
                }
            });
            if (latlngs.length === 0) {
                _.each(this.collection.first(MoxieConf.map.bounds.fallback), function(poi) {
                    if (poi.hasLocation()) {
                        latlngs.push(new L.LatLng(poi.get('lat'), poi.get('lon')));
                    }
                });
            }
            if (latlngs.length > 0) {
                var bounds = new L.LatLngBounds(latlngs);
                if (this.user_position) {
                    bounds.extend(this.user_position);
                }
                bounds = bounds.pad(0.1);
                // Animating here seemed to cause a problem when we call fitBounds several
                // times during a quick succession, not sure if this is a bug with leaflet
                // but setting animate: false seems to resolve things.
                this.map.fitBounds(bounds, {animate: false});
            }
        },

        resetMapContents: function(){
            // Remove the existing map markers
            _.each(this.markers, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create new list of markers from search results
            this.markers = [];
            this.collection.each(this.placePOI, this);
            this.setMapBounds();
        },

        cleanup: function() {
            this.unsetCollection();
            userPosition.unfollow(this.handle_geolocation_query, this);
        }
    });
    MapView.extend(Backbone.Events);
    return MapView;
});
