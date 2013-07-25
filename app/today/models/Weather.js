define(['MoxieModel', 'underscore', 'moxie.conf', 'today/views/WeatherCard', 'moment'], function(MoxieModel, _, conf, WeatherCard, moment) {
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
        'lr': 'ss-rain',
        'lrs': 'ss-rain',
        'd': 'ss-rain',
        'hr': 'ss-heavyrain',
        'h': 'ss-hail',
        'lsn': 'ss-rainsnow',
        'hsn': 'ss-snow',
        'tst': 'ss-thunderstorm',
    };
    var Weather = MoxieModel.extend({
        url: conf.urlFor('weather'),
        View: WeatherCard,
        setSSClass: function(observation) {
            // TODO: Will anyone notice that we hard-code to cloudy?
            var classes = ['ss-forecast'];
            if (ssCSSClasses[observation.outlook_icon]) {
                classes.push(ssCSSClasses[observation.outlook_icon]);
            } else {
                if ('console' in window) {
                    console.log("No icon for forecast: '"+ observation.outlook_description +"' Icon: "+ observation.outlook_icon);
                }
                classes.push('ss-clouds');
            }
            observation.ss_class = classes.join(' ');
            return observation;
        },
        parse: function(data) {
            this.setSSClass(data.observation);
            _.each(data.forecasts, function(forecast) {
                this.setSSClass(forecast);
                // Set moment as an attribute so we can sort easily afterwards
                forecast.moment = moment(forecast.observed_date);
                forecast.dayOfWeek = forecast.moment.format("dd");
            }, this);
            var sortedForecasts = _.sortBy(data.forecasts, function(forecast) { return forecast.moment.unix(); });
            // Remove the moment's since they aren't being used elsewhere and seem quite bulky objects
            // Remembering that model attributes should serialize nicely to JSON
            _.each(data.forecasts, function(forecast) { delete forecast.moment; });
            data.forecasts = sortedForecasts;
            return data;
        }
    });
    return Weather;
});
