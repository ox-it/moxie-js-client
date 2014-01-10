define(['underscore', 'today/views/CardView', 'hbs!today/templates/notifications'],
    function(_, CardView, notificationsTemplate) {
        var NotificationsCard = CardView.extend({
            weight: 70,
            manage: true,
            id: 'notifications_list',
            attributes: {'class': 'today'},
            serialize: function() {
                if (_.isEmpty(this.model)) {
                    // do not display the card if there is no active alert
                    throw new Error("No active alert");
                } else {
                    return this.model.toJSON();
                }
            },
            template: notificationsTemplate
        });
        return NotificationsCard;
});
