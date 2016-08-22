define(['underscore', 'app/moxie.conf', 'leaflet', 'app/moxie.position'], function(_, MoxieConf, L, userPosition){
    L.Icon.Default.imagePath = 'images/maps';
    var utils = {
        // This rather dense function takes the full set of categories
        getCategory: function(category_hierarchy, categories) {
            return _.reduce(category_hierarchy, function(categories, category_name) {
                return _.find(categories.types, function(cat) { return (cat.type===category_name); });
            }, categories);
        },
        getMap: function(el, options) {
            options = options || {};
            var position = options.position || userPosition.getCurrentLocation();
            var mapOptions = options.mapOptions || {};
            var map = new L.map(el, mapOptions).setView([position.coords.latitude, position.coords.longitude], MoxieConf.map.defaultZoom, true);

            // Add the tile layer
            L.tileLayer('http://maps-tiles.oucs.ox.ac.uk'+'/{z}/{x}/{y}.png', MoxieConf.map.defaultTileLayerOptions).addTo(map);
            map.attributionControl.setPrefix('');
            return map;
        }
    };
    return utils;
});
