define(["MoxieModel", "moxie.conf", "moment"], function(MoxieModel, conf, moment) {
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
            var initialDate = moment(data.initialDate);
            data.initialDateFormatted = dateFormat(initialDate);
            return data;
        }
    });

    return Notification;

});
