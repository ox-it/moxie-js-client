define(["backbone", "underscore", "places/models/POIModel", "today/views/RTICard", "moxie.conf", "moxie.position"], function(Backbone, _, POI, RTICard, conf, userPosition) {

    var NearbyRTI = POI.extend({
        initialize: function() {
            this.followUser();
        },
        View: RTICard,

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
           return conf.urlFor('places_search') + '?type_exact=/transport/rail-station&type_exact=/transport/bus-stop&count=1';
        },

        parse: function(data) {
            return POI.prototype.parse.apply(this, [data._embedded.pois[0]]);
        }
    });
    return NearbyRTI;
});
