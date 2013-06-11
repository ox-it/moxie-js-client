define(["handlebars", "moment"], function(Handlebars, moment) {
    var DEFAULT_TIME_FORMAT = "HH:mm";
    function timeFormat(arg) {
        if(!arg) {
            return "";
        }
        try {
            var date = moment(arg);
            return date.format(DEFAULT_TIME_FORMAT);
        } catch (err) {
            console.log(err);
            return "";
        }
    }
    Handlebars.registerHelper('timeFormat', timeFormat);
    return timeFormat;
});
