define(["MoxieModel", "underscore", "leaflet", "moxie.conf", "places/collections/POICollection", "places/models/POIModel"], function(MoxieModel, _, L, conf, POIs, POI) {

    var ICON_PATH_PREFIX = 'images/maps/';

    // Holding states
    var UNAVAILABLE = 'unavailable';
    var UNKNOWN = 'unknown';
    var STACK = 'stack';
    var REFERENCE = 'reference';
    var AVAILABLE = 'available';
    var holdingStates = [UNKNOWN, UNAVAILABLE, STACK, REFERENCE, AVAILABLE];
    var holdingIcons = {};
    holdingIcons[UNAVAILABLE] = ['marker-icon-red.png', 'marker-icon-2x-red.png'];
    holdingIcons[UNKNOWN] = ['marker-icon-grey.png', 'marker-icon-2x-grey.png'];
    holdingIcons[STACK] = ['marker-icon-yellow.png', 'marker-icon-2x-yellow.png'];
    holdingIcons[REFERENCE] = ['marker-icon-green.png', 'marker-icon-2x-green.png'];
    holdingIcons[AVAILABLE] = ['marker-icon-green.png', 'marker-icon-2x-green.png'];

    var HoldingPOI = POI.extend({
        idAttribute: 'holdingID',
        getIcon: function() {
            var av = this.get('availability');
            return L.icon({
                iconSize: [25, 41],
                iconAnchor: [12, 40],
                iconUrl: ICON_PATH_PREFIX + holdingIcons[av][0],
                iconRetinaUrl: ICON_PATH_PREFIX + holdingIcons[av][1],
                shadowUrl: ICON_PATH_PREFIX + 'marker-shadow.png'
            });
        },
    });
    var HoldingPOIs = POIs.extend({
        model: HoldingPOI
    });
    var Item = MoxieModel.extend({
        url: function() {
            return conf.urlFor('library_item') + this.id + '/';
        },
        getPOIs: function() {
            return this.get('holdingPOIs');
        },
        parse: function(data) {
            // Parse the Holding / Item data from our API
            //
            // We align the holding data with the POI's to give an overview of
            // book availability at each library. So we can place approprately
            // colour coded icons on the map.
            var pois = [];
            if ('_embedded' in data) {
                _.each(data._embedded, function(poi, holding_ident) {
                    poi.holdingID = holding_ident;
                    if (holding_ident in data.holdings) {
                        // Default to UNKNOWN for the entire POI
                        poi.availability = UNKNOWN;
                        _.each(data.holdings[holding_ident], function(holding) {
                            if (holdingStates.indexOf(holding.availability) === -1) {
                                // missing holding data so set to UNKNOWN also
                                holding.availability = UNKNOWN;
                            } else if (holdingStates.indexOf(holding.availability) > holdingStates.indexOf(poi.availability)) {
                                poi.availability = holding.availability;
                            }
                        });
                    }
                    pois.push(poi);
                });
            }
            data.holdingPOIs = new HoldingPOIs(pois);
            delete data._embedded;
            return data;
        }
    });

    // Returns the Model class
    return Item;

});
