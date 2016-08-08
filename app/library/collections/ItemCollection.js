define(["app/core/collections/MoxieCollection", "app/library/models/ItemModel", "app/places/collections/POICollection", "app/moxie.conf", "app/moxie.position"], function(MoxieCollection, Item, POIs, conf, userPosition) {

    var Items = MoxieCollection.extend({

        model: Item,

        initialize: function(query, pois) {
            this.query = query || {};
            this.on('errorFetching', this.errorFetchingResults, this);
        },

        errorFetchingResults: function() {
            this.ongoingFetch = false;
        },

        followUser: function() {
            userPosition.follow(this.handle_geolocation_query, this);
        },

        unfollowUser: function() {
            userPosition.unfollow(this.handle_geolocation_query, this);
        },

        fetch: function(options) {
            this.ongoingFetch = true;
            return MoxieCollection.prototype.fetch.apply(this, [options]);
        },

        fetchNextPage: function() {
            if (this.next_results) {
                var urlFunc = this.url;
                this.url = conf.endpoint + this.next_results.href;
                this.fetch({update: true, remove: false});
                this.url = urlFunc;
            } else {
                return false;
            }
        },

        parse: function(data) {
            // Fetched
            this.ongoingFetch = false;
            // Called when we want to empty the existing collection
            // For example when a search is issued and we clear the existing results.
            this.next_results = data._links['hl:next'];
            return data._embedded.items;
        },

        url: function() {
            var qstring = $.param(this.query);
            var searchPath = conf.pathFor('library_search');
            if (qstring) {
                searchPath += ('?' + qstring);
            }
            return conf.endpoint + searchPath.replace(/\+/g, "%20");
        }

    });

    return Items;

});
