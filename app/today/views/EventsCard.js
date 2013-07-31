define(['today/views/CardView', 'hbs!today/templates/events'], function(CardView, eventsTemplate) {
    var EventsCard = CardView.extend({
        weight: 70,
        manage: true,
        id: 'events_list',
        attributes: {'class': 'today'},
        serialize: function() {
            if (this.model.has('events')) {
                return this.model.toJSON();
            } else {
                throw new Error("No events today!");
            }
        },
        template: eventsTemplate,
        afterRender: function() {
            $('.today-card-container').nested('append', this.el);
        }
    });
    return EventsCard;
});
