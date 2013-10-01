define(['backbone'], function(Backbone) {
    var StaticView = Backbone.View.extend({

        initialize: function(options) {
            this.template = options.template;
        },

        manage: true
    });
    return StaticView;
});
