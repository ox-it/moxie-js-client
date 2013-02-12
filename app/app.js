define(['jquery'], function($) {
    function App(){
        this.showView = function(view, el) {
            // el is an optional argument, if not supplied we default to
            // the main #content div
            var content = el ? el : $("#content");
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
        };
    }
    // This needs to be a global singleton
    var app = new App();
    return app;
});
