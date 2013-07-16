define(['backbone', 'underscore', 'hbs!today/templates/index'], function(Backbone, _, indexTemplate){
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
            try {
                view.render();
            } catch(err) {
                // we should do some logging here
                // but we should be able to distinguish "normal" errors
                // (e.g. "no events today") and "real" errors...
            }
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
        manage: true,
        template: indexTemplate,
        cleanup: function() {
            this.collection.off('change');
        }
    });
    return IndexView;
});
