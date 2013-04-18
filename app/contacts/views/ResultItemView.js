define(["backbone", "hbs!contacts/templates/result-item"], function(Backbone, resultTemplate){
    var ResultItemView = Backbone.View.extend({
        manage: true,
        tagName: "li",
        serialize: function() { return {contact: this.model.toJSON()}; },
        template: resultTemplate
    });
    return ResultItemView;
});
