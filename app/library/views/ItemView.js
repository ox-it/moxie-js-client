define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'hbs!library/templates/item'],
    function($, Backbone, _, L, MoxieConf, userPosition, itemTemplate){
        var ItemView;
        ItemView = Backbone.View.extend({

            initialize: function () {
                _.bindAll(this);
            },

            render: function () {
                this.requestItem();
                return this;
            },

            requestItem: function () {
                var url = MoxieConf.urlFor('library_item') + this.options.item_id + "/";
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).success(this.getDetail).error(this.onError);
            },

            getDetail: function (data) {
                this.item = new this.model(data);
                this.renderItem();
            },

            renderItem: function (cb) {
                Backbone.trigger('domchange:title', this.item.attributes.title);
                var context = {item: this.item, holdings: this.getHoldings(this.item)};
                var html = itemTemplate(context);
                this.$el.html(html);
            },

            getHoldings: function (item) {
                // merge _embedded location info with holdings
                var holdings = [];
                var attr = item.attributes;
                for(var holding in attr.holdings) {
                    holdings.push({holdings: attr.holdings[holding][0], location: attr._embedded[holding]});
                }
                return holdings;
            },

            onError: function (obj, textStatus, errorThrown) {
                console.log(obj);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        return ItemView;
    });
