define(['jquery', 'backbone', 'underscore', 'core/views/InfiniteScrollView', 'library/views/ResultItemView', 'hbs!library/templates/search', 'moxie.conf'],
    function($, Backbone, _, InfiniteScrollView, ResultItemView, searchTemplate, MoxieConf){
        var SearchView = InfiniteScrollView.extend({

            initialize: function() {
                _.bindAll(this);
                this.collection.on("reset", this.render, this);
                this.collection.on("add", this.addResult, this);
            },

            // Event Handlers
            events: {
                'keypress #library-search-form': "searchEventFields",
                'click #submit-search': "searchEventClick"
            },

            attributes: {
                'class': 'generic'
            },

            searchEventFields: function(ev) {
                // 13 is Enter
                if (ev.which === 13) {
                    this.prepareSearch();
                }
            },

            searchEventClick: function(ev) {
                this.prepareSearch();
            },

            prepareSearch: function() {
                this.$('#loading').show();
                var title = $("#input-title").val();
                if (title || this.collection.query.title) { this.collection.query.title = title; }
                var author = $("#input-author").val();
                if (author || this.collection.query.author) { this.collection.query.author = author; }
                var isbn = $("#input-isbn").val();
                if (isbn || this.collection.query.isbn) { this.collection.query.isbn = isbn; }
                this.collection.fetch();
                Backbone.history.navigate('/library/?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false, replace: false});
            },

            serialize: function() {
                return {
                    query: this.collection.query,
                    hasResults: Boolean(this.collection.length),
                    midRequest: this.collection.ongoingFetch,
                    emptyQuery: _.isEmpty(this.collection.query)
                };
            },

            id: 'library-search',
            template: searchTemplate,
            manage: true,

            beforeRender: function() {
                if (this.collection.length) {
                    var views = [];
                    this.collection.each(function(model) { views.push(new ResultItemView({model: model})); });
                    this.insertViews({"#search-results": views});
                }
                // if at least one field is not empty, do a search
                if (!_.isEmpty(this.collection.query)) {
                    this.$("#library-info").hide();
                    var page_title = "Library search:";
                    page_title += this.collection.query.title ? " title: "+this.collection.query.title : "";
                    page_title += this.collection.query.author ? " author: "+this.collection.query.author : "";
                    page_title += this.collection.query.isbn ? " isbn: "+this.collection.query.isbn : "";
                    Backbone.trigger("domchange:title", page_title);
                } else {
                    Backbone.trigger("domchange:title", "Library search");
                }
            },

            infiniteScrollConfigured: false,
            afterRender: function() {
                if (!this.infiniteScrollConfigured) {
                    // this.el is no longer the el which scrolls so we need to pass the parentNode
                    var options = {windowScroll: true, scrollElement: this.el.parentNode, scrollThreshold: 1};
                    InfiniteScrollView.prototype.initScroll.apply(this, [options]);
                    this.infiniteScrollConfigured = true;
                }
            },

            scrollCallbacks: [function() {
                this.collection.fetchNextPage();
            }],

            addResult: function(model) {
                var view = new ResultItemView({model: model});
                this.insertView("#search-results", view);
                view.render();
            },

            cleanup: function() {
                this.collection.off(null, null, this);
                InfiniteScrollView.prototype.onClose.apply(this);
            }
        });
        return SearchView;
    });
