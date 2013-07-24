define(['backbone'], function(Backbone) {
    var EditTodayButton = Backbone.View.extend({
        manage: true,
        attributes: {
            'class': 'ss-standard ss-settings',
            'href': '#/today/edit',
        },
        tagName: 'a',
    });
    return EditTodayButton;
});
