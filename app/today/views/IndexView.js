define(['jquery', 'backbone', 'underscore', 'masonry', 'hbs!today/templates/index'], function($, Backbone, _, masonry, indexTemplate){
    var IndexView = Backbone.View.extend({
        // This view handles the "cards" on the home screen
        // Cards are views with models in this.collection
        //
        initialize: function() {
            this.collection.on('change', function(model) {
                this.insertViewOnce(model);
            }, this);
        },
        insertViewOnce: function(model) {
            var view = this.getView(function(view) {
                return view.model === model;
            });
            if (view) { return; } // We have already inserted this view
            view = new model.View({model: model});
            this.insertView('.today-card-container', view);
            view.render();
            //$('.today-card-container').masonry('reload');
            return view;
        },
        beforeRender: function() {
            // Used for rendering the cards we have already loaded
            // If the model has some attributes then insert the view.
            this.collection.each(function(model) {
                if (!_.isEmpty(model.attributes)) {
                    this.insertView('.today-card-container', new model.View({model: model}));
                }
            }, this);
        },
        afterRender: function() {
            $('.today-card-container').masonry({
                itemSelector : '.today',
                columnWidth : 5,
                isAnimated: true,
                  animationOptions: {
                    duration: 250,
                    easing: 'linear',
                    queue: false
                  }
            });
        },
        manage: true,
        template: indexTemplate,
        cleanup: function() {
            this.collection.off('change');
        }
    });
    return IndexView;
});
