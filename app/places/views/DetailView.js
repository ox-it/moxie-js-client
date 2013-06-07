define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'hbs!places/templates/detail', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti'],
    function($, Backbone, _, conf, detailTemplate, busRTITemplate, trainRTITemplate){
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
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
            }
        },

        cleanup: function() {
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
