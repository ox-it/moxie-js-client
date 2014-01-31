define(["backbone", "underscore", "hbs!places/templates/item"], function(Backbone, _, itemTemplate){
    var ItemView = Backbone.View.extend({
        initialize: function() {
            this.urlPrefix = this.options.urlPrefix;
            this.model.on('change:highlighted', _.bind(this.highlight, this));
        },
        highlight: function(poi) {
            if (poi.get('highlighted')) {
                this.$el.addClass('highlighted');

                // Scroll to the POI Selected from the Map
                //
                // Only scroll to the element which is being highlighted, not the one being unhighlighted.
                var scrollEl = $('.content-browse');
                // Test if we have a scrollable div (ack.)
                // Effectively making this a test to see if we're in responsive mode...
                if (scrollEl.get(0).scrollHeight > scrollEl.height()) {
                    scrollEl.scrollTop((scrollEl.scrollTop() + this.$el.position().top) - 70);
                } else {
                    scrollEl = $(window);
                    scrollEl.scrollTop(this.$el.position().top);
                }
            } else {
                this.$el.removeClass('highlighted');
            }
        },
        manage: true,
        tagName: "li",
        serialize: function() {
            var context = this.model.toJSON();
            context.urlPrefix = this.urlPrefix;
            return context;
        },
        template: itemTemplate
    });
    return ItemView;
});
