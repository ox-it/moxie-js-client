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
            var libraries = [];
            var organisations = [];
            var alsoOccupies = []
            var occupiedBy = [];
            var contains = [];

            if (poi._links) {
                for (var i in poi._links.child) {
                    var child = poi._links.child[i];
                    if (child.type) {
                        switch (child.type[0]) {
                            // example for specific relations
                            case '/university/library':
                                libraries.push(child);
                                break;
                            case '/university/building':
                                alsoOccupies.push(child);
                                break;
                            case '/university/room':
                                alsoOccupies.push(child);
                                break;
                            case '/university/department':
                                organisations.push(child);
                                break;
                            case '/university/college':
                                organisations.push(child);
                                break;
                            default:
                                contains.push(child);
                                break;
                        }
                    }
                }
                if (poi._links.parent) {
                    var parent = poi._links.parent;
                    var parent_name = null;
                    if (parent.type) {
                        switch (parent.type[0]) {
                            case '/university/library':
                                parent_name = 'See library';
                                break;
                            default:
                                parent_name = 'Parent ' + parent.type_name[0].toLowerCase();
                        }
                    } else {
                        parent = null;
                    }
                } else {
                    var parent = null;
                    var parent_name = null;
                }
            }

            return {
                poi: poi,
                multiRTI: poi.RTI.length > 1,
                alternateRTI: this.model.getAlternateRTI(),
                currentRTI: this.model.getCurrentRTI(),
                currentlyOpen: currentlyOpen,
                parsedOpeningHours: parsedOpeningHours,
                libraries: libraries,
                organisations: organisations,
                alsoOccupies: alsoOccupies,
                contains: contains,
                parent: parent,
                parent_name: parent_name
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
