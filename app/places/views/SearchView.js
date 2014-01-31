define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'places/views/ItemView', 'hbs!places/templates/search', 'core/views/InfiniteScrollView'],
    function($, Backbone, _, MoxieConf, ItemView, searchTemplate, InfiniteScrollView){

    var SearchView = InfiniteScrollView.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.urlPrefix = this.options.urlPrefix;
            this.collection.followUser();
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.addResult, this);
        },

        manage: true,

        // Event Handlers
        events: {
            'keypress :input': "searchEvent",
            'click .deleteicon': "clearSearch",
            'click .facet-list > li[data-category]': "clickFacet"
        },

        clearSearch: function(e) {
            this.$('.search-input input').val('').focus();
        },

        clickFacet: function(e) {
            e.preventDefault();
            this.collection.query.type = $(e.target).data('category');
            this.collection.geoFetch();
            Backbone.history.navigate(this.urlPrefix + 'search?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false});
        },

        searchEvent: function(ev) {
            if (ev.which === 13) {
                this.collection.query.q = ev.target.value;
                this.collection.geoFetch();
                Backbone.history.navigate(this.urlPrefix + 'search?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false});
            }
        },

        addResult: function(model) {
            var view = new ItemView({model: model});
            this.insertView("ul.results-list", view);
            view.render();
        },

        template: searchTemplate,
        serialize: function() {
            var context = {
                urlPrefix: this.urlPrefix,
                query: this.collection.query,
                facets: [],
                hasResults: Boolean(this.collection.length),
                midRequest: this.collection.ongoingFetch
            };
            if (this.collection.facets && (this.collection.query.q || this.collection.query.type) && this.collection.facets.length > 1) {
                context.facets = this.collection.facets;
            }
            return context;
        },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Search for Places of Interest");
            if (this.collection.length) {
                var urlPrefix = this.urlPrefix;
                var views = [];
                this.collection.each(function(model) {
                    views.push(new ItemView({model: model, urlPrefix: urlPrefix}));
                });
                this.insertViews({"ul.results-list": views});
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

        cleanup: function() {
            this.collection.unfollowUser();
            InfiniteScrollView.prototype.onClose.apply(this);
        }
    });

    // Returns the View class
    return SearchView;
});
