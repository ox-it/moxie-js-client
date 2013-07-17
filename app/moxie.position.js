define(["underscore", "backbone", "moxie.conf"], function(_, Backbone, conf){
    var EVENT_POSITION_UPDATED = 'position:updated';
    function UserPosition() {
        _.extend(this, Backbone.Events);
        var supportsGeoLocation = Boolean(navigator.geolocation),
            latestPosition = null,
            positionInterval;
        this.getLocation = function(cb, options) {
            options = options || {};
            // If we don't get a location within the errorMargin before the Timeout
            // we return the most recent position reported by watchPosition
            options.errorMargin = options.errorMargin || conf.position.errorMargin;
            options.timeout = options.timeout || conf.position.accuracyTimeout;
            var temporaryGeoWatchID;
            var accuracyTimeout = setTimeout(function() {
                navigator.geolocation.clearWatch(temporaryGeoWatchID);
                if (latestPosition) {
                    cb(latestPosition);
                } else {
                    cb(conf.defaultLocation);
                }
            }, options.timeout);
            temporaryGeoWatchID = navigator.geolocation.watchPosition(function(position) {
                latestPosition = position;
                if (latestPosition.coords && latestPosition.coords.accuracy && latestPosition.coords.accuracy <= options.errorMargin) {
                    window.clearTimeout(accuracyTimeout);
                    navigator.geolocation.clearWatch(temporaryGeoWatchID);
                    cb(latestPosition);
                }
            }, _.bind(locationError, this),
            {
                    enableHighAccuracy: conf.position.enableHighAccuracy,
                    maximumAge: conf.position.maximumAge,
            });

        };
        function locationSuccess(position) {
            this.trigger(EVENT_POSITION_UPDATED, position);
        }
        function locationError(err) {
            if ('console' in window) {
                console.log("Geolocation error: ", err);
            }
        }
        function startWatching() {
            if (supportsGeoLocation) {
                this.getLocation(_.bind(locationSuccess, this));
                positionInterval = window.setInterval(this.getLocation, conf.position.updateInterval, _.bind(locationSuccess, this));
            } else {
                locationError.apply(this);
            }
        }
        var count = 0;
        this.follow = function(cb, context) {
            context = context || this;
            if (!positionInterval) {
                // Call the "private" function with the correct context
                startWatching.apply(this);
            }
            this.on(EVENT_POSITION_UPDATED, cb, context);
            this.count++;
            // Send user latest userPosition (not default)
            if (latestPosition) {
                cb.apply(context, [latestPosition]);
            }
        };
        this.unfollow = function(cb, context) {
            if (context) {
                this.off(EVENT_POSITION_UPDATED, null, context);
            } else {
                this.off(EVENT_POSITION_UPDATED, cb);
            }
            this.count--;
            if (this.count === 0) {
                window.clearInterval(positionInterval);
            }
        };
    }
    return new UserPosition();
});
