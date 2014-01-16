define(["underscore", "MoxieModel", "moxie.conf", "moment"], function(_, MoxieModel, conf, moment) {
    var DEFAULT_FORMAT = "D MMM YYYY, HH:mm";
    var today = moment(new Date());
    function dateFormat(date) {
        try {
            return date.format(DEFAULT_FORMAT);
        } catch (err) {
            if ('console' in window) {
                console.log(err);
            }
            return "";
        }
    }
    var Notification = MoxieModel.extend({
        url: function() {
            return conf.urlFor('notifications_id') + this.id;
        },
        parse: function(data) {
            if (data.timestamp) {
                var timestamp = moment(data.timestamp);
                data.timestampFormatted = dateFormat(timestamp);
            }
            if (data._embedded && data._embedded.followups) {
                _.each(data._embedded.followups, function(followup) {
                    followup.timestampFormatted = dateFormat(moment(followup.timestamp));
                });
            }
            return data;
        }
    });

    return Notification;

});
