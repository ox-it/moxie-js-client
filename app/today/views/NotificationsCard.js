define(['underscore', 'today/views/CardView', 'hbs!today/templates/notifications'],
    function(_, CardView, notificationsTemplate) {
        var NotificationsCard = CardView.extend({
            weight: 1000,
            manage: true,
            id: 'notifications_list',
            attributes: {'class': 'today'},
            serialize: function() {
                if (this.model.has('alerts')) {
                    return this.model.toJSON();
                } else {
                    // do not display the card if there is no active alert
                    throw new Error("No active alert");
                }
            },
            template: notificationsTemplate
        });
        return NotificationsCard;
});
