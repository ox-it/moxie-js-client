define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'hbs!places/templates/detail', 'hbs!places/templates/busrti'],
    function($, Backbone, _, conf, detailTemplate, busRTITemplate){
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

        afterRender: function() {
            Backbone.trigger('domchange:title', this.model.get('name'));
            if (this.model.getRTI()) {
                this.refreshRTI();
                this.refreshID = setInterval(this.refreshRTI, RTI_REFRESH);
            }
        },

        renderRTI: function(data) {
            this.$('#poi-rti').html(busRTITemplate(data));
            this.$("#rti-load").hide();
        },

        refreshRTI: function() {
            this.$("#rti-load").show();
            $.ajax({
                url: conf.endpoint + this.model.getRTI().href,
                dataType: 'json'
            }).success(this.renderRTI);
        },

        cleanup: function() {
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
