define(['backbone', 'hbs!today/templates/weather'], function(Backbone, weatherTemplate) {
    var WeatherCard = Backbone.View.extend({
        attributes: {'class': 'today'},
        manage: true,
        template: weatherTemplate,
        serialize: function() { return this.model.toJSON(); }
    });
    return WeatherCard;
});
