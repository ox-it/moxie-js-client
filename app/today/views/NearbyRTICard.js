define(['today/views/RTICard'], function(RTICard) {
    var RTI_REFRESH = 60000;    // 1 minute
    var NearbyRTICard = RTICard.extend({
        weight: 75,
        attributes: {
            'class': 'today',
            'style': 'display:none;',
        },
        afterRender: function() {
            this.clearRefresh();
            if (this.model.get('RTI')) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
                this.model.rti.on('sync', this.showEl, this);
            }
        },
        showEl: function() {
            this.el.style.display = null;
        },
    });
    return NearbyRTICard;
});
