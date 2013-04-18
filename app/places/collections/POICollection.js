define(["backbone", "underscore", "places/models/POIModel", "moxie.conf", 'moxie.position'], function(Backbone, _, POI, conf, userPosition) {

    // Limit how often we search when the users geo position updates
    // Default to 2 seconds
    var GEOSEARCH_FREQ_LIMIT = 2000;
    var POIs = Backbone.Collection.extend({

        model: POI,

        initialize: function(query) {
            this.query = query || {};
        },

        followUser: function() {
            userPosition.follow(_.bind(this.handle_geolocation_query, this));
        },

        unfollowUser: function() {
            userPosition.unfollow(_.bind(this.handle_geolocation_query, this));
        },

        geoFetch: function(options) { return this.fetch(options); },
        recentlySearched: false,
        handle_geolocation_query: function(position) {
            var geoFetch = function(options) {
                options = options || {};
                options.headers = options.headers || {};
                options.headers['Geo-Position'] = [position.coords.latitude, position.coords.longitude].join(';');
                this.fetch(options);
            };
            this.geoFetch = _.bind(geoFetch, this);
            if (!this.recentlySearched) {
                this.geoFetch();
                this.recentlySearched = true;
                window.setTimeout(_.bind(function() {this.recentlySearched = false;}, this), GEOSEARCH_FREQ_LIMIT);
            }
        },

        fetchNextPage: function() {
            if (this.next_results) {
                var urlFunc = this.url;
                this.url = conf.endpoint + this.next_results.href;
                this.geoFetch({update: true, remove: false});
                this.url = urlFunc;
            } else {
                return false;
            }
        },

        parse: function(data) {
            // Called when we want to empty the existing collection
            // For example when a search is issued and we clear the existing results.
            this.next_results = data._links['hl:next'];
            this.facets = data._links['hl:types'];
            return data._embedded.pois;
        },

        url: function() {
            var qstring = $.param(this.query);
            var searchPath = conf.pathFor('places_search');
            if (qstring) {
                searchPath += ('?' + qstring);
            }
            return conf.endpoint + searchPath.replace(/\+/g, "%20");
        }


    });

    // Returns the Model class
    return POIs;

});
