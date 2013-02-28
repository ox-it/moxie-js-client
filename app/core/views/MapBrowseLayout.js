define(['backbone', 'core/views/MapView', 'hbs!core/templates/map-browse'], function(Backbone, MapView, mapBrowseTemplate) {

    var MapBrowseLayout = Backbone.View.extend({
        manage: true,
        template: mapBrowseTemplate,
        className: 'map-browse-layout',
        name: 'MapBrowseLayout',
        views: {
            ".content-map": new MapView()
        }
    });

    return MapBrowseLayout;
});
