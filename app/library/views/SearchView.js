define(['jquery', 'backbone', 'underscore', 'hbs!library/templates/search'],
    function($, Backbone, _, searchTemplate){
        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
            },

            // Event Handlers
            events: {
                'keypress #library-search-form': "searchEventItems"
            },

            attributes: {
                'class': 'generic'
            },

            searchEventItems: function(ev) {
                // 13 is Enter
                if (ev.which === 13) {
                    this.search(ev.target.value);
                }
            },

            search: function(query) {
                alert("TODO!");
            },

            render: function() {
                this.$el.html(searchTemplate({title: '', author: '', isbn: ''}));
            }
        });
        return SearchView;
    });
