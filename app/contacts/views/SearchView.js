define(['jquery', 'backbone', 'underscore', 'contacts/views/ResultItemView', 'hbs!contacts/templates/search'],
    function($, Backbone, _, ResultItemView, searchTemplate){
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
                if (this.collection.length == 0) {
                    var has_results = false;
                } else {
                    var has_results = true;
                }
                return {
                    query: this.collection.query.q,
                    has_results: has_results
                }
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
