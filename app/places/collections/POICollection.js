define(["core/collections/MoxieCollection", "underscore", "places/models/POIModel", "moxie.conf", 'moxie.position'], function(MoxieCollection, _, POI, conf, userPosition) {

    var POIs = MoxieCollection.extend({
        model: POI,

        initialize: function(query) {
            this.query = query || {};
        },

        followUser: function() {
            userPosition.follow(this.handle_geolocation_query, this);
        },

        unfollowUser: function() {
            userPosition.unfollow(this.handle_geolocation_query, this);
        },

        latestUserPosition: null,
        geoFetch: function(options) {
            // Set a boolean for while the fetch is inflight
            this.ongoingFetch = true;
            options = options || {};
            options.headers = options.headers || {};
            var position = this.latestUserPosition || userPosition.getCurrentLocation();
            position = [position.coords.latitude, position.coords.longitude];
            options.headers['Geo-Position'] = position.join(';');
            return this.fetch(options);
        },

        handle_geolocation_query: function(position) {
            this.latestUserPosition = position;
            this.geoFetch();
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
            // Fetch over
            this.ongoingFetch = false;
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
