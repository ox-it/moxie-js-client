define(["backbone", "underscore", "hbs!places/templates/item"], function(Backbone, _, itemTemplate){
    var ItemView = Backbone.View.extend({
        initialize: function() {
            this.model.on('change:highlighted', _.bind(this.highlight, this));
        },
        highlight: function(poi) {
            var scrollEl = $('.content-browse');
            // Test if we have a scrollable div (ack.)
            if (scrollEl.get(0).scrollHeight > scrollEl.height()) {
                scrollEl.scrollTop((scrollEl.scrollTop() + this.$el.position().top) - 70);
            } else {
                scrollEl = $(window);
                scrollEl.scrollTop(this.$el.position().top);
            }
            if (poi.get('highlighted')) {
                this.$el.addClass('highlighted');
            } else {
                this.$el.removeClass('highlighted');
            }
        },
        manage: true,
        tagName: "li",
        serialize: function() { return this.model.toJSON(); },
        template: itemTemplate
    });
    return ItemView;
});
