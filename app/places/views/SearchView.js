define(['jquery', 'backbone', 'underscore', 'moxie.conf', 'places/views/ItemView', 'places/views/FacetView', 'hbs!places/templates/search', 'core/views/InfiniteScrollView'],
    function($, Backbone, _, MoxieConf, ItemView, FacetView, searchTemplate, InfiniteScrollView){

    var SearchView = InfiniteScrollView.extend({

        // View constructor
        initialize: function() {
            _.bindAll(this);
            this.collection.followUser();
            this.collection.on("reset", this.resetResults, this);
            this.collection.on("add", this.addResult, this);
            this.collection.facets.on("reset", this.resetFacets, this);
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
            Backbone.history.navigate('/places/search?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false});
        },

        searchEvent: function(ev) {
            if (ev.which === 13) {
                this.collection.query.q = ev.target.value;
                this.collection.geoFetch();
                Backbone.history.navigate('/places/search?'+$.param(this.collection.query).replace(/\+/g, "%20"), {trigger: false});
            }
        },

        resetResults: function(collection) {
            var views = [];
            this.$('ul.results-list').empty();
            collection.each(function(model) { views.push(new ItemView({model: model})); });
            this.insertViews({"ul.results-list": views});
            _.each(views, function(view) { view.render(); });
        },

        resetFacets: function(collection) {
            console.log(collection);
            var views = [];
            this.$('ul.facet-list').empty();
            collection.each(function(model) { views.push(new FacetView({model: model})); });
            this.insertViews({"ul.facet-list": views});
            _.each(views, function(view) { view.render(); });
        },

        addResult: function(model) {
            var view = new ItemView({model: model});
            this.insertView("ul.results-list", view);
            view.render();
        },

        template: searchTemplate,
        serialize: function() { return {query: this.collection.query, facets: this.collection.facets}; },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Search for Places of Interest");
            if (this.collection.length) {
                var views = [];
                this.collection.each(function(model) { views.push(new ItemView({model: model})); });
                this.insertViews({"ul.results-list": views});
            }
        },

        afterRender: function() {
            var options = {windowScroll: true, scrollElement: this.el, scrollThreshold: 0.7};
            InfiniteScrollView.prototype.initScroll.apply(this, [options]);
        },

        scrollCallbacks: [function() {
            this.collection.fetchNextPage();
        }],

        extendPOIs: function(data) {
            // Used when the collection is extended through infinite scrolling
            this.next_results = data._links['hl:next'];
            this.infiniteScrollEnabled = Boolean(this.next_results);
            this.collection.facets = data._links['hl:types'];
            this.collection.add(data._embedded);
            this.setMapBounds();
        },

        cleanup: function() {
            this.collection.unfollowUser();
            InfiniteScrollView.prototype.onClose.apply(this);
        }
    });

    // Returns the View class
    return SearchView;
});
