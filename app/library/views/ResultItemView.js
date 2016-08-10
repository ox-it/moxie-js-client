define(["backbone", "hbs!app/library/templates/result-item"], function(Backbone, resultTemplate){
    var ResultItemView = Backbone.View.extend({
        manage: true,
        tagName: "li",
        serialize: function() { return {item: this.model.toJSON()}; },
        template: resultTemplate
    });
    return ResultItemView;
});
