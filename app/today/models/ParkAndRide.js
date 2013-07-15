define(['backbone', 'moxie.conf', 'today/views/ParkAndRidesCard'], function(Backbone, conf, ParkAndRidesCard) {

    var ParkAndRide = Backbone.Model.extend({
        View: ParkAndRidesCard,

        url: function() {
           return conf.urlFor('park_and_rides');
        }
    });
    return ParkAndRide;
});
