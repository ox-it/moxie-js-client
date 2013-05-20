define(['core/collections/MoxieCollection', 'today/models/OxfordDate'], function(MoxieCollection, OxfordDate) {
    var TodayItems = MoxieCollection.extend({
        fetch: function() {
            if (this.length===0) {
                this.reset([
                    new OxfordDate(),
                ]);
                this.each(function(model) {
                    model.fetch();
                });
            }
        }
    });
    return TodayItems;
});
