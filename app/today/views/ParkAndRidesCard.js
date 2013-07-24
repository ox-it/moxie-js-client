define(['today/views/CardView', 'hbs!today/templates/park_and_rides'], function(CardView, prTemplate) {
    var RiversCard = CardView.extend({
        weight: 70,
        manage: true,
        id: 'pr_status',
        attributes: {'class': 'today'},
        serialize: function() {
            return this.model.toJSON();
        },
        template: prTemplate,
        afterRender: function() {
            var services = this.model.get('park_and_rides');
            for(var pr in services) {
                var park = services[pr];
                if (park.unavailable) {
                    new JustGage({
                        id: "pr-" + park.identifier,
                        value: 0,
                        min: 0,
                        max: 100,
                        title: park.name.split("Park")[0].trim(),
                        label: "NO INFORMATION",
                        hideValue: true,
                        hideMinMax: true,
                        counter: false
                    });
                } else {
                    new JustGage({
                        id: "pr-" + park.identifier,
                        value: park.percentage,
                        min: 0,
                        max: 100,
                        title: park.name.split("Park")[0].trim(),
                        label: park.spaces + " available",
                        hideValue: true,
                        hideMinMax: true,
                        counter: false,
                        levelColors: ["#a9d70b", "#f9c802", "#ff0000"]
                    });
                }
            }
        }
    });
    return RiversCard;
});
