define(["MoxieModel", "underscore", "moxie.conf", "places/models/RTIModels", "places/views/RTIViews"], function(MoxieModel, _, conf, RTIModels, RTIViews) {

    var DEFAULT_RTI_TYPES = ['bus', 'rail-departures', 'p-r'];
    var POI = MoxieModel.extend({
        defaults: {
            'RTI': []
        },

        url: function() {
           return conf.urlFor('places_id') + this.id;
        },

        renderRTI: function(target, timeout, type) {
            var attrs = this.getCurrentRTI();
            var RTIModel = RTIModels[attrs.type];
            this.rti = new RTIModel(attrs);
            var RTIView = RTIViews[attrs.type];
            var rtiView = new RTIView({model: this.rti, el: target});
            this.rti.fetch();
            if (timeout) {
                return setInterval(_.bind(this.rti.fetch, this.rti), timeout);
            }
        },

        hasLocation: function() {
            return this.has('lat') && this.has('lon');
        },

        getCurrentRTI: function() {
            var showRTI = this.get('showRTI');
            var types = showRTI ? [showRTI] : DEFAULT_RTI_TYPES;
            return _.find(this.get('RTI'), function(rti) { return _.contains(types, rti.type); });
        },

        getAlternateRTI: function() {
            var showRTI = this.get('showRTI');
            var types = showRTI ? [showRTI] : DEFAULT_RTI_TYPES;
            return _.filter(this.get('RTI'), function(rti) { return !_.contains(types, rti.type); });
        },

        parse: function(data) {
            data.RTI = [];
            _.each(data._links, function(val, key) {
                if (key.indexOf('rti:') === 0) {
                    // Remove the rti: from the front
                    // and set it as a type attr
                    val.type = key.substring(4);
                    data.RTI.push(val);
                }
            });
            return data;
        }

    });

    // Returns the Model class
    return POI;

});
