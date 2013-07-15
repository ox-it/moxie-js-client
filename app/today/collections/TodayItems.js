define(['core/collections/MoxieCollection', 'today/models/OxfordDate', 'today/models/Weather', 'today/models/Webcam', 'today/models/RiverStatus', 'today/models/BusStop', 'today/models/ParkAndRide'], function(MoxieCollection, OxfordDate, Weather, Webcam, RiverStatus, BusStop, ParkAndRide) {
    var TodayItems = MoxieCollection.extend({
        fetch: function() {
            if (this.length===0) {
                this.reset([
                    new OxfordDate(),
                    new Weather(),
                    new RiverStatus(),
                    new Webcam(),
                    new BusStop(),
                    new ParkAndRide()
                ]);
                this.each(function(model) {
                    model.fetch();
                });
            }
        }
    });
    return TodayItems;
});
