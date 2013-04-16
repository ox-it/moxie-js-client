define(['backbone', 'core/views/MapView', 'hbs!core/templates/map-browse'], function(Backbone, MapView, mapBrowseTemplate) {

    var MapBrowseLayout = Backbone.Layout.extend({
        manage: true,
        template: mapBrowseTemplate,
        className: 'map-browse-layout',
        name: 'MapBrowseLayout',

        // Previously we set this view in 'views' this is WRONG
        //
        // That way the view is a class attribute rather than being
        // created when it is required, as it is here (beforeRender)
        //
        // See commit #6511cae
        beforeRender: function() {
            this.setView(".content-map", new MapView());
        }
    });

    return MapBrowseLayout;
});
