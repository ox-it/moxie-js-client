define(['jquery', 'underscore', 'core/views/MapBrowseLayout'], function($, _, MapBrowseLayout) {
    var app = {

        currentLayout: null,

        layouts: {'MapBrowseLayout': MapBrowseLayout},

        getLayout: function(name) {
            if (this.currentLayout && this.currentLayout.name === name) {
                return this.currentLayout;
            } else {
                if (this.layouts[name]) {
                    var RequestedLayout = this.layouts[name];
                    this.currentLayout = new RequestedLayout();
                    //
                    // Attach to DOM and render
                    $('#content').empty().append(this.currentLayout.el);
                    this.currentLayout.render();
                    return this.currentLayout;
                } else {
                    throw "Layout doesn't exist";
                }
            }
        }
    };

    return app;
});
