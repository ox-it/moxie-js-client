define(['backbone'], function(Backbone) {
    var SaveTodayButton = Backbone.View.extend({
        manage: true,
        attributes: {
            'class': 'ss-standard ss-check',
            'href': '#/'
        },
        tagName: 'a',
    });
    return SaveTodayButton;
});
