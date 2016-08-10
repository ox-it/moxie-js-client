define(['jquery', 'backbone', 'underscore', 'app/app', 'app/cordova.help', 'app/contacts/views/ResultItemView', 'hbs!app/contacts/templates/search'],
    function($, Backbone, _, app, cordova, ResultItemView, searchTemplate){
        var CONTACTS_SAVE_HELP = 'contacts-save-help';
        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
                this.collection.on("reset", this.render, this);
            },

            // Event Handlers
            events: {
                'click #submit-search-email': "searchEmail",
                'click #submit-search-phone': "searchPhone"
            },

            attributes: {
                'class': 'generic'
            },

            searchEmail: function(ev) {
                this.prepareSearch('email');
            },

            searchPhone: function(ev) {
                this.prepareSearch('phone');
            },

            prepareSearch: function(medium) {
                var query = $("#input-query").val();
                if (query) {
                    this.$('#loading').show();
                    this.collection.query.medium = medium;
                    if (query || this.collection.query.q) { this.collection.query.q = query; }
                    this.collection.fetch();
                    Backbone.history.navigate('/contacts/search?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false, replace: false});
                }
            },

            serialize: function() {
                var has_results;
                if (this.collection.length === 0) {
                    has_results = false;
                } else {
                    has_results = true;
                }
                var showHelpNative = false;
                var showHelpDataUri = false;
                if (has_results && cordova.isCordova()) {
                    showHelpNative = !app.helpMessages.getSeen(CONTACTS_SAVE_HELP);
                    if (showHelpNative) {
                        app.helpMessages.setSeen(CONTACTS_SAVE_HELP);
                    }
                } else if (has_results && !cordova.isCordova()) {
                    showHelpDataUri = !app.helpMessages.getSeen(CONTACTS_SAVE_HELP);
                    if (showHelpDataUri) {
                        app.helpMessages.setSeen(CONTACTS_SAVE_HELP);
                    }
                }
                return {
                    query: this.collection.query.q,
                    showHelpNative: showHelpNative,
                    showHelpDataUri: showHelpDataUri,
                    has_results: has_results
                };
            },

            id: 'contact-search',
            template: searchTemplate,
            manage: true,

            beforeRender: function() {
                if (this.collection.length) {
                    var views = [];
                    this.collection.each(function(model) { views.push(new ResultItemView({model: model})); });
                    this.insertViews({"#search-results": views});
                }
                if (!_.isEmpty(this.collection.query)) {
                    var page_title = "Contacts search: ";
                    page_title += this.collection.query.q;
                    Backbone.trigger("domchange:title", page_title);
                } else {
                    Backbone.trigger("domchange:title", "Contacts search");
                }
            },

            afterRender: function() {
                this.$('#loading').hide();
                if (this.collection.length) {
                    this.$('#main-contacts').hide();
                }
            }

        });
        return SearchView;
    });
