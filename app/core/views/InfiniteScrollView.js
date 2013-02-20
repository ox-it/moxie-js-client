define(['jquery', 'backbone', 'underscore'], function($, Backbone, _){
    var InfiniteScrollView = Backbone.View.extend({
        // Generic InfiniteScrollView implementation
        scrollCallbacks: [function(){ console.log("Scrolled!"); }],
        infiniteScrollEnabled: true,

        // Used to capture once a scroll has occured and on which element
        elScrolled: false,
        windowScrolled: false,

        handleScroll: function() {
            // Are we enabled? Has anything been scrolled?
            if ((this.infiniteScrollEnabled) && (this.windowScrolled || this.elScrolled)) {
                this.infiniteScrollEnabled = false; // Infinite scroll disabled for duration of handling 1 event
                var thresholdSurpassed = false;
                if (this.scrollThreshold) {
                    if (this.elScrolled) {
                        thresholdSurpassed = ((this.scrollElement.scrollTop / this.scrollElement.scrollHeight) > this.scrollThreshold);
                    } else {
                        thresholdSurpassed = (($(document).scrollTop() / $(document).height()) > this.scrollThreshold);
                    }
                }
                // Call our callbacks with the correct `this` context
                if ((this.scrollThreshold && thresholdSurpassed) || !this.scrollThreshold) {
                    _.each(this.scrollCallbacks, _.bind(function(cb) { cb.apply(this); }, this));
                }
                this.infiniteScrollEnabled = true;
                this.windowScrolled = false;
                this.elScrolled = false;
            }
        },

        initScroll: function(windowScroll, scrollElement) {
            // Initialises the scroll event handlers and sets an interval to observe them
            // `windowScroll` should be a boolean saying if we want to listen to window.scroll events
            // `scrollElement` is an optional DOM element we want to listen to scroll events for
            if (windowScroll) {
                $(window).scroll(
                    _.bind(function(){ this.windowScrolled = true; }, this)
                );
            }
            if (scrollElement) {
                this.scrollElement = scrollElement;
                $(scrollElement).scroll(
                    _.bind(function(){ this.elScrolled = true; }, this)
                );
            }
            if (windowScroll || scrollElement) {
                this.scrollInterval = window.setInterval(_.bind(this.handleScroll, this), 250); // limit to 250ms per Mr. Resig's suggestion
            }
        },

        onClose: function() {
            if (this.scrollInterval) {
                // Stop looking for scroll events
                window.clearInterval(this.scrollInterval);
            }
        }
    });
    return InfiniteScrollView;
});
