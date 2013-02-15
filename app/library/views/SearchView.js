define(['jquery', 'backbone', 'underscore', 'hbs!library/templates/search', 'hbs!library/templates/results', 'moxie.conf'],
    function($, Backbone, _, searchTemplate, resultsTemplate, MoxieConf){
        var SearchView = Backbone.View.extend({

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

                // if at least one field is not empty, do a search
                if(title !== "" || author !== "" || isbn !== "") {
                    this.search(title, author, isbn);
                    Backbone.trigger("domchange:title", "Library search " + title + " " + author + " " + isbn);
                } else {
                    Backbone.trigger("domchange:title", "Library search");
                }
            },

            search: function(title, author, isbn) {
                var query = "?title=" + title + "&author=" + author + "&isbn=" + isbn;
                $.ajax({
                    url: MoxieConf.urlFor('library_search') + query,
                    dataType: 'json'
                }).success(this.createItems).error(this.onError);
                return this;
            },

            createItems: function(data) {
                // Called when we want to empty the existing collection
                // For example when a search is issued and we clear the existing results.
                this.collection.reset(data._embedded.items);
            },

            addResult: function(item) {
                // Append an individual result to the existing results-list
                var context = {
                    results: [item]
                };
                this.$(".results-list").append(resultsTemplate(context));
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
            }
        });
        return SearchView;
    });
