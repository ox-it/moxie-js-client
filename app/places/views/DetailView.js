define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'core/views/ErrorView',
        'hbs!places/templates/detail'],
    function($, Backbone, _, conf, ErrorView, detailTemplate){
    var RTI_REFRESH = 15000;    // 15 seconds
    var DetailView = Backbone.View.extend({

        initialize: function() {
            Backbone.on('favourited', this.favourited, this);
            this.model.on('sync', this.render, this);
            this.model.on('error', this.renderError, this);
        },
        attributes: {
            'class': 'detail-map'
        },

        renderError: function(model, response) {
            // Error fetching from the API, render a nice error message.
            var message;
            if (response.status === 404) {
                // Set a specific message for 404's
                message = "Could not find resource: " + model.id;
            } else {
                message = "Error fetching resource: " + model.id;
            }
            var errorView = new ErrorView({
                message: message,
                el: this.el
            });
            errorView.render();
        },

        serialize: function() {
            var poi = this.model.toJSON();
            var currentlyOpen = null;
            var parsedOpeningHours = null;
            if (poi.opening_hours) {
                try {
                    parsedOpeningHours = TimeDomain.evaluateInTime(poi.opening_hours);
                    currentlyOpen = parsedOpeningHours.value;
                } catch(err) {
                    parsedOpeningHours = null;
                    currentlyOpen = null;
                }
            }

            //create array of parents
            var containedBy = [];
            if(poi._links && poi._links.parent) {
                //if it's a single value, add to the empty, otherwise, just use the array.
                if(!$.isArray(poi._links.parent)) {
                    containedBy.push(poi._links.parent);
                }
                else {
                    containedBy = poi._links.parent;
                }

            }

            return {
                poi: poi,
                multiRTI: poi.RTI.length > 1,
                alternateRTI: this.model.getAlternateRTI(),
                currentRTI: this.model.getCurrentRTI(),
                currentlyOpen: currentlyOpen,
                parsedOpeningHours: parsedOpeningHours,
                containedBy: containedBy
            };
        },
        template: detailTemplate,
        manage: true,

        beforeRender: function() {
            if (this.model.get('name')) {
                Backbone.trigger('domchange:title', this.model.get('name'));
            } else if (this.model.get('type_name')) {
                Backbone.trigger('domchange:title', this.model.get('type_name'));
            }
        },

        afterRender: function() {
            if (this.model.get('RTI').length > 0) {
                this.refreshID = this.model.renderRTI(this.$('#poi-rti')[0], RTI_REFRESH);
            }
        },

        favourited: function(fav) {
            fav.set('options', {model: this.model.toJSON()});
            fav.set('type', 'poi:'+this.model.get('type'));
            fav.save();
        },

        cleanup: function() {
            Backbone.off('favourited');
            clearInterval(this.refreshID);
        }

    });
    return DetailView;
});
