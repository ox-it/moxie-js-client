define(['backbone', 'underscore'], function(Backbone, _) {
    var MoxieModel = Backbone.Model.extend({
        fetch: function(options) {
            options = options || {};
            // Set a default error handler
            if (!options.error) {
                options.error = _.bind(function() {
                    // Pass all the error arguments through
                    // These are [model, response, options]
                    var args = ["errorFetching"].concat(Array.prototype.slice.call(arguments));
                    this.trigger.apply(this, args);
                }, this);
            }
            return Backbone.Model.prototype.fetch.apply(this, [options]);
        },
    });
    return MoxieModel;
});
