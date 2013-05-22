define(['backbone', 'underscore', 'moxie.conf', 'today/views/WeatherCard'], function(Backbone, _, conf, WeatherCard) {
    var ssCSSClasses = {
        'NA': 'ss-clouds',
        'ukn': 'ss-clouds',
        'cs': 'ss-cloudynight',
        's': 'ss-sun',
        'pc': 'ss-partlycloudy',
        'si': 'ss-partlycloudy',
        'm': 'ss-haze',
        'f': 'ss-fog',
        'gc': 'ss-clouds',
        'lrs': 'ss-rain',
        'd': 'ss-rain',
        'hr': 'ss-heavyrain',
        'h': 'ss-hail',
        'lsn': 'ss-rainsnow',
        'hsn': 'ss-snow',
        'tst': 'ss-thunderstorm',
    };
    var Weather = Backbone.Model.extend({
        url: conf.urlFor('weather'),
        View: WeatherCard,
        setSSClass: function(observation) {
            // TODO: Will anyone notice that we hard-code to cloudy?
            var classes = ['ss-forecast'];
            if (ssCSSClasses[observation.outlook_icon]) {
                classes.push(ssCSSClasses[observation.outlook_icon]);
            } else {
                classes.push('ss-clouds');
            }
            observation.ss_class = classes.join(' ');
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
