define(['app/core/models/MoxieModel', 'underscore', 'app/moxie.conf'], function(MoxieModel, _, conf) {
    var testDelayed = function(estTime) {
        return !((estTime.indexOf('On time') === 0) || (estTime.indexOf('Starts here') === 0));
    };
    var RTIModel = MoxieModel.extend({
        url: function() {
            return conf.endpoint + this.get('href');
        },
        parse: function(data) {
            data.lastUpdated = new Date().getTime();
            return data;
        }
    });
    var RTIModels = {
        'bus': RTIModel,
        'rail-arrivals': RTIModel.extend({
            parse: function(data) {
                _.each(data.services, function(service) {
                    service.delayed = false;
                    if (service.etd) {
                        service.delayed = testDelayed(service.etd);
                    } else if (service.eta) {
                        service.delayed = testDelayed(service.eta);
                    }
                });
                return RTIModel.prototype.parse.apply(this, [data]);
            }
        }),
        'p-r': RTIModel
    };
    // Departures uses the same model as arrivals
    RTIModels['rail-departures'] = RTIModels['rail-arrivals'];
    return RTIModels;
});
