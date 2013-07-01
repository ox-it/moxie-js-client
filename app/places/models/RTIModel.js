define(['backbone', 'underscore', 'moxie.conf'], function(Backbone, _, conf) {
    var testDelayed = function(estTime) {
        return !((estTime.indexOf('On time') === 0) || (estTime.indexOf('Starts here') === 0));
    };
    var RTIModel = Backbone.Model.extend({
        url: function() {
            return conf.endpoint + this.get('href');
        },
        parse: function(data) {
            if (data.type && _.contains(['rail-arrivals', 'rail-departures'], data.type)) {
                _.each(data.services, function(service) {
                    service.delayed = false;
                    if (service.etd) {
                        service.delayed = testDelayed(service.etd);
                    } else if (service.eta) {
                        service.delayed = testDelayed(service.eta);
                    }
                });
            }
            return data;
        }
    });
    return RTIModel;
});
