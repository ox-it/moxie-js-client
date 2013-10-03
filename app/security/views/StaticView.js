define(['backbone'], function(Backbone) {
    var StaticView = Backbone.View.extend({

        initialize: function(options) {
            this.template = options.template;
        },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Safety and Security");
        },

        manage: true
    });
    return StaticView;
});
