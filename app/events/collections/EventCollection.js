define(["core/collections/MoxieCollection", "events/models/EventModel", "moxie.conf"], function(MoxieCollection, Event, conf) {

    var Events = MoxieCollection.extend({
        model: Event,
        url: conf.urlFor('events_list'),
        parse: function(data) {
            return data._embedded.events;
        }
    });

    return Events;

});
