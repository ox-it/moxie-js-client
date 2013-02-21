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
                        thresholdSurpassed = (((this.scrollElement.scrollTop + this.scrollElement.clientHeight) / this.scrollElement.scrollHeight) > this.scrollThreshold);
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

        initScroll: function(options) {
            // Initialises the scroll event handlers and sets an interval to observe them
            // The options object can contain any or none of the following:
            //  * `windowScroll` should be a boolean saying if we want to listen to window.scroll events
            //  * `scrollElement` is an optional DOM element we want to listen to scroll events for
            //  * `intervalPeriod` time in ms which we should check if the user has scrolled
            //  * `scrollThreshold` a floating point integer between 0 and 1 - The ratio representating
            //                      how far down a page scroll should the `scrollCallbacks` be called.
            this.scrollThreshold = options.scrollThreshold ? options.scrollThreshold : null;
            if (options.windowScroll) {
                $(window).scroll(
                    _.bind(function(){ this.windowScrolled = true; }, this)
                );
            }
            if (options.scrollElement) {
                this.scrollElement = options.scrollElement;
                $(options.scrollElement).scroll(
                    _.bind(function(){ this.elScrolled = true; }, this)
                );
            }
            var intervalPeriod = options.intervalPeriod ? options.intervalPeriod : 250; // default of 250ms per Mr. Resig's suggestion
            if (options.windowScroll || options.scrollElement) {
                this.scrollInterval = window.setInterval(_.bind(this.handleScroll, this), intervalPeriod);
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
