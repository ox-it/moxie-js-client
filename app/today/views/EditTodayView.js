define(['backbone', 'hbs!today/templates/editToday'], function(Backbone, editTodayTemplate) {
    var EditTodayView = Backbone.View.extend({
        manage: true,
        template: editTodayTemplate,
        attributes: {
            'class': 'today-settings'
        },
        serialize: function() {
            return {settings: this.collection.settings.toJSON()};
        },
        events: {
            'click input': 'checkboxClick',
        },
        checkboxClick: function(ev) {
            var setting = this.collection.settings.get(ev.target.id);
            var enabled = ev.target.checked;
            setting.set('enabled', ev.target.checked);
            setting.save();
        },
    });
    return EditTodayView;
});
