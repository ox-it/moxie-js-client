define(['backbone', 'moxie.conf', 'moment', 'today/views/EventsCard'], function(Backbone, conf, moment, EventsCard) {
    var today = moment(new Date());
    var DEFAULT_FORMAT = "h:mma";
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
    var Events = Backbone.Model.extend({
        url: conf.urlFor('events_list'),
        View: EventsCard,
        parse: function(data) {
            var events = data._embedded.events;
            var evToday = [];
            for(var e in events) {
                var event = events[e];
                var starts = moment(event.start_time);
                if (starts.isSame(today, "day")) {
                    event.formatted_start_time = dateFormat(starts);
                    evToday.push(event);
                }
            }
            if(evToday.length == 0) {
                return null;
            }
            return {events: evToday};
        }
    });
    return Events;
});
