define(['jquery', 'backbone', 'underscore', 'leaflet', 'app', 'moxie.conf', 'moxie.position', 'places/views/DetailView', 'places/utils', 'hbs!places/templates/list-map-layout', 'hbs!places/templates/search', 'hbs!places/templates/results', 'hbs!places/templates/facets', 'core/views/InfiniteScrollView'],
    function($, Backbone, _, L, app, MoxieConf, userPosition, DetailView, placesUtils, baseTemplate, searchTemplate, resultsTemplate, facetsTemplate, InfiniteScrollView){

    var SearchView = InfiniteScrollView.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.collection.on("reset", this.resetResults, this);
            this.collection.on("add", this.addResult, this);
            this.query = {};
            if (this.options.params && this.options.params.q) {
                this.query.q = this.options.params.q;
            }
            if (this.options.params && this.options.params.type) {
                this.query.type = this.options.params.type;
            }
            this.user_position = null;
            this.markers = [];
        },

        attributes: {
            'class': 'list-map'
        },

        // Event Handlers
        events: {
            'keypress :input': "searchEvent",
            'click .results-list > a': "clickResult",
            'click .deleteicon': "clearSearch",
            'click .facet-list > li[data-category]': "clickFacet"
        },

        clearSearch: function(e) {
            this.$('.search-input input').val('').focus();
        },

        clickFacet: function(e) {
            e.preventDefault();
            this.query.type = $(e.target).data('category');
            this.search();
        },

        clickResult: function(e) {
            e.preventDefault();
            // Find the POID from the click event
            var poid = $(e.target).data('poid');
            // We may have clicked on the actual LI element or a child... so search up parents
            // TODO: Find a better way of doing this...
            poid = (poid!==undefined) ? poid : $(e.target).parents('[data-poid]').data('poid');
            var poi = this.collection.get(poid);
            this.browseDetails(poi, _.bind(this.render_results, this, true), true);
        },

        highlightResult: function(poi) {
            // Remove any existing Highlighted classes
            this.$('li.highlighted').removeClass('highlighted');
            var resultLi = this.$('li[data-poid="'+poi.id+'"]');
            resultLi.addClass('highlighted');
            this.$('#list').scrollTop((this.$('#list').scrollTop() + resultLi.position().top) - 70);
        },

        browseDetails: function(poi, cb, replace) {
            // Browse to a given POI, passing in a callback to be called when the back button is pressed
            // Use the 'replace' to silently change the URL without writing history -- used for displaying 1 result
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
            app.navigate('/places/'+poi.id, {replace: replace});
        },

        placePOI: function(poi) {
            if(poi.attributes.lat && poi.attributes.lon) {
                var latlng = new L.LatLng(poi.attributes.lat, poi.attributes.lon);
                var marker = new L.marker(latlng, {'title': poi.attributes.name, 'data-poid': poi.id});
                marker.on('click', _.bind(function(ev) {
                    var highlightedPOI = this.collection.get(ev.target.options['data-poid']).set('highlighted', true);
                    this.highlightResult(highlightedPOI);
                    return false;
                }, this));
                marker.addTo(this.map);
                this.markers.push(marker);
            }
        },

        setMapBounds: function() {
            latlngs = [];
            query = this.query;
            this.collection.each(function(poi) {
                if (query.q || ((Math.pow((poi.get('distance')*1000), MoxieConf.map.bounds.exponent) * (latlngs.length + 1)) < MoxieConf.map.bounds.limit)) {
                    latlngs.push(new L.LatLng(poi.get('lat'), poi.get('lon')));
                }
            });
            if (latlngs.length === 0) {
                _.each(this.collection.first(MoxieConf.map.bounds.fallback), function(poi) {
                    latlngs.push(new L.LatLng(poi.get('lat'), poi.get('lon')));
                });
            }
            var bounds = new L.LatLngBounds(latlngs);
            if (this.user_position) {
                bounds.extend(this.user_position);
            }
            bounds.pad(5);
            this.map.fitBounds(bounds);
        },

        resetMapContents: function(){
            // Remove the existing map markers
            _.each(this.markers, function(marker) {
                this.map.removeLayer(marker);
            }, this);
            // Create new list of markers from search results
            this.markers = [];
            this.collection.each(this.placePOI);
            this.setMapBounds();
        },

        searchEvent: function(ev) {
            if (ev.which === 13) {
                this.query.q = ev.target.value;
                this.search();
            }
        },

        getPath: function() {
            var qstring = $.param(this.query);
            var searchPath = MoxieConf.pathFor('places_search');
            if (qstring) {
                searchPath += ('?' + qstring);
            }
            return searchPath;
        },

        search: function() {
            var headers;
            var path = this.getPath().replace(/\+/g, "%20");
            var url = MoxieConf.endpoint + path;
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
            // Called when we want to empty the existing collection
            // For example when a search is issued and we clear the existing results.
            this.next_results = data._links['hl:next'];
            this.facets = data._links['hl:types'];
            this.collection.reset(data._embedded);
        },

        addResult: function(poi) {
            // Append an individual result to the existing results-list
            var context = {
                results: [poi],
                query: this.query.q
            };
            this.$(".results-list").append(resultsTemplate(context));
            this.placePOI(poi);
        },

        resetResults: function(collection) {
            this.render_results();
        },

        render_results: function(back_button) {
            if (this.collection.length===1 && (back_button===undefined || !back_button)) {
                // We have only one result and the user hasn't navigated back
                // Set a curried callback bound with back_button=true:
                // This means if a user clicks back they get the results page with a single result
                this.browseDetails(this.collection.at(0), _.bind(this.render_results, this, true), true);
                return this;
            } else if (back_button) {
                app.navigate(this.getPath(), {replace: true});
                if (app.startingPage()) {
                    app.showHome();
                } else {
                    app.showBack();
                }
            }
            // Events may not have been delegated (using 'back' button)
            this.delegateEvents(this.events);
            // Create the results-list div and search query input
            this.$('#list').html(searchTemplate({query: this.query.q}));
            // Actually populate the results-list
            var context = {
                results: this.collection.toArray(),
                query: this.query.q
            };
            this.$(".results-list").html(resultsTemplate(context));
            if (this.query.type && this.facets && this.facets.length > 1) {
                this.$(".facet-list").html(facetsTemplate({facets: this.facets}));
            }
            this.resetMapContents();
        },

        render: function() {
            Backbone.trigger('domchange:title', "Search for Places of Interest");
            this.$el.html(baseTemplate());
            this.map = placesUtils.getMap(this.$('#map')[0]);
            userPosition.follow(this.handle_geolocation_query);

            var options = {windowScroll: true, scrollElement: this.$('#list')[0], scrollThreshold: 0.7};
            InfiniteScrollView.prototype.initScroll.apply(this, [options]);
            return this;
        },

        scrollCallbacks: [function() {
                if (this.next_results) {
                    if (this.user_position) {
                        headers = {'Geo-Position': this.user_position.join(';')};
                    }
                    $.ajax({
                        url: MoxieConf.endpoint + this.next_results.href,
                        dataType: 'json',
                        headers: headers
                    }).success(this.extendPOIs);
                }
        }],

        extendPOIs: function(data) {
            // Used when the collection is extended through infinite scrolling
            this.next_results = data._links['hl:next'];
            this.infiniteScrollEnabled = Boolean(this.next_results);
            this.facets = data._links['hl:types'];
            this.collection.add(data._embedded);
            this.setMapBounds();
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
            InfiniteScrollView.prototype.onClose.apply(this);
            userPosition.unfollow(this.handle_geolocation_query);
        }
    });

    // Returns the View class
    return SearchView;
});
