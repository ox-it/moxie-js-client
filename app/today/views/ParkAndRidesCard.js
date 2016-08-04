define(['today/views/CardView', 'hbs!today/templates/park_and_rides'], function(CardView, prTemplate) {
    var ParkAndRidesCard = CardView.extend({
        weight: 70,
        manage: true,
        id: 'pr_status',
        attributes: {'class': 'today'},
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.model.on('request', this.showLoader, this);
            this.model.on('sync', this.onSync, this);
            this.intervalID = window.setInterval(_.bind(this.onSync, this), 10000);
        },
        gauges: Array(),
        template: prTemplate,
        afterRender: function() {
            var services = this.model.get('park_and_rides');
            for(var pr in services) {
                var park = services[pr];
                if (park.unavailable) {
                    var g = new JustGage({
                        id: "pr-" + park.identifier,
                        value: 0,
                        min: 0,
                        max: 100,
                        title: park.name.split("Park")[0].trim(),
                        label: "NO INFORMATION",
                        symbol: "?",
                        titleFontColor: "#101010",
                        hideValue: true,
                        hideMinMax: true,
                        counter: false
                    });
                    this.gauges.push(g);
                } else {
                    var g = new JustGage({
                        id: "pr-" + park.identifier,
                        value: park.percentage,
                        min: 0,
                        max: 100,
                        title: park.name.split("Park")[0].trim(),
                        label: park.spaces + " available",
                        hideValue: true,
                        hideMinMax: true,
                        counter: false,
                        labelFontColor: "#101010",
                        titleFontColor: "#101010",
                        levelColors: ["#a9d70b", "#a9d70b", "#a9d70b", "#a9d70b", "#a9d70b", "#f9c802", "#ff0000"]
                    });
                    this.gauges.push(g);
                }
            }
        },
        onSync: function() {
            //this.model.fetch();
            var services = this.model.get('park_and_rides');
            for(var pr in services) {
                var park = services[pr];
                for (var g in this.gauges) {
                    var gauge = this.gauges[g];
                    if (gauge.config.id === "pr-"+ park.identifier) {
                        gauge.refresh(park.percentage);
                    }
                }
            }
            this.$("#rti-load").css('visibility', 'hidden');
        },
        showLoader: function() {
            this.$("#rti-load").css('visibility', 'visible');
        },
        cleanup: function() {
            this.model.off();
            if (this.intervalID) {
                window.clearInterval(this.intervalID);
            }
        }
    });
    return ParkAndRidesCard;
});
