define(['jquery', 'app/today/views/CardView', 'hbs!app/today/templates/rivers', 'foundation.tooltips'], function($, CardView, riversTemplate) {
    var RiversCard = CardView.extend({
        weight: 70,
        manage: true,
        id: 'rivers_status',
        attributes: {'class': 'today'},
        serialize: function() {
            return this.model.toJSON();
        },
        template: riversTemplate,
        afterRender: function() {
            // Initialise Foundation JS (used for tooltip)
            $(document).foundation();
        }
    });
    return RiversCard;
});
