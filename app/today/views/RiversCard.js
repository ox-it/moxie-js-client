define(['today/views/CardView', 'hbs!today/templates/rivers'], function(CardView, riversTemplate) {
    var RiversCard = CardView.extend({
        weight: 70,
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
