define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet'], function($, Backbone, _, Handlebars, L){

    var View = Backbone.View.extend({

        id: 'content',

        // View constructor
        initialize: function() {
            _.bindAll(this);
            console.log(this.options);
            this.q = this.options.params.q ? this.options.params.q : '';
            this.user_position = null;
            this.render();
            var wpid = navigator.geolocation.watchPosition(this.handle_geolocation_query, this.geo_error, {maximumAge:60000, timeout:20000});
        },

        // Event Handlers
        events: {
        },

        // Renders all of the Search results (POIs) onto the UI
        render: function() {
            $("#content").html(Handlebars.templates.search());
            this.map = L.map('map').setView([51.75310, -1.2600], 15);
            L.tileLayer('http://{s}.tile.cloudmade.com/b0a15b443b524d1a9739e92fe9dd8459/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
        },
        geo_error: function(error) {
            if (!this.user_position) {
                console.log("No user location");
            }
        },
        handle_geolocation_query: function(position) {
            this.user_position = [position.coords.latitude, position.coords.longitude];
            var you = new L.LatLng(position.coords.latitude, position.coords.longitude)
            L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0}).addTo(this.map)
            this.map.panTo(you);
        },

    });

    // Returns the View class
    return View;
});
