define(['jquery', 'backbone', 'underscore', 'leaflet', 'places/utils', 'moxie.conf', 'moxie.position', 'hbs!library/templates/item-map-layout', 'hbs!library/templates/item'],
    function($, Backbone, _, L, placesUtils, MoxieConf, userPosition, baseTemplate, itemTemplate){
        var ItemView = Backbone.View.extend({

            initialize: function () {
                _.bindAll(this);
                this.user_position = null;
                this.latlngs = [];
                this.markers = [];
            },

            attributes: {
                'class': 'detail-map'
            },

            render: function () {
                this.$el.html(baseTemplate());
                this.map = placesUtils.getMap(this.$('#map')[0]);
                userPosition.follow(this.handle_geolocation_query);
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
                var holdings = this.getHoldings(this.item);
                var context = {item: this.item, holdings: holdings};
                this.$("#item").html(itemTemplate(context));
                this.prepareMap(holdings);
                this.setMapBounds();
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
            },

            prepareMap: function(holdings) {
                for(var holding in holdings) {
                    this.placeHolding(holdings[holding].location);
                }
                this.updateMap();
            },

            placeHolding: function(poi) {
                if(poi && poi.lat && poi.lon) {
                    var latlng = new L.LatLng(poi.lat, poi.lon);
                    var marker = new L.marker(latlng, {'title': poi.name});
                    marker.addTo(this.map);
                    this.latlngs.push(latlng);
                    this.markers.push(marker);
                }
            },

            setMapBounds: function() {
                var bounds = new L.LatLngBounds(this.latlngs);
                if (this.user_position) {
                    bounds.extend(this.user_position);
                }
                bounds.pad(5);
                this.map.fitBounds(bounds);
            },

            invalidateMapSize: function() {
                this.map.invalidateSize();
                return this;
            },

            updateMap: function() {
                if (this.user_position && this.latlng) {
                    this.map.fitBounds([
                        this.user_position,
                        this.latlng
                    ]);
                } else if (this.user_position) {
                    this.map.panTo(this.user_position);
                } else if (this.latlng) {
                    this.map.panTo(this.latlng);
                }
            },

            handle_geolocation_query: function(position) {
                this.user_position = [position.coords.latitude, position.coords.longitude];
                var you = new L.LatLng(position.coords.latitude, position.coords.longitude);
                if (this.user_marker) {
                    this.map.removeLayer(this.user_marker);
                }
                this.user_marker = L.circle(you, 10, {color: 'red', fillColor: 'red', fillOpacity: 1.0});
                this.map.addLayer(this.user_marker);
                this.updateMap();
            },

            onClose: function() {
                userPosition.unfollow(this.handle_geolocation_query);
            }
        });
        return ItemView;
    });
