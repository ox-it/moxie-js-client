define(['backbone', 'underscore', 'moxie.conf', 'today/views/EventsCard'], function(Backbone, _, conf, EventsCard) {
    var Events = Backbone.Model.extend({
        url: conf.urlFor('events_list'),
        View: EventsCard,
        parse: function(data) {
            return data._embedded;
        }
    });
    return Events;
});
