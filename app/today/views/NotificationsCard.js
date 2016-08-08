define(['underscore', 'app/today/views/CardView', 'hbs!app/today/templates/notifications'],
    function(_, CardView, notificationsTemplate) {
        var NotificationsCard = CardView.extend({
            weight: 1000,
            manage: true,
            attributes: {'class': 'today notifications-list'},
            serialize: function() {
                if (this.model.has('notifications')) {
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
