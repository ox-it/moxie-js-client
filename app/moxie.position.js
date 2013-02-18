define(["underscore", "backbone", "moxie.conf"], function(_, Backbone, conf){
    var userPosition = {
        count: 0,
        follow: function(cb) {
            if (this.count===0) {
                this.startWatching();
            }
            this.on('position:updated', cb);
            if (this.latest) {
                // New subscribers should get the latest location fix
                this.trigger('position:updated', this.latest);
            }
            this.count++;
        },
        unfollow: function(cb) {
            this.off('position:updated', cb);
            this.count--;
        },
        locationSuccess: function(position) {
            this.trigger('position:updated', position);
            this.latest = position;
        },
        locationError: function(e) {
            if (!this.latest) {
                // We have no good position data so update to the default location
                this.trigger('position:updated', conf.defaultLocation);
                this.latest = conf.defaultLocation;
            }
        },
        startWatching: function() {
            // Ask for immediate position then watch with a big timeout / max age
            navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError);
            this.watchID = navigator.geolocation.watchPosition(this.locationSuccess, this.locationError,
            {maximumAge: 120000, timeout:25000}); // This is useful for debugging problem with geolocation
        }
    };
    _.bindAll(userPosition);
    _.extend(userPosition, Backbone.Events);
    return userPosition;
});
