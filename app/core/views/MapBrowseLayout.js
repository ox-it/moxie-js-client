define(['backbone', 'core/views/MapView', 'hbs!core/templates/map-browse'], function(Backbone, MapView, mapBrowseTemplate) {

    var MapBrowseLayout = Backbone.Layout.extend({
        manage: true,
        template: mapBrowseTemplate,
        className: 'map-browse-layout',
        name: 'MapBrowseLayout',
        beforeRender: function() {
            this.setView(".content-map", new MapView());
        }
    });

    return MapBrowseLayout;
});
