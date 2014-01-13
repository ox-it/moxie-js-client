define(['MoxieModel', 'moxie.conf', 'today/views/NotificationsCard'],
    function(MoxieModel, conf, NotificationsCard) {
        var Notifications = MoxieModel.extend({
            url: conf.urlFor('notifications_list'),
            View: NotificationsCard,
            parse: function(data) {
                if (data._embedded.alerts.length == 0) {
                    return null;
                } else {
                    return {alerts: data._embedded.alerts};
                }
            }
    });
    return Notifications;
});
