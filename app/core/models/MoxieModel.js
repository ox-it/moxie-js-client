define(['backbone'], function(Backbone) {
    var MoxieModel = Backbone.Model.extend({
        registeredFetch: false,
        // By default the fetch method will set an attr
        // "midFetch" to true whilst the request to the API
        // is in flight. This attr is removed once done.
        fetch: function(options) {
            this.set('midFetch', true);
            if (!this.registeredFetch) {
                // Careful to only listen on sync/error once
                this.registeredFetch = true;
                this.on('sync error', function(model, response, options) {
                    // We've either got the model successfully or it has failed
                    // either way we unset the midFetch attr
                    model.unset('midFetch');
                });
            }
            return Backbone.Model.prototype.fetch.apply(this, [options]);
        },
    });
    return MoxieModel;
});
