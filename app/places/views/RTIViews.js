define(['backbone', 'underscore', 'moment', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti', 'hbs!places/templates/p-r_rti', 'justgage'],
    function(Backbone, _, moment, busRTITemplate, trainRTITemplate, prRTITemplate) {

    // Refresh every 10 seconds
    var RTI_RENDER_REFRESH = 10000;

    var RTIView = Backbone.View.extend({
        initialize: function() {
            this.model.on('sync', this.render, this);
            this.model.on('request', this.showLoader, this);
            this.intervalID = window.setInterval(_.bind(this.render, this), RTI_RENDER_REFRESH);
        },
        manage: true,
        serialize: function() {
            var context = this.model.toJSON();
            var lastUpdated = this.model.get('lastUpdated');
            if (lastUpdated) {
                context.lastUpdatedFormatted = moment(lastUpdated).fromNow();
            }
            return context;
        },
        showLoader: function() {
            this.$("#rti-load").css('visibility', 'visible');
        },
        afterRender: function() {
            this.$("#rti-load").css('visibility', 'hidden');
        },
        cleanup: function() {
            this.model.off();
            if (this.intervalID) {
                window.clearInterval(this.intervalID);
            }
        }
    });
    var ParkAndRideView = RTIView.extend({
        afterRender: function() {
            this.$("#rti-load").css('visibility', 'hidden');
            var services = this.model.get('services');
            var g = new JustGage({
                id: "gauge",
                value: services.percentage,
                min: 0,
                max: 100,
                title: services.spaces + " available",
                label: "",
                hideValue: true,
                hideMinMax: true,
                counter: false,
                levelColors: ["#a9d70b", "#a9d70b", "#a9d70b", "#a9d70b", "#a9d70b", "#f9c802", "#ff0000"]
            });
        },
        template: prRTITemplate
    });
    var RTIViews = {
        "bus": RTIView.extend({
            template: busRTITemplate
        }),
        "rail-arrivals": RTIView.extend({
            template: trainRTITemplate
        }),
        "p-r": ParkAndRideView
    };
    // Departures uses the same view as arrivals
    RTIViews['rail-departures'] = RTIViews['rail-arrivals'];
    return RTIViews;
});
