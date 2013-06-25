define(['today/views/CardView', 'hbs!today/templates/events'], function(CardView, eventsTemplate) {
    var EventsCard = CardView.extend({
        weight: 70,
        manage: true,
        id: 'events_list',
        attributes: {'class': 'today'},
        serialize: function() {
            return this.collection.toJSON();
        },
        template: eventsTemplate
    });
    return EventsCard;
});
