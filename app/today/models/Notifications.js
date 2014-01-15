define(['underscore', 'MoxieModel', 'moxie.conf', 'today/views/NotificationsCard'],
    function(_, MoxieModel, conf, NotificationsCard) {
        var Notifications = MoxieModel.extend({
            url: conf.urlFor('notifications_list'),
            View: NotificationsCard,
            parse: function(data) {
                if (data._embedded.alerts.length === 0) {
                    return null;
                } else {
                    _.each(data._embedded.alerts, function(a) {
                        if (a._embedded && a._embedded.followups) {
                            a.updates = true;
                            a.multipleUpdates = a._embedded.followups.length > 1;
                        }
                    });
                    return {alerts: data._embedded.alerts};
                }
            }
    });
    return Notifications;
});
