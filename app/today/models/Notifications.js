define(['underscore', 'app/core/models/MoxieModel', 'app/moxie.conf', 'app/today/views/NotificationsCard'],
    function(_, MoxieModel, conf, NotificationsCard) {
        var Notifications = MoxieModel.extend({
            url: conf.urlFor('notifications_list'),
            View: NotificationsCard,
            parse: function(data) {
                if (data._embedded.notifications.length === 0) {
                    return null;
                } else {
                    _.each(data._embedded.notifications, function(a) {
                        if (a._embedded && a._embedded.followups) {
                            a.updates = true;
                            a.multipleUpdates = a._embedded.followups.length > 1;
                        }
                    });
                    return {notifications: data._embedded.notifications};
                }
            }
    });
    return Notifications;
});
