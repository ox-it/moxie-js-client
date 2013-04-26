define(['backbone', 'underscore'], function(Backbone, _) {
    var MoxieCollection = Backbone.Collection.extend({
        getAsync: function(id, options, retry) {
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
