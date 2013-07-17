define(["core/collections/MoxieCollection", "library/models/ItemModel", "places/collections/POICollection", "moxie.conf", "moxie.position"], function(MoxieCollection, Item, POIs, conf, userPosition) {

    var Items = MoxieCollection.extend({

        model: Item,

        initialize: function(query, pois) {
            this.query = query || {};
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
