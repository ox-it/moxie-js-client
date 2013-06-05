define(['today/views/CardView', 'hbs!today/templates/weather'], function(CardView, weatherTemplate) {
    var WeatherCard = CardView.extend({
        weight: 80,
        attributes: {'class': 'today'},
        manage: true,
        template: weatherTemplate,
        serialize: function() { return this.model.toJSON(); }
    });
    return WeatherCard;
});
