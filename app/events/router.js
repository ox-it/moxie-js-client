define(["app/app", "underscore", "backbone", "app/moxie.conf", "app/events/models/EventModel", "app/events/collections/EventCollection", "app/events/views/EventsView", "app/events/views/EventDetailView", "backbone.subroute"],
 function(app, _, Backbone, conf, Event, EventCollection, EventsView, EventView){
    var EventsRouter = Backbone.SubRoute.extend({
        events: new EventCollection(),

        routes: {
            "": "listEvents",
            ":id": "detailEvent"
        },

        initialize: function() {
            this.events.fetch({reset: true});
        },

        listEvents: function() {
            app.showView(new EventsView({collection: this.events}));
        },

        detailEvent: function(id) {
            var event = this.events.get(id);
            if (event) {
                app.showView(new EventView({model: event}));
            } else {
                event = new Event({id: id});
                event.fetch({success: _.bind(function(model, response, options) {
                    this.events.add(model);
                    app.showView(new EventView({model: event}));
                }, this) });
            }
        }
    });

    return EventsRouter;
});
