define(['jquery', 'backbone', 'underscore'], function($, Backbone, _) {
    function App(){
        this.pageStack = 0;
        this.startingPage = function() {
            return this.pageStack == 1;
        };
        this.navigate = function(fragment, options) {
            options = options ? options : {};
            if (options.replace !== true) {
                this.pageStack++;
            }
            return Backbone.history.navigate(fragment, options);
        };
        var defaultBack = function(ev) {
            this.pageStack -= 2;
            ev.preventDefault();
            window.history.back();
            return false;
        };
        this.showBack = function(cb) {
            $('#home').hide();
            var back = $('#back');
            back.show();
            var backA = back.find('a');
            backA.off('click');
            if (cb) {
                backA.one('click', cb);
                backA.one('click', _.bind(function() { this.pageStack -= 2; }, this));
            } else {
                backA.one('click', _.bind(defaultBack, this));
            }
        };
        this.showHome = function() {
            $('#back').hide();
            $('#home').show();
        };
        this.showView = function(view, options) {
            // Options should be a js object with optional arguments
            // options.el -- is the element to render the view within (defaults to #content)
            // options.back -- boolean which when set to true will display the back button
            options = options ? options : {};
            var content = options.el ? options.el : $("#content");
            if (this.currentView){
                this.currentView.remove();
                this.currentView.unbind();
                if (this.currentView.onClose) {
                    this.currentView.onClose();
                }
            }
            if (options.back && (this.pageStack > 0)) {
                // there are a couple of edge cases here
                // the core problem is registering the back click event multiple times to prevent this:
                //  * Remove any existing click handlers before adding one
                //  * When the back button is clicked it removes its own event handler
                //    - This covers the case where we have other 'smarter' back buttons in existence
                //
                //  The pageStack is a simple count of how many pages have been loaded for each page loaded
                //  we add 1 to pageStack, when the user clicks our back button we reduce pageStack by 2
                //  Effectively resetting the pageStack (you have to remove 2 because when you go back you
                //  will be calling showView once to render the view you're returning to [we have no idea
                //  that the user clicked the back button due to history stuff])
                this.showBack();
            } else {
                this.showHome();
            }
            this.currentView = view;
            this.currentView.render();
            content.html(this.currentView.el);
            this.pageStack++;
        };
    }
    // This needs to be a global singleton
    var app = new App();
    return app;
});
