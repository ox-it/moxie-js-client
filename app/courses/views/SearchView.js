define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/search', 'leaflet', 'moxie.conf'],
    function($, Backbone, _, baseTemplate, searchTemplate, L, MoxieConf){
        var SearchView = Backbone.View.extend({

            id: 'courseSearch',

            initialize: function() {
                _.bindAll(this);
                $.ajax({
                    url: MoxieConf.urlFor('courses_subjects'),
                    dataType: 'json'
                }).success(this.renderSubjectsList);
            },

            // Event Handlers
            events: {
                'keypress #coursesSearch': "searchEventCourses"
            },

            searchEventCourses: function(ev) {
                // 13 is Enter
                if (ev.which === 13) {
                    this.search(ev.target.value);
                }
            },

            search: function(query) {
                Backbone.history.navigate('/courses/' + query, true);
            },

            render: function() {
                this.$el.html(baseTemplate());
                return this;
            },

            renderSubjectsList: function(data) {
                this.$el.find('#list').html(searchTemplate(data));
            }
        });
        return SearchView;
    });
