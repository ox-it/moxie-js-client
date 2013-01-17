define(['jquery', 'backbone', 'underscore', 'leaflet', 'moxie.conf', 'moxie.position', 'hbs!places/templates/embedded_poi'],
    function($, Backbone, _, L, MoxieConf, userPosition, embeddedTemplate){
    var EmbeddedPoiView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.requestPOI();
        },

        requestPOI: function() {
            var url = MoxieConf.urlFor('places_id') + this.options.poid;
            $.ajax({
                url: url,
                dataType: 'json'
            }).success(this.renderPOI);
        },

        renderPOI: function(data) {
            $("#"+this.options.render_element.replace(":", "\\:"))
                .html(embeddedTemplate(data));
        }
    });
    return EmbeddedPoiView;
});
