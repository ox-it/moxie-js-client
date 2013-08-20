define(['jquery', 'backbone', 'underscore', 'leaflet', 'places/utils', 'moxie.conf', 'moxie.position', 'hbs!library/templates/item-map-layout', 'hbs!library/templates/item'],
    function($, Backbone, _, L, placesUtils, MoxieConf, userPosition, baseTemplate, itemTemplate){
        var ItemView = Backbone.View.extend({
            initialize: function() {
                this.pois = this.model.getPOIs();
                this.pois.on('change', this.hightligted, this);
            },

            highlighted: function() {
                console.log(arguments);
            },

            manage: true,

            attributes: {
                'class': 'generic'
            },

            template: itemTemplate,
            serialize: function() {
                var holdings = this.getHoldings(this.model);
                return {item: this.model, holdings: holdings};
            },

            afterRender: function (cb) {
                Backbone.trigger('domchange:title', this.model.attributes.title);
            },

            getHoldings: function (item) {
                // merge _embedded location info with holdings
                var holdings = [];
                var attr = item.attributes;
                for(var holding in attr.holdings) {
                    holdings.push({code: holding, holdings: attr.holdings[holding], location: this.pois.get(holding).toJSON()});
                }
                return holdings;
            }

        });
        return ItemView;
    });
