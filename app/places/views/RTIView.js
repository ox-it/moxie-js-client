define(['backbone', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti'], function(Backbone, busRTITemplate, trainRTITemplate) {
    var RTIView = Backbone.View.extend({
        initialize: function() {
            this.model.on('sync', this.render, this);
            this.model.on('request', this.showLoader, this);
        },
        manage: true,
        serialize: function() {
            return this.model.toJSON();
        },
        showLoader: function() {
            this.$("#rti-load").css('visibility', 'visible');
        },
        afterRender: function() {
            this.$("#rti-load").css('visibility', 'hidden');
        },
        cleanup: function() {
            this.model.off();
        }
    });
    var RTIViews = {
        "bus": RTIView.extend({
            template: busRTITemplate
        }),
        "rail-arrivals": RTIView.extend({
            template: trainRTITemplate
        }),
        "rail-departures": RTIView.extend({
            template: trainRTITemplate
        })
    };
    return RTIViews;
});
