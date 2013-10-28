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
    var Event = MoxieModel.extend({
        url: function() {
            return conf.urlFor('events_id') + this.id;
        },
        parse: function(data) {
            var starts = moment(data.start_time);
            var ends = moment(data.end_time);
            data.happeningToday = starts.isSame(today, "day");
            data.formattedDate = dateFormat(starts);
            data.start_moment = starts;
            data.ends_moment = ends;
            return data;
        }
    });

    return Event;

});
