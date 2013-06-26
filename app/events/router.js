define(["app", "underscore", "backbone", "moxie.conf", "events/collections/EventCollection", "events/views/EventsView", "events/views/EventDetailView", "backbone.subroute"],
 function(app, _, Backbone, conf, EventCollection, EventsView, EventView){
    var EventsRouter = Backbone.SubRoute.extend({
        events: new EventCollection(),

        routes: {
            "": "listEvents",
            ":id": "detailEvent"
        },

        listEvents: function() {
            this.events.fetch();
            app.showView(new EventsView({collection: this.events}));
        },

        detailEvent: function(id) {
            var event = this.events.get(id);
            if (event) {
                app.showView(new EventView({model: event}));
            } else {
                console.log("TODO");
            }
        }
    });

    return EventsRouter;
});
