define(['moxie.conf'], function(conf) {
    var media = {
        matchMedia: function(mediaQuery) {
            // Canonical API for window.matchMedia
            //
            // If matchMedia isn't supported in the browser we return null for now
            // depending on support in devices we can move to use a polyfill
            if (('matchMedia' in window)) {
                return window.matchMedia(mediaQuery);
            } else {
                return null;
            }
        },
        isPhone: function() {
            return this.matchMedia(conf.map.phoneViewMediaQuery).matches;
        },
        isTablet: function() {
            return !this.matchMedia(conf.map.phoneViewMediaQuery).matches;
        },
    };
    return media;
});
