define(['backbone', 'underscore', 'moxie.conf', 'today/views/WeatherCard'], function(Backbone, _, conf, WeatherCard) {
    var ssCSSClasses = {
        's': 'ss-sun',
        'pc': 'ss-partlycloudy',
        'si': 'ss-partlycloudy',
        'm': 'ss-fog',
        'f': 'ss-fog',
        'gc': 'ss-clouds',
        'lrs': 'ss-rain',
        'hr': 'ss-heavyrain',
    };
    var Weather = Backbone.Model.extend({
        url: conf.urlFor('weather'),
        View: WeatherCard,
        setSSClass: function(observation) {
            // TODO: Will anyone notice that we hard-code to cloudy?
            observation.ss_class = ssCSSClasses[observation.outlook_icon] ? ssCSSClasses[observation.outlook_icon] : 'ss-clouds';
            return observation;
        },
        parse: function(data) {
            console.log(data);
            this.setSSClass(data.observation);
            _.each(data.forecasts, function(forecast) {
                this.setSSClass(forecast);
            }, this);
            console.log(data);
            return data;
        }
    });
    return Weather;
});
