define(['app/today/views/CardView', 'hbs!app/today/templates/weather'], function(CardView, weatherTemplate) {
    var WeatherCard = CardView.extend({
        weight: 80,
        attributes: {'class': 'today weather'},
        manage: true,
        template: weatherTemplate,
        serialize: function() { return this.model.toJSON(); }
    });
    return WeatherCard;
});
