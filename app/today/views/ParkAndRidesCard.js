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
                var label = park.spaces + " available";
                var colors = ["#a9d70b", "#f9c802", "#ff0000"];
                if (park.unavailable) {
                    label = "No information";
                    colors = ['#0000FF', '#0000FF', '#0000FF'];
                }
                new JustGage({
                    id: "pr-" + park.identifier,
                    value: park.percentage,
                    min: 0,
                    max: 100,
                    title: park.name.split("Park")[0].trim(),
                    label: label,
                    hideValue: true,
                    hideMinMax: true,
                    counter: false,
                    levelColors: colors
                });
            }
            $('.today-card-container').nested('append', this.el);
        }
    });
    return RiversCard;
});
