define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'hbs!places/templates/embedded_poi'],
    function($, Backbone, _, L, MoxieConf, userPosition, embeddedTemplate){
    var EmbeddedPoiView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            L.Icon.Default.imagePath = '/images/maps';
        },

        attributes: {
            'class': 'embedded-poi'
        },

        render: function() {
            this.$el.html(embeddedTemplate());
            this.map = L.map(this.$('#map')[0]).setView([MoxieConf.defaultLocation.coords.latitude, MoxieConf.defaultLocation.coords.longitude], 15, true);
            L.tileLayer('http://{s}.tile.cloudmade.com/b0a15b443b524d1a9739e92fe9dd8459/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
            userPosition.follow(this.handle_geolocation_query);
            this.requestPOI();
            return this;
        },

        navigateBack: function(ev) {
            ev.preventDefault();
            this.map.removeLayer(this.marker);
            this.cb();
            this.onClose();
        },

        invalidateMapSize: function() {
            this.map.invalidateSize();
            return this;
        },

        requestPOI: function() {
            var url = MoxieConf.urlFor('places_id') + this.options.poid;
            $.ajax({
                url: url,
                dataType: 'json'
            }).success(this.getDetail);
        },

        getDetail: function(data) {
            this.poi = new this.model(data);
            this.renderPOI();
        },

        updateMap: function() {
            if (this.user_position && this.latlng) {
                this.map.fitBounds([
                    this.user_position,
                    this.latlng
                ]);
            } else if (this.user_position) {
                this.map.panTo(this.user_position);
            } else if (this.latlng) {
                this.map.panTo(this.latlng);
            }
        },

        renderPOI: function(cb) {
            console.log(this.poi);
            this.$el.html(embeddedTemplate(this.poi));
            this.latlng = new L.LatLng(this.poi.get('lat'), this.poi.get('lon'));
            this.marker = new L.marker(this.latlng, {'title': this.poi.get('name')});
            this.marker.addTo(this.map);
            this.updateMap();            
        },

        geo_error: function(error) {
            if (!this.user_position) {
                console.log("No user location");
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
            this.updateMap();
        },

        onClose: function() {
            userPosition.unfollow(this.handle_geolocation_query);
        }

    });
    return EmbeddedPoiView;
});
