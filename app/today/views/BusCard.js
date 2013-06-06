define(['moxie.conf', 'underscore', 'today/views/CardView', 'hbs!today/templates/bus', 'hbs!places/templates/busrti'], function(conf, _, CardView, busTemplate, busRTITemplate) {

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
        renderRTI: function(data) {
            this.$('#poi-rti').html(busRTITemplate(data));
            this.$("#rti-load").css('visibility', 'hidden');
            this.showEl();
        },
        afterRender: function() {
            var rti = this.model.getRTI();
            if (this.model.getRTI()) {
                this.refreshRTI();
                this.refreshID = setInterval(_.bind(this.refreshRTI, this), RTI_REFRESH);
            }
        },
        refreshRTI: function() {
            this.$("#rti-load").css('visibility', 'visible');
            $.ajax({
                url: conf.endpoint + this.model.getRTI().href,
                dataType: 'json'
            }).success(_.bind(this.renderRTI, this));
        },
        showEl: function() {
            this.el.style.display = null;
        },
        cleanup: function() {
            clearInterval(this.refreshID);
            this.model.off();
            this.model.unfollowUser();
        },
    });
    return BusCard;

});
