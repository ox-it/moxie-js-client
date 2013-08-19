define(["MoxieModel", "underscore", "moxie.conf", "places/collections/POICollection"], function(MoxieModel, _, conf, POIs) {

    var Item = MoxieModel.extend({
        url: function() {
            return conf.urlFor('library_item') + this.id + '/';
        },
        defaults: {
            holdings: []
        },
        getPOIs: function() {
            var pois = this.get('pois');
            return new POIs(pois);
        },
        parse: function(data) {
            var pois = [];
            if ('_embedded' in data) {
                _.each(data._embedded, function(poi, holding_ident) {
                    poi.holding_identifier = holding_ident;
                    pois.push(poi);
                });
            }
            data.pois = pois;
            return data;
        }
    });

    // Returns the Model class
    return Item;

});
