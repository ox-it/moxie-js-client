define(['backbone', 'hbs!today/templates/rivers'], function(Backbone, riversTemplate) {
    var RiversCard = Backbone.View.extend({
        manage: true,
        id: 'rivers_status',
        attributes: {'class': 'today'},
        serialize: function() {
            return this.model.toJSON();
        },
        template: riversTemplate
    });
    return RiversCard;
});
