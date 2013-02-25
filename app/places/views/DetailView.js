define(['jquery', 'backbone', 'underscore', 'leaflet', 'app', 'moxie.conf', 'moxie.position', 'places/utils', 'hbs!places/templates/list-map-layout', 'hbs!places/templates/detail', 'hbs!places/templates/busrti'],
    function($, Backbone, _, L, app, MoxieConf, userPosition, placesUtils, baseTemplate, detailTemplate, busRTITemplate){

    var RTI_REFRESH = 15000;    // 15 seconds

    var DetailView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            console.log("init", this.model);
        },

        attributes: {
            'class': 'detail-map'
        },

        navigateBack: function(ev) {
            ev.preventDefault();
            if(this.marker) {
                this.map.removeLayer(this.marker);
            }
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

        serialize: function() {
            console.log("serializing");
            var rti = this.model.attributes._links['hl:rti'];
            return {'poi': this.model, 'rti': rti};
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

        template: detailTemplate,
        manage: true,

        renderPOI: function(cb) {
            if (cb) {
                this.delegateEvents(this.events);
                this.cb = cb;
                app.showBack(this.navigateBack);
            }
            Backbone.trigger('domchange:title', this.poi.attributes.name);
            this.$("#list").html(detailTemplate(context));
        },

        renderRTI: function(data) {
            this.$('#poi-rti').html(busRTITemplate(data));
            this.$("#rti-load").hide();
        },

        refreshRTI: function() {
            this.$("#rti-load").show();
            $.ajax({
                url: MoxieConf.endpoint + this.rti.href,
                dataType: 'json'
            }).success(this.renderRTI);
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
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
