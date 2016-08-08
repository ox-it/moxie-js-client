define(["app/core/collections/MoxieCollection", "app/notifications/models/NotificationModel", "app/moxie.conf"], function(MoxieCollection, Notification, conf) {

    var Notifications = MoxieCollection.extend({
        model: Notification,
        url: conf.urlFor('notifications_list'),
        parse: function(data) {
            return data._embedded.alerts;
        }
    });

    return Notifications;

});
