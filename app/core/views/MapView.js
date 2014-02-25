define(['backbone', 'jquery', 'leaflet', 'underscore', 'moxie.conf', 'places/utils', 'core/media', 'moxie.position'], function(Backbone, $, L, _, MoxieConf, utils, media, userPosition) {
    var MapView = Backbone.View.extend({
        initialize: function(options) {
            this.options = options || {};
            this.interactiveMap = this.options.interactiveMap || media.isTablet();
            this.features = [];
        },

        attributes: {},
        manage: true,
        id: "map",

        // Used to stop us resetting the map location once the user
        // moves the map. Carefully reset when the collection is reset.
        mapMoved: false,

        beforeRender: function() {
            $('html').addClass('map');
            var mapOptions = {
                zoomControl: false
            };
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
            return this;
        },

        afterRender: function() {
            if (this.options.fullScreen) {
                this.$el.addClass('full-screen');
            }
            this.invalidateMapSize();
            this.map.on('dragstart', function() {
                this.mapMoved = true;
            }, this);
            userPosition.on('position:paused', function() {
                this.user_position = null;
                if (this.user_marker) {
                    this.map.removeLayer(this.user_marker);
                    this.setMapBounds();
                }
            }, this);
        },

        setCollection: function(collection) {
            this.mapMoved = false;
            this.unsetCollection();
            this.collection = collection;
            // Listening only to "sync" seems to capture all necessary map changes
            //
            // Add is used as we load additional results.
            this.collection.on("sync", this.resetMapContents, this);
            this.collection.on("add", this.placePOI, this);
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
            // is this the first position being reported?
            var firstPosition = false;
            if (!this.user_position) {
                firstPosition = true;
            }
            // Only update the features if the user position changes (useful for desktops)
            if (this.user_position && this.user_position[0] === position.coords.latitude && this.user_position[1] === position.coords.longitude)  {
                return;
            }
            this.user_position = [position.coords.latitude, position.coords.longitude];
            var you = new L.LatLng(position.coords.latitude, position.coords.longitude);
            if (this.user_marker) {
                this.map.removeLayer(this.user_marker);
            }
            this.user_marker = L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0});
            this.map.addLayer(this.user_marker);

            // Generally we reset the MapBounds after each new location is
            // reported unless the user has interacted with the map in someway.
            //
            // The only exception being when it's the first user position to be
            // reported in which case we always reset the map to new bounds.
            if (firstPosition || !this.mapMoved) {
                this.setMapBounds();
            }
        },

        placePOI: function(poi) {
            var feature = poi.getMapFeature();
            if (feature) {
                if (this.options.fullScreen && this.interactiveMap) {
                    // Phone View
                    feature.on('click', function(ev) {
                        Backbone.history.navigate('#/places/'+poi.id, {trigger: true, replace: false});
                    });
                } else {
                    // Tablet View
                    feature.on('click', _.bind(function(ev) {
                        var highlighted = this.collection.findWhere({'highlighted': true});
                        if (highlighted) { highlighted.set('highlighted', false); }
                        poi.set('highlighted', true);
                    }, this));
                }
                this.map.addLayer(feature);
                this.features.push(feature);
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

        resetMapContents: function(ev){
            // Remove the existing map features
            _.each(this.features, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create new list of features from search results
            this.features = [];
            this.collection.each(this.placePOI, this);
            this.setMapBounds();
        },

        cleanup: function() {
            $('html').removeClass('map');
            this.unsetCollection();
        }
    });
    MapView.extend(Backbone.Events);
    return MapView;
});
