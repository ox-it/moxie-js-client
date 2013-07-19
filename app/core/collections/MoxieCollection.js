define(['backbone', 'underscore'], function(Backbone, _) {
    var MoxieCollection = Backbone.Collection.extend({
        fetch: function(options) {
            // Reverts Backbone to using the previous "fetch" behaviour
            // Unless specified we use the "reset" method (e.g. empty the collection)
            options = options || {};
            if (!options.update && options.reset===undefined) {
                options.reset = true;
            }
            // Set a default error handler
            if (!options.error) {
                options.error = _.bind(function(err) {
                    this.trigger("errorFetching", err);
                }, this);
            }
            return Backbone.Collection.prototype.fetch.apply(this, [options]);
        },
        // Documented in "Moxie Backbone Extensions" in our docs.
        getAsync: function(id, options, retry) {
            // get the ``id`` if it's already in the collection or wait
            // for the options.pendingEvent and try to ``get`` again.
            options = options || {};
            var m = this.get(id);
            if (!m && this.length===0 && !retry) {
                var pendingEvent = options.pendingEvent || 'reset';
                this.once(pendingEvent, _.bind(this.getAsync, this, id, options, true), this);
            } else if (!m && options.failure) {
                options.failure();
            } else if (m && options.success) {
                options.success(m);
            }
        }
    });
    return MoxieCollection;
});
