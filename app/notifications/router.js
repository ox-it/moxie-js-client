define(["app", "underscore", "backbone", "moxie.conf", "notifications/models/NotificationModel", "notifications/collections/NotificationCollection", "notifications/views/NotificationView", "backbone.subroute"],
 function(app, _, Backbone, conf, Notification, NotificationCollection, NotificationView){
    var NotificationsRouter = Backbone.SubRoute.extend({
        notifications: new NotificationCollection(),

        routes: {
            ":id": "detailNotification"
        },

        initialize: function() {
            this.notifications.fetch({reset: true});
        },

        detailNotification: function(id) {
            var notification = this.notifications.get(id);
            if (notification) {
                app.showView(new NotificationView({model: notification}));
            } else {
                notification = new Notification({id: id});
                notification.fetch({success: _.bind(function(model, response, options) {
                    this.notifications.add(model);
                    app.showView(new NotificationView({model: notification}));
                }, this) });
            }
        }
    });

    return NotificationsRouter;
});
