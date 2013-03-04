define(['jquery', 'backbone', 'underscore', 'hbs!places/templates/detail', 'hbs!places/templates/busrti'],
    function($, Backbone, _, detailTemplate, busRTITemplate){
    var RTI_REFRESH = 15000;    // 15 seconds
    var DetailView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        attributes: {
            'class': 'detail-map'
        },

        serialize: function() {
            return {'poi': this.model.toJSON(), 'rti': this.model.getRTI()};
        },
        template: detailTemplate,
        manage: true,

        renderRTI: function(data) {
            this.$('#poi-rti').html(busRTITemplate(data));
            this.$("#rti-load").hide();
        },

        refreshRTI: function() {
            this.$("#rti-load").show();
            $.ajax({
                url: MoxieConf.endpoint + this.model.getRTI().href,
                dataType: 'json'
            }).success(this.renderRTI);
        },

        cleanup: function() {
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
