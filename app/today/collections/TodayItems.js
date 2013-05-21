define(['core/collections/MoxieCollection', 'today/models/OxfordDate', 'today/models/Weather', 'today/models/Webcam', 'today/models/RiverStatus'], function(MoxieCollection, OxfordDate, Weather, Webcam, RiverStatus) {
    var TodayItems = MoxieCollection.extend({
        fetch: function() {
            if (this.length===0) {
                this.reset([
                    new OxfordDate(),
                    new Weather(),
                    new RiverStatus(),
                    new Webcam(),
                ]);
                this.each(function(model) {
                    model.fetch();
                });
            }
        }
    });
    return TodayItems;
});
