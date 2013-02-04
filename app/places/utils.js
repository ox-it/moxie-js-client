define(['underscore', 'moxie.conf', 'leaflet'], function(_, MoxieConf, L){
    var utils = {
        // This rather dense function takes the full set of categories
        getCategory: function(category_hierarchy, categories) {
            return _.reduce(category_hierarchy, function(categories, category_name) {
                return _.find(categories.types, function(cat) { return (cat.type===category_name); });
            }, categories);
        },
        getMap: function(el) {
            if (L.Browser.android) {
                console.log("Android! Disabling 3D acceleration.");
                L.Browser.any3d = false;
            }
            var map = new L.map(el).setView([MoxieConf.defaultLocation.coords.latitude, MoxieConf.defaultLocation.coords.longitude], 15, true);
            L.tileLayer('http://{s}.tile.cloudmade.com/'+MoxieConf.cloudmade.key+'/997/256/{z}/{x}/{y}.png', {
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
