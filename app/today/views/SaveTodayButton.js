define(['backbone'], function(Backbone) {
    var SaveTodayButton = Backbone.View.extend({
        manage: true,
        attributes: {
            'class': 'fa fa-check',
            'href': '#/'
        },
        tagName: 'a',
    });
    return SaveTodayButton;
});
