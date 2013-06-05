define(['backbone', 'underscore', 'moment', 'moxie.conf', 'today/views/RiversCard'], function(Backbone, _, moment, conf, RiversCard) {
    var RiverStatus = Backbone.Model.extend({
        url: conf.urlFor('rivers'),
        View: RiversCard,
        parse: function(data) {
            data.lastUpdated = moment(data._last_updated, 'YYYY-MM-DD HH:mm:ss').fromNow();
            return data;
        },
    });
    return RiverStatus;
});
