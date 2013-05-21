define(['core/collections/MoxieCollection', 'today/models/OxfordDate', 'today/models/Weather', 'today/models/RiverStatus'], function(MoxieCollection, OxfordDate, Weather, RiverStatus) {
    var TodayItems = MoxieCollection.extend({
        fetch: function() {
            if (this.length===0) {
                this.reset([
                    new OxfordDate(),
                    new Weather(),
                    new RiverStatus(),
                ]);
                this.each(function(model) {
                    model.fetch();
                });
            }
        }
    });
    return TodayItems;
});
