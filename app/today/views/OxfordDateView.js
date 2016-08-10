define(['app/today/views/CardView', 'hbs!app/today/templates/oxford_date'], function(CardView, oxfordDateTemplate) {
    var OxfordDateView = CardView.extend({
        weight: 90,
        manage: true,
        id: 'oxford_date',
        attributes: {'class': 'today'},
        serialize: function() {
            return this.model.toJSON();
        },
        template: oxfordDateTemplate
    });
    return OxfordDateView;
});
