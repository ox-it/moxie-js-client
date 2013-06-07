define(['backbone', 'underscore', 'hbs!places/templates/busrti', 'hbs!places/templates/trainrti'], function(Backbone, _, busRTITemplate, trainRTITemplate) {
    var RTIView = Backbone.View.extend({
        initialize: function() {
            this.model.on('sync', this.render, this);
            this.model.on('request', this.showLoader, this);
            var type = this.model.get('type');
            var template;
            if (_.contains(type, '/transport/bus-stop')) {
                template = busRTITemplate;
            } else if (_.contains(type, '/transport/rail-station')) {
                template = trainRTITemplate;
            }
            this.template = template;
        },
        manage: true,
        serialize: function() {
            return this.model.toJSON();
        },
        showLoader: function() {
            this.$("#rti-load").css('visibility', 'visible');
        },
        afterRender: function() {
            this.$("#rti-load").css('visibility', 'hidden');
        },
        cleanup: function() {
            this.model.off();
        }
    });
    return RTIView;
});
