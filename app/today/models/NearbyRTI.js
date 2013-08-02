define(["backbone", "underscore", "places/models/POIModel", "today/views/NearbyRTICard", "moxie.conf", "moxie.position"], function(Backbone, _, POI, NearbyRTICard, conf, userPosition) {

    var NearbyRTI = POI.extend({
        initialize: function(options) {
            options = options || {};
            this.favouritePOIs = options.favouritePOIs || [];
            this.followUser();
        },
        View: NearbyRTICard,

        followUser: function() {
            userPosition.follow(this.handle_geolocation_query, this);
        },

        unfollowUser: function() {
            userPosition.unfollow(this.handle_geolocation_query, this);
        },

        userLatLon: null,
        handle_geolocation_query: function(position) {
            this.userLatLon = [position.coords.latitude, position.coords.longitude];
            this.fetch({reset: true});
        },

        fetch: function(options) {
            options = options || {};
            if (this.userLatLon) {
                options.headers = options.headers || {};
                options.headers['Geo-Position'] = this.userLatLon.join(';');
                return Backbone.Model.prototype.fetch.apply(this, [options]);
            }
        },

        url: function() {
           return conf.urlFor('places_search') + '?type_exact=/transport/rail-station&type_exact=/transport/bus-stop&count=' + conf.today.nearbyRTI.fetchCount;
        },

        parse: function(data) {
            // Find a POI which doesn't appear in the users favourites
            var poi = _.find(data._embedded.pois, function(poi) {
                return !_.contains(this.favouritePOIs, poi.id);
            }, this);
            if (poi) {
                return POI.prototype.parse.apply(this, [poi]);
            }
        }
    });
    return NearbyRTI;
});
