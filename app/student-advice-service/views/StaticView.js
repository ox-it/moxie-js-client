define(['backbone', 'hbs!student-advice-service/templates/index'], function(Backbone, indexTemplate) {
    var StaticView = Backbone.View.extend({

        template: indexTemplate,

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Student Advice Service");
        },

        manage: true
    });
    return StaticView;
});
