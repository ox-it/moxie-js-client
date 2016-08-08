define(['jquery', 'backbone', 'underscore', 'hbs!app/events/templates/events', 'app/events/views/EventListItemView'],
    function($, Backbone, _, eventsTemplate, EventListItemView){
    var EventsView = Backbone.View.extend({

        initialize: function() {
            this.collection.on('reset', this.render, this);
        },
        manage: true,
        template: eventsTemplate,

        attributes: {
            'class': 'generic'
        },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Events");
            var todayEvents = [];
            var weekEvents = [];
            this.eventsToday = false;
            this.eventsWeek = false;

            function addToday(event) {
                todayEvents.push(new EventListItemView({model: event}));
                this.eventsToday = true;
            }
            function addWeek(event) {
                weekEvents.push(new EventListItemView({model: event}));
                this.eventsWeek = true;
            }

            var today = this.collection.where({happeningToday: true});
            var week = this.collection.where({happeningToday: false});
            _.each(today, addToday, this);
            _.each(week, addWeek, this);

             this.insertViews({
                'ul#today': todayEvents,
                'ul#week': weekEvents
            });
        },

        serialize: function() {
            return {eventsToday: this.eventsToday,
                    eventsWeek: this.eventsWeek};
        },

        cleanup: function() {
            this.collection.off('reset', this.render, this);
        }

    });
    return EventsView;
});
