define(['jquery', 'backbone', 'underscore', 'hbs!events/templates/events', 'events/views/EventListItemView'],
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

            function addToday(event) {
                todayEvents.push(new EventListItemView({model: event}));
            }
            function addWeek(event) {
                weekEvents.push(new EventListItemView({model: event}));
            }

            var today = this.collection.where({happeningToday: true});
            var week = this.collection.where({happeningToday: false});
            _.each(today, addToday, this);
            _.each(week, addWeek, this);

             this.insertViews({
                'ul#today': today,
                'ul#week': week
            });
        },

        cleanup: function() {
            this.collection.off('reset', this.render, this);
        }

    });
    return EventsView;
});
