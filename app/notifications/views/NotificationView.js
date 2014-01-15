define(["backbone", "app", "moxie.conf", "hbs!notifications/templates/notification"],
    function(Backbone, app, conf, notificationTemplate) {
        var NotificationView = Backbone.View.extend({
            manage: true,
            serialize: function() {
                return this.model.toJSON();
            },
            template: notificationTemplate,
            beforeRender: function() {
                var message = this.model.get('message');
                if (message && message.length > 30) {
                    message = message.substring(0, 30);
                    message = message + '...';
                }
                Backbone.trigger('domchange:title', message);
            }
        });
        return NotificationView;
});
