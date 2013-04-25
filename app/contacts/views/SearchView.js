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
                this.$('#loading').show();
                this.collection.query.medium = medium;
                var query = $("#input-query").val();
                if (query || this.collection.query.q) { this.collection.query.q = query; }
                this.collection.fetch();
                Backbone.history.navigate('/contacts/search?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false, replace: false});
            },

            serialize: function() {
                return this.collection.query;
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
