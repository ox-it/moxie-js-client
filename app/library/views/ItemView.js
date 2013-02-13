define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'hbs!library/templates/item'],
    function($, Backbone, _, L, MoxieConf, userPosition, itemTemplate){
        var ItemView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
            },

            render: function() {
                this.requestItem();
                return this;
            },

            requestItem: function() {
                var url = MoxieConf.urlFor('library_item') + this.options.item_id + "/";
                $.ajax({
                    url: url,
                    dataType: 'json'
                }).success(this.getDetail).error(this.onError);
            },

            getDetail: function(data) {
                this.item = new this.model(data);
                this.renderItem();
            },

            renderItem: function(cb) {
                Backbone.trigger('domchange:title', this.item.attributes.title);
                var html = itemTemplate(this.item);
                this.$el.html(html);
            },

            onError: function(obj, textStatus, errorThrown) {
                console.log(obj);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        return ItemView;
    });
