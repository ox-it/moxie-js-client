define(['jquery'], function($) {
    function App(){
        this.showView = function(view, el) {
            if (this.currentView){
                this.currentView.remove();
                this.currentView.unbind();
                if (this.currentView.onClose) {
                    this.currentView.onClose();
                }
            }
            this.currentView = view;
            this.currentView.render();
            if (el) {
                el.html(this.currentView.el);
            } else {
                $("#content").html(this.currentView.el);
            }
        };
    }
    // This needs to be a global singleton
    var app = new App();
    return app;
});
