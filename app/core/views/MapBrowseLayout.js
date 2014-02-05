define(['backbone', 'core/views/MapView', 'hbs!core/templates/map-browse'], function(Backbone, MapView, mapBrowseTemplate) {

    var MapBrowseLayout = Backbone.View.extend({
        manage: true,
        template: mapBrowseTemplate,
        className: 'map-browse-layout',
        name: 'MapBrowseLayout',
        events: {
            'click .btn-toggle-browse': 'toggleBrowse',
        },

        toggleBrowse: function() {
            this.$el.toggleClass('with-browse');
        },

        // Previously we set this view in 'views' this is WRONG
        //
        // That way the view is a class attribute rather than being
        // created when it is required, as it is here (beforeRender)
        //
        // See commit #6511cae
        beforeRender: function() {
            this.setView(".content-map", new MapView());
        },
        removeDetail: function() {
            this.$el.removeClass('with-detail');
        },
        withDetail: function() {
            this.$el.addClass('with-detail');
        },
    });

    return MapBrowseLayout;
});
