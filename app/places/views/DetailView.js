define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'hbs!templates/base', 'hbs!places/templates/detail', 'hbs!places/templates/busrti'],
    function($, Backbone, _, L, MoxieConf, baseTemplate, detailTemplate, busRTITemplate){
    var DetailView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            L.Icon.Default.imagePath = '/images/maps';
            var wpid = navigator.geolocation.watchPosition(this.handle_geolocation_query, this.geo_error, {maximumAge:60000, timeout:20000});
            if (this.options.poi) {
                this.poi = this.options.poi;
                this.renderPOI();
            } else {
                var headers;
                if (this.user_position) {
                    headers = {'Geo-Position': this.user_position.join(';')};
                }
                var url = MoxieConf.urlFor('places_id') + this.options.poid;
                $.ajax({
                    url: url,
                    dataType: 'json',
                    headers: headers
                }).success(this.getDetail);
            }
        },

        getDetail: function(data) {
            this.poi = new this.model(data);
            this.renderPOI();
        },

        render: function() {
            this.$el.html(baseTemplate());
            this.map = L.map(this.$el.find('#map')[0]).setView([51.75310, -1.2600], 15);
            L.tileLayer('http://{s}.tile.cloudmade.com/b0a15b443b524d1a9739e92fe9dd8459/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
            return this;
        },

        invalidateMapSize: function() {
            this.map.invalidateSize();
            return this;
        },

        renderPOI: function() {
            var context = {'poi': this.poi};
            $("#list").html(detailTemplate(context));
            this.latlng = new L.LatLng(this.poi.get('lat'), this.poi.get('lon'));
            var marker = new L.marker(this.latlng, {'title': this.poi.get('name')});
            marker.addTo(this.map);
            if (this.user_position) {
                this.map.fitBounds([
                    this.user_position,
                    this.latlng
                ]);
            } else {
                this.map.panTo(this.latlng);
            }
            if (this.poi.has('hasRti')) {
                var url = MoxieConf.endpoint + this.poi.get('hasRti');
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).success(this.renderRTI);
            }
        },

        renderRTI: function(data) {
            this.$el.find('#poi-rti').html(busRTITemplate(data));
        },

        geo_error: function(error) {
            if (!this.user_position) {
                console.log("No user location");
            }
        },

        handle_geolocation_query: function(position) {
            this.user_position = [position.coords.latitude, position.coords.longitude];
            var you = new L.LatLng(position.coords.latitude, position.coords.longitude);
            L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0}).addTo(this.map);
            this.map.fitBounds([
                this.user_position,
                this.latlng
            ]);
        }

    });
    return DetailView;
});
