define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'hbs!templates/base', 'hbs!places/templates/detail', 'hbs!places/templates/busrti'],
    function($, Backbone, _, L, MoxieConf, userPosition, baseTemplate, detailTemplate, busRTITemplate){
    var DetailView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            L.Icon.Default.imagePath = '/images/maps';
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
            userPosition.follow(this.handle_geolocation_query);
            this.requestPOI();
            return this;
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

        renderPOI: function() {
            var context = {'poi': this.poi};
            this.$el.find("#list").html(detailTemplate(context));
            this.latlng = new L.LatLng(this.poi.get('lat'), this.poi.get('lon'));
            var marker = new L.marker(this.latlng, {'title': this.poi.get('name')});
            marker.addTo(this.map);
            this.updateMap();
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
            this.updateMap();
        },

        onClose: function() {
            userPosition.unfollow(this.handle_geolocation_query);
        }

    });
    return DetailView;
});
