define(["core/collections/MoxieCollection", "notifications/models/NotificationModel", "moxie.conf"], function(MoxieCollection, Notification, conf) {

    var Notifications = MoxieCollection.extend({
        model: Notification,
        url: conf.urlFor('notifications_list'),
        parse: function(data) {
            return data._embedded.alerts;
        }
    });

    return Notifications;

});
