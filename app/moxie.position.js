define(["underscore", "backbone", "moxie.conf"], function(_, Backbone, conf){
    var userPosition = {
        count: 0,
        follow: function(cb) {
            if (this.count===0) {
                this.updateLocation();
                this.intervalID = window.setInterval(this.updateLocation, conf.geolocationInterval);
            }
            this.on('position:updated', cb);
            if (this.latest) {
                this.trigger('position:updated', this.latest);
            }
            this.count++;
        },
        unfollow: function(cb) {
            this.off('position:updated', cb);
            this.count--;
            if (this.count===0 && this.intervalID) {
                window.clearInterval(this.intervalID);
            }
        },
        updateLocation: function() {
            that = this;
            navigator.geolocation.getCurrentPosition(
                function(position) { // Success
                    that.trigger('position:updated', position);
                    that.latest = position;
                }, function(e) { // Error
                    console.log("Error accessing location");
                    console.log(e.code);
                },
            {timeout:50000}); // This is useful for debugging problem with geolocation
        }
    };
    _.bindAll(userPosition);
    _.extend(userPosition, Backbone.Events);
    return userPosition;
});
