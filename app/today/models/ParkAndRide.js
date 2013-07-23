define(['MoxieModel', 'moxie.conf', 'today/views/ParkAndRidesCard'], function(MoxieModel, conf, ParkAndRidesCard) {

    var ParkAndRide = MoxieModel.extend({
        View: ParkAndRidesCard,

        url: function() {
           return conf.urlFor('park_and_rides');
        }
    });
    return ParkAndRide;
});
