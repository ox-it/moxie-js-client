define(["underscore", "backbone", "moxie.conf"], function(_, Backbone, conf){
    var EVENT_POSITION_UPDATED = 'position:updated';
    function UserPosition() {
        _.extend(this, Backbone.Events);
        var supportsGeoLocation = Boolean(navigator.geolocation),
            spamReduction = false,
            missedUpdate = null,
            watchID;
        function locationSuccess(position) {
            // Trigger relevant events for any components listening to the user position
            //
            // The complexity here comes from not wanting to "spam" the geolocation API's
            // Previously we fired callbacks whenever the position updated, If the callbacks
            // were drawing the map it would severely effect performance on the device as
            // redrawing the map wouldn't finish before starting the next redraw.
            //
            // Now we have a configurable throttle to reduce this effect. No callbacks will
            // be fired within length of this throttle.
            if (spamReduction) {
                // Capture any missed updates whilst we're in "spam reduction mode"
                missedUpdate = position;
            } else {
                this.trigger(EVENT_POSITION_UPDATED, position);
                this.latest = position;
                spamReduction = true;
                setTimeout(_.bind(function() {
                    spamReduction = false;
                    if (missedUpdate) {
                        locationSuccess.apply(this, [missedUpdate]);
                        missedUpdate = null;
                    }
                }, this), conf.position.updateThrottle);
            }
        }
        function locationError() {
            if (!this.latest) {
                // We have no good position data so update to the default location
                this.latest = conf.defaultLocation;
                this.trigger(EVENT_POSITION_UPDATED, conf.defaultLocation);
            }
        }
        function startWatching() {
            if (supportsGeoLocation) {
                watchID = navigator.geolocation.watchPosition(_.bind(locationSuccess, this), _.bind(locationError, this),
                    {
                        enableHighAccuracy: true,
                        maximumAge: 120000,  // 2 minutes
                        timeout: 25000,      // 25 seconds
                    });
            } else {
                locationError.apply(this);
            }
        }
        var count = 0;
        this.follow = function(cb) {
            if (!watchID) {
                // Call the "private" function with the correct context
                startWatching.apply(this);
            }
            this.on(EVENT_POSITION_UPDATED, cb);
            if (this.latest) {
                // New subscribers should get the latest location fix
                this.trigger(EVENT_POSITION_UPDATED, this.latest);
            }
            this.count++;
        };
        this.unfollow = function(cb) {
            this.off(EVENT_POSITION_UPDATED, cb);
            this.count--;
            if (this.count === 0) {
                navigator.geolocation.clearWatch(watchID);
            }
        };
    }
    return new UserPosition();
});
