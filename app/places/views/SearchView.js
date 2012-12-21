define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'places/views/DetailView', 'hbs!places/templates/base', 'hbs!places/templates/search', 'hbs!places/templates/results'],
    function($, Backbone, _, L, MoxieConf, userPosition, DetailView, baseTemplate, searchTemplate, resultsTemplate){

    var SearchView = Backbone.View.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            L.Icon.Default.imagePath = '/images/maps';
            this.collection.on("add remove reset", this.collectionUpdated, this);
            this.query = {};
            if (this.options.params && this.options.params.q) {
                this.query.q = this.options.params.q;
            }
            if (this.options.params && this.options.params.type) {
                this.query.type = this.options.params.type;
            }
            this.user_position = null;
            this.latlngs = [];
            this.markers = [];
        },

        attributes: {
            'class': 'list-map'
        },

        // Event Handlers
        events: {
            'keypress :input': "searchEvent",
            'click .results-list > a': "clickResult"
        },

        clickResult: function(e) {
            e.preventDefault();
            // Find the POID from the click event
            var poid = $(e.target).data('poid');
            // We may have clicked on the actual LI element or a child... so search up parents
            // TODO: Find a better way of doing this...
            poid = (poid!==undefined) ? poid : $(e.target).parents('[data-poid]').data('poid');
            var poi = this.collection.get(poid);
            this.browseDetails(poi, _.bind(this.render_results, this, true));
        },

        browseDetails: function(poi, cb) {
            // Remove existing map markers
            _.each(this.markers, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create the detailView with the existing view element
            var detailView = new DetailView({el: this.el});
            detailView.map = this.map;
            detailView.user_position = this.user_position;
            detailView.poi = poi;
            detailView.renderPOI(cb);
            // Cleanup and navigate
            this.undelegateEvents();
            this.onClose();
            console.log(poi.id);
            Backbone.history.navigate('/places/'+poi.id, {replace:false});
        },

        update_map_markers: function(){
            // Remove the existing map markers
            _.each(this.markers, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create new list of markers from search results
            var markers = [];
            var latlngs = [];
            var map = this.map;
            this.collection.each(function(poi) {
                console.log(poi);
                var latlng = new L.LatLng(poi.attributes.lat, poi.attributes.lon);
                var marker = new L.marker(latlng, {'title': poi.attributes.name});
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
            this.map.fitBounds(bounds);
        },

        searchEvent: function(ev) {
            if (ev.which === 13) {
                this.query.q = ev.target.value;
                this.search();
            }
        },

        initial_path_update: true,
        updatePath: function() {
            var qstring = $.param(this.query);
            var path;
            if (qstring) {
                path = MoxieConf.pathFor('places_search') + '?' + qstring;
            } else {
                path = MoxieConf.pathFor('places_search');
            }
            Backbone.history.navigate(path, {trigger: false, replace: this.initial_path_update});
            this.initial_path_update = false;
            return MoxieConf.endpoint + path;
        },

        search: function() {
            var headers;
            var url = this.updatePath();
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
            this.collection.reset(data._embedded.results);
        },

        collectionUpdated: function() {
            this.render_results(false);
        },

        render_results: function(back_button) {
            if (this.collection.length===1 && (back_button===undefined || !back_button)) {
                // We have only one result and the user hasn't navigated back
                // Set a curried callback bound with back_button=true:
                // This means if a user clicks back they get the results page with a single result
                this.browseDetails(this.collection.at(0), _.bind(this.render_results, this, true));
                return this;
            }
            // Events may not have been delegated (using 'back' button)
            this.delegateEvents(this.events);
            Backbone.trigger('domchange:title', "Search for Places of Interest");
            this.updatePath();
            $('#home').show();
            $('#back').hide();
            // Create the results-list div and search query input
            this.$('#list').html(searchTemplate({query: this.query.q}));
            // Actually populate the results-list
            var context = {results: this.collection.toArray(), query: this.query.q};
            this.$(".results-list").html(resultsTemplate(context));
            this.update_map_markers();
        },

        render: function() {
            this.$el.html(baseTemplate());
            this.map = L.map(this.$('#map')[0]).setView([MoxieConf.defaultLocation.coords.latitude, MoxieConf.defaultLocation.coords.longitude], 15, true);
            L.tileLayer('http://{s}.tile.cloudmade.com/b0a15b443b524d1a9739e92fe9dd8459/997/256/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(this.map);
            this.map.attributionControl.setPrefix('');
            userPosition.follow(this.handle_geolocation_query);
            return this;
        },

        invalidateMapSize: function() {
            this.map.invalidateSize();
            return this;
        },

        geo_error: function(error) {
            if (!this.user_position) {
                console.log("No user location");
            }
            this.search();
        },

        initial_call: true,
        user_marker: null,
        handle_geolocation_query: function(position) {
            this.user_position = [position.coords.latitude, position.coords.longitude];
            var you = new L.LatLng(position.coords.latitude, position.coords.longitude);
            if (this.user_marker) {
                this.map.removeLayer(this.user_marker);
            }
            this.user_marker = L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0});
            this.map.addLayer(this.user_marker);
            if (this.initial_call) {
                this.initial_call = false;
                this.search();
            }
        },

        onClose: function() {
            userPosition.unfollow(this.handle_geolocation_query);
        }
    });

    // Returns the View class
    return SearchView;
});
