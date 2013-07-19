define(['backbone'], function(Backbone) {
    var MoxieModel = Backbone.Model.extend({
        fetch: function(options) {
            options = options || {};
            // Set a default error handler
            if (!options.error) {
                options.error = _.bind(function(err) {
                    this.trigger("errorFetching", err);
                }, this);
            }
            return Backbone.Model.prototype.fetch.apply(this, [options]);
        },
    });
    return MoxieModel;
});
