define(['jquery', 'backbone', 'underscore', 'leaflet', 'places/utils', 'moxie.conf', 'moxie.position', 'hbs!library/templates/item-map-layout', 'hbs!library/templates/item'],
    function($, Backbone, _, L, placesUtils, MoxieConf, userPosition, baseTemplate, itemTemplate){
        var ItemView = Backbone.View.extend({
            initialize: function() {
                this.pois = this.model.getPOIs();
            },

            highlightHolding: function(model) {
                if (model.get('highlighted')) {
                    this.render();
                    var highlightedEl = this.$('.highlighted');
                    console.log(highlightedEl);
                    var scrollEl = $('.content-browse');
                    // Test if we have a scrollable div (ack.)
                    // Effectively making this a test to see if we're in responsive mode...
                    if (scrollEl.get(0).scrollHeight > scrollEl.height()) {
                        scrollEl.scrollTop((scrollEl.scrollTop() + highlightedEl.position().top) - 70);
                    } else {
                        scrollEl = $(window);
                        scrollEl.scrollTop(highlightedEl.position().top);
                    }
                }
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
                    var holdingLocation = this.pois.get(holding);
                    if (holdingLocation) { holdingLocation = holdingLocation.toJSON(); }
                    holdings.push({code: holding, holdings: attr.holdings[holding], location: holdingLocation});
                }
                return holdings;
            }

        });
        return ItemView;
    });
