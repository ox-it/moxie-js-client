define(["underscore", "backbone"], function(_, Backbone){
    var userPosition = {};
    _.extend(userPosition, Backbone.Events);
    var wpid = navigator.geolocation.watchPosition(function(position){
        userPosition.latest = position;
        userPosition.trigger('position:updated', position);
    },
    function(e){
        userPosition.trigger('position:error', e);
    });
    userPosition.follow = function(cb) {
        userPosition.on('position:updated', cb);
        if (userPosition.latest) {
            userPosition.trigger('position:updated', userPosition.latest);
        }
    };
    userPosition.unfollow = function(cb) {
        userPosition.off('position:updated', cb);
    };
    return userPosition;
});
