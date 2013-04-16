define(['jquery', 'backbone', 'underscore', 'core/views/MapBrowseLayout'], function($, Backbone, _, MapBrowseLayout) {
    var app = {

        navigate: _.wrap(Backbone.history.navigate, function(nav, path, options) {
            nav.apply(Backbone.history, [path, options]);
        }),
        currentLayout: null,

        // These are full-container layouts
        // Specifically we're using it so we don't remove the Map when
        // the layout is updated, to reduce processing/requests
        //
        // Most layouts don't need to be included here unless similar
        // benefits (such as keeping the Map in the DOM) can be found.
        layouts: {'MapBrowseLayout': MapBrowseLayout},

        showView: function(view) {
            return this.renderView(view);
        },

        renderView: function(view, options) {
            options = options || {};
            if (options.menu) {
                $('#back').hide();
                $('#home').show();
            } else {
                $('#home').hide();
                $('#back').show();
            }
            // Remove any existing layouts
            // If managed with LayoutManager this will call cleanup
            if (this.currentLayout) {
                this.currentLayout.remove();
            }
            // Attach a view to the DOM and call render
            this.currentLayout = view;
            $('#content').empty().append(this.currentLayout.el);
            this.currentLayout.render();
        },

        getLayout: function(name) {
            if (this.currentLayout && this.currentLayout.name === name) {
                return this.currentLayout;
            } else {
                if (this.layouts[name]) {
                    var RequestedLayout = this.layouts[name];
                    layout = new RequestedLayout();
                    this.renderView(layout);
                    return layout;
                } else {
                    throw "Layout doesn't exist";
                }
            }
        }
    };

    return app;
});
