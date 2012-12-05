define(["backbone","places/models/POIModel"], function(Backbone, POI) {

    var POIs = Backbone.Collection.extend({

        model: POI

    });

    // Returns the Model class
    return POIs;

});
