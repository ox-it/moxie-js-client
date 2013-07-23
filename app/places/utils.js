define(['underscore', 'moxie.conf', 'leaflet', 'moxie.position'], function(_, MoxieConf, L, userPosition){
    L.Icon.Default.imagePath = 'images/maps';
    var utils = {
        // This rather dense function takes the full set of categories
        getCategory: function(category_hierarchy, categories) {
            return _.reduce(category_hierarchy, function(categories, category_name) {
                return _.find(categories.types, function(cat) { return (cat.type===category_name); });
            }, categories);
        },
        getMap: function(el, position) {
            position = position || userPosition.getCurrentLocation();
            if (('device' in window) && (window.device.platform==='Android')) {
                // Disable 3D acceleration for Android WebViews
                if ('console' in window) {
                    console.log("Android! Disabling 3D acceleration.");
                }
                L.Browser.any3d = false;
            }
            var map = new L.map(el).setView([position.coords.latitude, position.coords.longitude], 15, true);
            L.tileLayer('http://a.tiles.mapbox.com/v3/'+MoxieConf.mapbox.key+'/{z}/{x}/{y}.png', {
                minZoom: 0,
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }).addTo(map);
            map.attributionControl.setPrefix('');
            return map;
        }
    };
    return utils;
});
