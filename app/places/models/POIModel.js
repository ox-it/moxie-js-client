define(["backbone", "underscore", "moxie.conf", "places/models/RTIModel", "places/views/RTIView"], function(Backbone, _, conf, RTI, RTIView) {

    var DEFAULT_RTI_TYPES = ['bus', 'rail-departures'];
    var POI = Backbone.Model.extend({
        url: function() {
           return conf.urlFor('places_id') + this.id;
        },

        renderRTI: function(target, timeout) {
            var rti = this.getRTI(DEFAULT_RTI_TYPES);
            var attrs = rti[0];
            this.rti = new RTI(attrs);
            var rtiView = new RTIView({model: this.rti, el: target});
            this.rti.fetch();
            if (timeout) {
                return setInterval(_.bind(this.rti.fetch, this.rti), timeout);
            }
        },

        getRTI: function(types) {
            types = [] || types;
            var rti = [];
            _.each(this.attributes._links, function(val, key) {
                console.log(key);
                if (key.indexOf('rti:') === 0) {
                    // Remove the rti: from the front
                    // and set it as a type attr
                    val.type = key.substring(4);
                    if (_.contains(types, val.type)) {
                        return val;
                    }
                    rti.push(val);
                }
            });
            return rti;
        }
    });

    // Returns the Model class
    return POI;

});
