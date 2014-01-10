define(["backbone", "app", "moxie.conf", "hbs!notifications/templates/notification"],
    function(Backbone, app, conf, notificationTemplate) {
        var NotificationView = Backbone.View.extend({
            manage: true,
            serialize: function() {
                return this.model.toJSON();
            },
            template: notificationTemplate,
            beforeRender: function() {
                Backbone.trigger('domchange:title', this.model.get('name'));
            }
        });
        return NotificationView;
});
