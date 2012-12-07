define(['backbone'], function(Backbone) {
    Backbone.View.prototype.close = function(){
        this.remove();
        this.unbind();
        if (this.onClose){
            this.onClose();
        }
    };
    Backbone.Router.prototype.showView = function(view) {
        if (this.currentView){
            this.currentView.close();
        }
        this.currentView = view;
        this.currentView.render();

        $("#content").html(this.currentView.el);
    };
});
