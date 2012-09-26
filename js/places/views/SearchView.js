define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet', 'moxie.conf'], function($, Backbone, _, Handlebars, L, MoxieConf){

    var SearchView = Backbone.View.extend({

        id: 'content',

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.collection.on("add remove reset", this.render_results, this);
            this.query = (this.options.params && this.options.params.q) ? this.options.params.q : '';
            this.user_position = null;
            this.latlngs = [];
            this.markers = [];
            var wpid = navigator.geolocation.watchPosition(this.handle_geolocation_query, this.geo_error, {maximumAge:60000, timeout:20000});
        },

        // Event Handlers
        events: {
            'keypress :input': "searchEvent"
        },

        update_map_markers: function(){
            var map = this.map;
            // Remove the existing map markers
            $.each(this.markers, function(index) {
                map.removeLayer(this);
            });
            // Create new list of markers from search results
            var markers = [];
            var latlngs = [];
            $('.results-list li').each(function(index) {
                var latlng = new L.LatLng($(this).data('lat'), $(this).data('lon'));
                var marker = new L.marker(latlng, {'title': $(this).find('h3').text()});
                marker.addTo(map);
                latlngs.push(latlng);
                markers.push(marker);
            });
            this.markers = markers;
            this.latlngs = latlngs;
            // Create map bounds based on our position and the results.
            var bounds = new L.LatLngBounds(latlngs);
            if (this.user_position) {
                bounds.extend(this.user_position);
            }
            bounds.pad(5);
            map.fitBounds(bounds);
        },

        searchEvent: function(ev) {
            if (ev.which == 13) {
                this.query = ev.target.value;
                this.search();
            }
        },

        search: function() {
            var qstring = this.query ? "?"+$.param({'q': this.query}) : '';
            var path = MoxieConf.pathFor('places_search') + qstring;
            var url = MoxieConf.endpoint + path;
            this.goTo(path);
            var headers;
            if (this.user_position) {
                headers = {'Geo-Position': this.user_position.join(';')};
            }
            $.ajax({
                url: url,
                dataType: 'json',
                headers: headers
            }).success(this.createPOIs);
        },

        createPOIs: function(data) {
            this.collection.reset(data.results);
        },

        render_results: function() {
            var context = {'results': this.collection.toArray()};
            $(".results-list").html(Handlebars.templates.results(context));
            this.update_map_markers();
        },

        render: function() {
            $("#content").html(Handlebars.templates.search());
            this.map = L.map('map').setView([51.75310, -1.2600], 15);
            L.tileLayer('http://{s}.tile.cloudmade.com/b0a15b443b524d1a9739e92fe9dd8459/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
            this.setElement($('#content'));
            this.delegateEvents(this.events);
        },
        geo_error: function(error) {
            if (!this.user_position) {
                console.log("No user location");
            }
            this.search();
        },
        handle_geolocation_query: function(position) {
            this.user_position = [position.coords.latitude, position.coords.longitude];
            var you = new L.LatLng(position.coords.latitude, position.coords.longitude);
            L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0}).addTo(this.map);
            this.map.panTo(you);
            this.search();
        }
    });

    // Returns the View class
    return SearchView;
});
