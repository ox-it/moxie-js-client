define(["backbone", "moxie.conf"], function(Backbone, conf) {

    var POI = Backbone.Model.extend({
        url: function() {
           return conf.urlFor('places_id') + this.id;
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
