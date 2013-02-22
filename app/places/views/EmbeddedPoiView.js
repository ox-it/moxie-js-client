define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'hbs!places/templates/embedded_poi'],
    function($, Backbone, _, L, MoxieConf, userPosition, embeddedTemplate){
    var EmbeddedPoiView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.requestPOI();
        },

        requestPOI: function() {
            var url = MoxieConf.urlFor('places_id') + this.options.poid;
            $.ajax({
                url: url,
                dataType: 'json'
            }).success(this.renderPOI);
        },

        renderPOI: function(data) {
            this.$el.html(embeddedTemplate(data));
            this.renderMap(data);
        },

        renderMap: function(data) {
            this.map = new L.map(this.$('.embedded_map')[0], {dragging: false, scrollWheelZoom: false, touchZoom: false, doubleClickZoom: false, boxZoom: false})
                .setView([data.lat, data.lon], 15, true);
            L.tileLayer('http://{s}.tile.cloudmade.com/'+MoxieConf.cloudmade.key+'/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
            this.latlng = new L.LatLng(data.lat, data.lon);
            this.marker = new L.marker(this.latlng, {'title': data.name});
            this.marker.addTo(this.map);
        }
    });
    return EmbeddedPoiView;
});
