define(['app/core/models/MoxieModel', 'underscore', 'moment', 'app/moxie.conf', 'app/today/views/RiversCard'], function(MoxieModel, _, moment, conf, RiversCard) {
    var RiverStatus = MoxieModel.extend({
        url: conf.urlFor('rivers'),
        View: RiversCard,
        parse: function(data) {
            data.lastUpdated = moment(data._last_updated, 'YYYY-MM-DD HH:mm:ss').fromNow();
            return data;
        },
    });
    return RiverStatus;
});
