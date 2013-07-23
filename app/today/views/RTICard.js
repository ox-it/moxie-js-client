define(['jquery', 'moxie.conf', 'underscore', 'masonry', 'today/views/CardView', 'hbs!today/templates/rti'], function($, conf, _, masonry, CardView, rtiTemplate) {

    var RTI_REFRESH = 60000;    // 1 minute
    var RTICard = CardView.extend({
        initialize: function() {
            this.model.on('change', this.render, this);
        },
        weight: 75,
        manage: true,
        attributes: {
            'class': 'today',
            'style': 'display:none;',
        },
        serialize: function() {
            return this.model.toJSON();
        },
        template: rtiTemplate,
        beforeRender: function() {
            this.el.style.display = 'none';
        },
        afterRender: function() {
            this.clearRefresh();
            if (this.model.get('RTI')) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
                this.model.rti.on('sync', this.showEl, this);
            }
            $('.today-card-container').masonry('reload');
        },
        showEl: function() {
            this.el.style.display = null;
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
