define(['jquery', 'backbone', 'underscore'], function($, Backbone, _){
    var InfiniteScrollView = Backbone.View.extend({
        scrollCallbacks: [function(){ console.log("Scrolled!"); }],
        infiniteScrollEnabled: true,
        windowScroll: true,

        // Used to capture once a scroll has occured and on which element
        divScrolled: false,
        windowScrolled: false,

        initScroll: function() {
            if (this.windowScroll) {
                $(window).scroll(
                    _.bind(function(){ this.windowScrolled = true; }, this)
                );
            }
            if (this.divScroll) {
                this.$(this.divScroll).scroll(
                    _.bind(function(){ this.divScrolled = true; }, this)
                );
            }
            if (this.windowScroll || this.divScroll) {
                this.scrollInterval = window.setInterval(_.bind(function(){
                        if ((this.infiniteScrollEnabled) && (this.windowScrolled || this.divScrolled)) {
                            this.infiniteScrollEnabled = false; // Infinite scroll disabled for duration of handling 1 event
                            var thresholdSurpassed = false;
                            if (this.scrollThreshold) {
                                if (this.divScrolled) {
                                    _.each(this.$(this.divScroll), _.bind(function(el) {
                                        if (!thresholdSurpassed) {
                                            thresholdSurpassed = ((el.scrollTop / el.scrollHeight) > this.scrollThreshold);
                                        }
                                    }, this));
                                } else {
                                    thresholdSurpassed = (($(document).scrollTop() / $(document).height()) > this.scrollThreshold);
                                }
                            }
                            if ((this.scrollThreshold && thresholdSurpassed) || !this.scrollThreshold) {
                                _.each(this.scrollCallbacks, _.bind(function(cb) { cb.apply(this); }, this));
                            }
                            this.infiniteScrollEnabled = true;
                            this.windowScrolled = false;
                            this.divScrolled = false;
                        }
                }, this), 250); // limit to 250ms per Mr. Resig's suggestion
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
