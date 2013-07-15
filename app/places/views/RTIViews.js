define(['backbone', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti', 'hbs!places/templates/p-r_rti'],
    function(Backbone, busRTITemplate, trainRTITemplate, prRTITemplate) {
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
        "p-r": RTIView.extend({
            template: prRTITemplate
        })
    };
    // Departures uses the same view as arrivals
    RTIViews['rail-departures'] = RTIViews['rail-arrivals'];
    return RTIViews;
});
