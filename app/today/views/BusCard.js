define(['jquery', 'moxie.conf', 'underscore', 'masonry', 'today/views/CardView', 'hbs!today/templates/bus', 'hbs!places/templates/busrti'], function($, conf, _, masonry, CardView, busTemplate, busRTITemplate) {

    var RTI_REFRESH = 60000;    // 1 minute
    var BusCard = CardView.extend({
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
        template: busTemplate,
        beforeRender: function() {
            this.el.style.display = 'none';
        },
        afterRender: function() {
            this.clearRefresh();
            if (this.model.getRTI()) {
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
            this.model.unfollowUser();
        },
    });
    return BusCard;

});
