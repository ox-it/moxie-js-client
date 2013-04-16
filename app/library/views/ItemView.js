define(['jquery', 'backbone', 'underscore', 'leaflet', 'places/utils', 'moxie.conf', 'moxie.position', 'hbs!library/templates/item-map-layout', 'hbs!library/templates/item'],
    function($, Backbone, _, L, placesUtils, MoxieConf, userPosition, baseTemplate, itemTemplate){
        var ItemView = Backbone.View.extend({

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
                    holdings.push({code: holding, holdings: attr.holdings[holding], location: attr._embedded[holding]});
                }
                return holdings;
            }

        });
        return ItemView;
    });
