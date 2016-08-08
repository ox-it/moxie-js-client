define(['backbone', 'hbs!app/core/templates/error'], function(Backbone, errorTemplate) {
    var ErrorView = Backbone.View.extend({
        // Simple view for displaying an error message to the user
        initialize: function(options) {
            options = options || {};
            if (options.message) {
                this.message = options.message;
            }
        },
        message: "Error loading resource.",
        manage: true,
        serialize: function() {
            return {message: this.message};
        },
        template: errorTemplate,
    });
    return ErrorView;
});
