define(["backbone", "underscore", "moxie.conf", "places/models/RTIModel", "places/views/RTIView"], function(Backbone, _, conf, RTI, RTIView) {

    var DEFAULT_RTI_TYPES = ['bus', 'rail-departures'];
    var POI = Backbone.Model.extend({
        url: function() {
           return conf.urlFor('places_id') + this.id;
        },

        renderRTI: function(target, timeout, type) {
            var types = type ? [type] : DEFAULT_RTI_TYPES;
            var allRTI = this.getRTI();
            var filteredRTI = _.filter(allRTI, function(rti) { return _.contains(types, rti.type); });
            var attrs = filteredRTI[0];
            this.rti = new RTI(attrs);
            var rtiView = new RTIView({model: this.rti, el: target});
            this.rti.fetch();
            if (timeout) {
                return setInterval(_.bind(this.rti.fetch, this.rti), timeout);
            }
        },

        getRTI: function() {
            var rti = [];
            _.each(this.attributes._links, function(val, key) {
                if (key.indexOf('rti:') === 0) {
                    // Remove the rti: from the front
                    // and set it as a type attr
                    val.type = key.substring(4);
                    rti.push(val);
                }
            });
            return rti;
        }
    });

    // Returns the Model class
    return POI;

});
