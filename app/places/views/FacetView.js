define(["backbone", "underscore"], function(Backbone, _){
    var FacetView = Backbone.View.extend({
        manage: true,
        tagName: "li",
        attributes: {'class': 'label-facet'},
        afterRender: function() { console.log(this.$el); this.$el.data('category', this.model.name); },
        serialize: function() { return this.model.toJSON(); },
        template: _.template('<%= title %>')
    });
    return FacetView;
});
