define(["MoxieModel", "underscore", "moxie.conf", "places/collections/POICollection", "places/models/POIModel"], function(MoxieModel, _, conf, POIs, POI) {

    var HoldingPOI = POI.extend({
        idAttribute: 'holdingID'
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
