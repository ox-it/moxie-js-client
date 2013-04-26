define(['backbone', 'underscore'], function(Backbone, _) {
    var MoxieCollection = Backbone.Collection.extend({
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
