define(['backbone', 'underscore', 'app', 'cordova.help', 'hbs!today/templates/index', 'hbs!today/templates/help/mox-welcome', 'hbs!today/templates/help/today-welcome'], function(Backbone, _, app, cordova, indexTemplate, helpMox, helpToday){
    var IndexView = Backbone.View.extend({
        // This view handles the "cards" on the home screen
        // Cards are views with models in this.collection
        //
        initialize: function() {
            this.collection.on('sync', function(model) {
                this.insertViewOnce(model);
            }, this);
        },
        insertViewOnce: function(model) {
            var view = this.getView(function(view) {
                return view.model === model;
            });
            if (view) { return; } // We have already inserted this view
            view = new model.View({model: model});
            this.insertView('.card-container', view);
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
            if (!cordova.isOnline()) {
                cordova.whenOnline(_.bind(this.render, this));
                cordova.whenOnline(_.bind(this.collection.fetch, this.collection));
            }
            // Used for rendering the cards we have already loaded
            // If the model has some attributes then insert the view.
            this.collection.each(function(model) {
                if (!_.isEmpty(model.attributes) && !model.has('midFetch')) {
                    this.insertView('.card-container', new model.View({model: model}));
                }
            }, this);
            Backbone.trigger('domchange:title', "Today");
        },

        // Messages are listed in the order we want them to appear
        helpMessages: [
            {key: "mox-welcome", template: helpMox},
            {key: "today-welcome", template: helpToday},
        ],
        getHelpMessage: function() {
            var helpContext = {
                cordova: cordova.isCordova(),
                iOS: ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))),
                android: navigator.userAgent.match(/Android/i),
            };
            var helpMessage = _.find(this.helpMessages, function(helpMessage) {
                return !app.helpMessages.getSeen(helpMessage.key);
            });
            if (helpMessage) {
                helpMessage.context = helpContext;
                return helpMessage;
            }
        },

        afterRender: function() {
            if (cordova.isCordova()) {
                cordova.onAppReady(function() {
                    // Cordova is initialized
                    if ('splashscreen' in navigator) {
                        // Remove the splashscreen
                        // Note: this is safe to call even if the splashscreen has already been removed
                        setTimeout(navigator.splashscreen.hide, 400);
                    }
                });
            }
            var helpMessage = this.getHelpMessage();
            if (helpMessage) {
                this.$('.help-container').html(helpMessage.template(helpMessage.context));
                app.helpMessages.setSeen(helpMessage.key);
            }
        },
        manage: true,
        template: indexTemplate,
        serialize: function() {
            var context = {
                connectionAvailable: cordova.isOnline(),
            };
            return context;
        },
        cleanup: function() {
            this.collection.off('sync');
        }
    });
    return IndexView;
});
