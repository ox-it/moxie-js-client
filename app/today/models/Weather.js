define(['backbone', 'moxie.conf', 'today/views/WeatherCard'], function(Backbone, conf, WeatherCard) {
    var Weather = Backbone.Model.extend({
        url: conf.urlFor('weather'),
        View: WeatherCard
    });
    return Weather;
});
