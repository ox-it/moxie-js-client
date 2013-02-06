define(['jquery', 'backbone', 'underscore', 'hbs!library/templates/search', 'hbs!library/templates/results', 'moxie.conf'],
    function($, Backbone, _, searchTemplate, resultsTemplate, MoxieConf){
        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
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
                var title = $("#input-title").val();
                var author = $("#input-author").val();
                var isbn = $("#input-isbn").val();

                var query = "?";
                if(title != "") {
                    query += "title=" + title;
                }
                if(author != "") {
                    query += "author=" + author;
                }
                if(isbn != "") {
                    query += "isbn=" + isbn;
                }
                Backbone.history.navigate('/library/' + query, true);
            },

            render: function() {
                var title = author = isbn = "";
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
                if(title != "" || author != "" || isbn != "") {
                    this.search(title, author, isbn);
                }
            },

            search: function(title, author, isbn) {
                var query = "?title=" + title + "&author=" + author + "&isbn=" + isbn;
                console.log("QUERY: " + query);
                $.ajax({
                    url: MoxieConf.urlFor('library_search') + query,
                    dataType: 'json'
                }).success(this.renderSearchResults);
                return this;
            },

            renderSearchResults: function(data) {
                console.log(data._embedded);
            }
        });
        return SearchView;
    });
