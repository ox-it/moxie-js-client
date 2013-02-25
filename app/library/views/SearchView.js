define(['jquery', 'backbone', 'underscore', 'core/views/InfiniteScrollView', 'hbs!library/templates/search', 'hbs!library/templates/results', 'moxie.conf'],
    function($, Backbone, _, InfiniteScrollView, searchTemplate, resultsTemplate, MoxieConf){
        var SearchView = InfiniteScrollView.extend({

            initialize: function() {
                _.bindAll(this);
                this.collection.on("reset", this.resetResults, this);
                this.collection.on("add", this.addResult, this);
            },

            // Event Handlers
            events: {
                'keypress #library-search-form': "searchEventFields",
                'click #submit-search': "searchEventClick"
            },

            attributes: {
                'class': 'generic free-text'
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
                var title = $("#input-title").val();
                var author = $("#input-author").val();
                var isbn = $("#input-isbn").val();
                var kv = [];
                if(title !== "") {
                    kv.push("title=" + title);
                }
                if(author !== "") {
                    kv.push("author=" + author);
                }
                if(isbn !== "") {
                    kv.push("isbn=" + isbn);
                }
                Backbone.history.navigate('/library/?' + kv.join("&"), true);
            },

            render: function() {
                var title = "";
                var author = "";
                var isbn = "";
                if(this.options.params && this.options.params.title) {
                    title = this.options.params.title;
                }
                if(this.options.params && this.options.params.author) {
                    author = this.options.params.author;
                }
                if(this.options.params && this.options.params.isbn) {
                    isbn = this.options.params.isbn;
                }
                this.$el.html(searchTemplate({title: title, author: author, isbn: isbn}));

                this.$("#loading").hide();

                // if at least one field is not empty, do a search
                if(title !== "" || author !== "" || isbn !== "") {
                    this.search(title, author, isbn);
                    Backbone.trigger("domchange:title", "Library search " + title + " " + author + " " + isbn);
                } else {
                    Backbone.trigger("domchange:title", "Library search");
                }

                var options = {windowScroll: true, scrollElement: this.$('.results-list')[0], scrollThreshold: 0.7};
                InfiniteScrollView.prototype.initScroll.apply(this, [options]);
            },

            search: function(title, author, isbn) {
                var query = "?title=" + title + "&author=" + author + "&isbn=" + isbn;
                this.$("#loading").show();
                $.ajax({
                    url: MoxieConf.urlFor('library_search') + query,
                    dataType: 'json'
                }).success(this.createItems)
                    .error(this.onError);
                return this;
            },

            scrollCallbacks: [function() {
                $.ajax({
                    url: MoxieConf.endpoint + this.next_results.href,
                    dataType: 'json'
                }).success(this.extendResults);
            }],

            createItems: function(data) {
                // Called when we want to empty the existing collection
                // For example when a search is issued and we clear the existing results.
                this.collection.reset(data._embedded.items);
                this.next_results = data._links['hl:next'];
                this.$("#loading").hide();
            },

            addResult: function(item) {
                // Append an individual result to the existing results-list
                var context = {
                    results: [item]
                };
                this.$(".results-list").append(resultsTemplate(context));
            },

            extendResults: function(data) {
                // Used when the collection is extended through infinite scrolling
                this.next_results = data._links['hl:next'];
                this.infiniteScrollEnabled = Boolean(this.next_results);
                this.collection.add(data._embedded.items);
            },

            resetResults: function(collection) {
                this.render_results();
            },

            render_results: function(back_button) {
                var context = {
                    results: this.collection.toArray()
                };
                this.$(".results-list").html(resultsTemplate(context));
            },

            onError: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },

            onClose: function() {
                InfiniteScrollView.prototype.onClose.apply(this);
            }
        });
        return SearchView;
    });
