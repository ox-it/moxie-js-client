define(["places/models/POIModel", "today/views/RTICard"], function(POI, RTICard) {
    var FavRTI = POI.extend({
        View: RTICard.extend({weight: 85}),
        fetch: function() {
            return true;
        },
    });
    return FavRTI;
});
