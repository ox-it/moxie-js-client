define(['backbone'], function(Backbone) {
    var EditTodayButton = Backbone.View.extend({
        manage: true,
        attributes: {
            'class': 'fa fa-cog',
            'href': '#/today/edit',
        },
        tagName: 'a',
    });
    return EditTodayButton;
});
