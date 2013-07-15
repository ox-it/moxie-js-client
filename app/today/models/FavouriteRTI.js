define(["places/models/POIModel", "today/views/BusCard"], function(POI, BusCard) {
    var FavRTI = POI.extend({
        View: BusCard.extend({weight: 85}),
        fetch: function() {
            return true;
        },
    });
    return FavRTI;
});
