define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'hbs!places/templates/detail', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti'],
    function($, Backbone, _, conf, detailTemplate, busRTITemplate, trainRTITemplate){
    var RTI_REFRESH = 15000;    // 15 seconds
    var DetailView = Backbone.View.extend({

        attributes: {
            'class': 'detail-map'
        },

        serialize: function() {
            var poi = this.model.toJSON();
            return {poi: poi,
            multiRTI: poi.RTI.length > 1,
            alternateRTI: this.model.getAlternateRTI(),
            currentRTI: this.model.getCurrentRTI()};
        },
        template: detailTemplate,
        manage: true,

        afterRender: function() {
            Backbone.trigger('domchange:title', this.model.get('name'));
            if (this.model.get('RTI')) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
            }
        },

        cleanup: function() {
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
