define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet', 'moxie.conf'], function($, Backbone, _, Handlebars, L, MoxieConf){
    var DetailView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            this.render();
            var wpid = navigator.geolocation.watchPosition(this.handle_geolocation_query, this.geo_error, {maximumAge:60000, timeout:20000});
            if (this.options.poi) {
                this.poi = this.options.poi;
                this.renderPOI();
            } else {
                var headers;
                if (this.user_position) {
                    headers = {'Geo-Position': this.user_position.join(';')};
                }
                var url = MoxieConf.endpoint+"/places/"+this.options.poid;
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
            $("#content").html(Handlebars.templates.base());
            this.map = L.map('map').setView([51.75310, -1.2600], 15);
            L.tileLayer('http://{s}.tile.cloudmade.com/b0a15b443b524d1a9739e92fe9dd8459/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
        },

        renderPOI: function() {
            var context = {'poi': this.poi};
            $("#list-bar").html(Handlebars.templates.detail(context));
            var latlng = new L.LatLng(this.poi.get('lat'), this.poi.get('lon'));
            var marker = new L.marker(latlng, {'title': this.poi.get('name')});
            marker.addTo(this.map);
            if (this.poi.has('hasRti')) {
                var url = MoxieConf.endpoint + this.poi.get('hasRti');
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).success(this.renderRTI);
            }
        },

        renderRTI: function(data) {
            $('#poi-rti').html(Handlebars.templates.busrti(data));
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
            this.map.panTo(you);
        }

    });
    return DetailView;
});
