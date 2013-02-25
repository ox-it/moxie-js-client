define(['jquery', 'backbone', 'underscore', 'leaflet', 'app', 'moxie.conf', 'moxie.position', 'places/views/DetailView', 'places/utils', 'hbs!places/templates/list-map-layout', 'hbs!places/templates/search', 'hbs!places/templates/results', 'hbs!places/templates/facets', 'core/views/InfiniteScrollView'],
    function($, Backbone, _, L, app, MoxieConf, userPosition, DetailView, placesUtils, baseTemplate, searchTemplate, resultsTemplate, facetsTemplate, InfiniteScrollView){

    var SearchView = InfiniteScrollView.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            console.log("Init!!");
            this.collection.on("reset", this.resetResults, this);
            this.collection.on("add", this.addResult, this);
            this.query = {};
            if (this.options.params && this.options.params.q) {
                this.query.q = this.options.params.q;
            }
            if (this.options.params && this.options.params.type) {
                this.query.type = this.options.params.type;
            }
            console.log(this.query);
            this.user_position = null;
        },

        manage: true,

        // Event Handlers
        events: {
            'click .results-list > a': "clickResult",
            'keypress :input': "searchEvent",
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
            console.log("cliked");
            e.preventDefault();
            // Find the POID from the click event
            var poid = $(e.target).data('poid');
            // We may have clicked on the actual LI element or a child... so search up parents
            // TODO: Find a better way of doing this...
            poid = (poid!==undefined) ? poid : $(e.target).parents('[data-poid]').data('poid');
            var poi = this.collection.get(poid);
            poi.set({selected: true});
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
            this.collection.reset(data._embedded.pois);
        },

        addResult: function(poi) {
            // Append an individual result to the existing results-list
            var context = {
                results: [poi],
                query: this.query.q
            };
            this.$(".results-list").append(resultsTemplate(context));
        },

        resetResults: function(collection) {
            this.afterRender();
        },

        template: searchTemplate,
        serialize: function() { return {query: this.query.q}; },

        afterRender: function() {
            console.log("rendering");
            Backbone.trigger('domchange:title', "Search for Places of Interest");
            userPosition.follow(this.handle_geolocation_query);

            var options = {windowScroll: true, scrollElement: this.el, scrollThreshold: 0.7};
            InfiniteScrollView.prototype.initScroll.apply(this, [options]);
            // TODO: Handle redirecting when we only have 1 result
            // Events may not have been delegated (using 'back' button)
            this.delegateEvents(this.events);
            // Create the results-list div and search query input
            // Actually populate the results-list
            var context = {
                results: this.collection.toArray(),
                query: this.query.q
            };
            this.$(".results-list").html(resultsTemplate(context));
            if (this.query.type && this.facets && this.facets.length > 1) {
                this.$(".facet-list").html(facetsTemplate({facets: this.facets}));
            }
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
            this.collection.add(data._embedded.pois);
            this.setMapBounds();
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
