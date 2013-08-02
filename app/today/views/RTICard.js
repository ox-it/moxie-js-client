define(['moxie.conf', 'underscore', 'today/views/CardView', 'hbs!today/templates/rti'], function(conf, _, CardView, rtiTemplate) {

    var RTI_REFRESH = 60000;    // 1 minute
    var RTICard = CardView.extend({
        initialize: function() {
            this.model.on('sync', this.render, this);
        },
        manage: true,
        attributes: {
            'class': 'today',
        },
        serialize: function() {
            return this.model.toJSON();
        },
        template: rtiTemplate,
        afterRender: function() {
            this.clearRefresh();
            if (this.model.get('RTI')) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
            }
        },
        clearRefresh: function() {
            if (this.refreshID) {
                clearInterval(this.refreshID);
            }
        },
        cleanup: function() {
            this.clearRefresh();
            this.model.off();
            if ('unfollowUser' in this.model) {
                this.model.unfollowUser();
            }
        },
    });
    return RTICard;
});
