define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'hbs!places/templates/detail', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti'],
    function($, Backbone, _, conf, detailTemplate, busRTITemplate, trainRTITemplate){
    var RTI_REFRESH = 15000;    // 15 seconds
    var DetailView = Backbone.View.extend({

        initialize: function() {
            Backbone.trigger('domchange:title', this.model.get('name'));
            Backbone.on('favourited', _.bind(this.favourited, this));
        },
        attributes: {
            'class': 'detail-map'
        },

        serialize: function() {
            var poi = this.model.toJSON();
            return {
                poi: poi,
                multiRTI: poi.RTI.length > 1,
                alternateRTI: this.model.getAlternateRTI(),
                currentRTI: this.model.getCurrentRTI()
            };
        },
        template: detailTemplate,
        manage: true,

        afterRender: function() {
            if (this.model.get('RTI').length > 0) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
            }
        },

        favourited: function(fav) {
            fav.set('options', {model: this.model.toJSON()});
            fav.set('type', 'poi:'+this.model.get('type'));
            fav.save();
        },

        cleanup: function() {
            Backbone.off('favourited');
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
