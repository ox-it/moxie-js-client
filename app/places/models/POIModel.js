define(["backbone", "underscore", "moxie.conf", "places/models/RTIModel", "places/views/RTIView"], function(Backbone, _, conf, RTI, RTIView) {

    var POI = Backbone.Model.extend({
        url: function() {
           return conf.urlFor('places_id') + this.id;
        },

        renderRTI: function(target, timeout) {
            var attrs = this.getRTI();
            // TODO: Currently RTI needs to know which "type" of POI
            // it is representing. We need to revisit this.
            attrs.type = this.get('type');
            this.rti = new RTI(attrs);
            var rtiView = new RTIView({model: this.rti, el: target});
            this.rti.fetch();
            if (timeout) {
                return setInterval(_.bind(this.rti.fetch, this.rti), timeout);
            }
        },

        getRTI: function() {
            if (this.attributes._links && this.attributes._links['hl:rti']) {
                return this.attributes._links['hl:rti'];
            }
        }
    });

    // Returns the Model class
    return POI;

});
