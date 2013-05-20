define(['backbone', 'hbs!today/templates/oxford_date'], function(Backbone, oxfordDateTemplate) {
    var OxfordDateView = Backbone.View.extend({
        tagName: 'li',
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
