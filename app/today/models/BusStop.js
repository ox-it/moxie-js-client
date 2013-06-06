define(["backbone", "underscore", "today/views/BusCard", "moxie.conf", "moxie.position"], function(Backbone, _, BusCard, conf, userPosition) {

    var Bus = Backbone.Model.extend({
        initialize: function(query) {
            this.followUser();
        },
        View: BusCard,

        followUser: function() {
            userPosition.follow(_.bind(this.handle_geolocation_query, this));
        },

        unfollowUser: function() {
            userPosition.unfollow(_.bind(this.handle_geolocation_query, this));
        },

        userLatLon: null,
        handle_geolocation_query: function(position) {
            this.userLatLon = [position.coords.latitude, position.coords.longitude];
            this.fetch({reset: true});
        },

        url: function() {
           return conf.urlFor('places_search') + '?type=/transport/bus-stop&count=1';
        },

        getRTI: function() {
            if (this.attributes._links && this.attributes._links['hl:rti']) {
                return this.attributes._links['hl:rti'];
            }
        },

        parse: function(data) {
            return data._embedded.pois[0];
        }
    });
    return Bus;
});
