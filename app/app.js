define(['jquery'], function($) {
    function App(){
        var pageStack = 0;
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
            this.currentView = view;
            this.currentView.render();
            content.html(this.currentView.el);
            if (options.back && (pageStack > 0)) {
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
                var back_button = $('#back');
                back_button.show();
                var back_button_a = back_button.find('a');
                back_button_a.unbind('click');
                back_button_a.click(function(ev) {
                    pageStack = pageStack - 2;
                    ev.preventDefault();
                    window.history.back();
                    back_button_a.unbind('click');
                    return false;
                });
                $('#home').hide();
            } else {
                $('#back').hide();
                $('#home').show();
            }
            pageStack++;
        };
    }
    // This needs to be a global singleton
    var app = new App();
    return app;
});
