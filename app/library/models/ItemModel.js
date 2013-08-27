define(["MoxieModel", "underscore", "leaflet", "moxie.conf", "places/collections/POICollection", "places/models/POIModel"], function(MoxieModel, _, L, conf, POIs, POI) {

    var ICON_PATH_PREFIX = 'images/maps/';

    var HoldingPOI = POI.extend({
        idAttribute: 'holdingID',
        icons: {
            0: ['marker-icon-red.png', 'marker-icon-2x-red.png'],
            1: ['marker-icon-grey.png', 'marker-icon-2x-grey.png'],
            2: ['marker-icon-yellow.png', 'marker-icon-2x-yellow.png'],
            3: ['marker-icon-green.png', 'marker-icon-2x-green.png'],
            4: ['marker-icon-green.png', 'marker-icon-2x-green.png'],
        },
        getIcon: function() {
            var av = this.get('availability');
            return L.icon({
                iconSize: [25, 41],
                iconAnchor: [12, 40],
                iconUrl: ICON_PATH_PREFIX + this.icons[av][0],
                iconRetinaUrl: ICON_PATH_PREFIX + this.icons[av][1],
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
            var pois = [];
            if ('_embedded' in data) {
                _.each(data._embedded, function(poi, holding_ident) {
                    poi.holdingID = holding_ident;
                    if (holding_ident in data.holdings) {
                        poi.availability = 0;
                        _.each(data.holdings[holding_ident], function(holding) {
                            if (holding.availability > poi.availability) {
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
