define(["MoxieModel", "moxie.conf", "places/collections/POICollection"], function(MoxieModel, conf, POIs) {

    var Item = MoxieModel.extend({
        url: function() {
            return conf.urlFor('library_item') + this.id + '/';
        },
        getPOIs: function() {
            var embeddedPOI = this.get('_embedded');
            var pois = [];
            if (embeddedPOI) {
                _.each(embeddedPOI, function(poi, holding_ident) {
                    poi.holding_identifier = holding_ident;
                    pois.push(poi);
                });
            }
            return new POIs(pois);
        }
    });

    // Returns the Model class
    return Item;

});
