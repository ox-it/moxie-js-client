define(['today/views/RTICard'], function(RTICard) {
    var RTI_REFRESH = 30000;    // 30 seconds
    var FavouriteRTICard = RTICard.extend({
        weight: 85,
        afterRender: function() {
            this.clearRefresh();
            if (this.model.get('RTI')) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
                this.model.rti.on('errorFetching', function(model) {
                    // Retry upon error loading the RTI
                    if (this.model.has('errorCount')) {
                        this.model.set('errorCount', this.model.get('errorCount') + 1);
                    } else {
                        this.model.set('errorCount', 1);
                    }
                    if (this.model.get('errorCount') < 4) {
                        this.render();
                    }
                }, this);
            }
        },
    });
    return FavouriteRTICard;
});
