define(["places/models/POIModel", "today/views/FavouriteRTICard"], function(POI, FavouriteRTICard) {
    var FavRTI = POI.extend({
        View: FavouriteRTICard,
        fetch: function() {
            return true;
        },
    });
    return FavRTI;
});
