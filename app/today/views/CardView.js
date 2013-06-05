define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {
    var CardView = Backbone.View.extend({
        // Base CardView
        //
        // This contains the logic for ordering cards on the Today view
        // Cards are ordered based on a ``weight`` attribute in each view.
        // Higher ``weight`` values place cards higher on the page.
        weight: 10,
        manage: true,
        insert: function(root, card) {
            // This is called by LayoutManager when we call ``insertView``
            //
            // ``root`` is the container and ``card`` is the card element.
            // We iterate through all cards currently rendered and place the
            // card into the correct possition. This is done by trying to
            // find a card with a weight lower than the one we're trying to
            // render and placing ours before it. If no such card can be found
            // we simply append the card to the end of the container.
            $(card).data('weight', this.weight);
            var $root = $(root);
            var insertBefore = _.find($root.children(), function(child) {
                return this.weight > parseInt($(child).data('weight'), 10);
            }, this);
            if (insertBefore) {
                $(insertBefore).before(card);
            } else {
                $root.append(card);
            }
        },
    });
    return CardView;
});
