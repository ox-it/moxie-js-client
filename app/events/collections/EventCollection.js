define(["core/collections/MoxieCollection", "events/models/EventModel", "moxie.conf"], function(MoxieCollection, Event, conf) {

    var Events = MoxieCollection.extend({
        model: Event,
        url: conf.urlFor('events_list')
    });

    return Events;

});
