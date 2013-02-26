define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/base_search', 'hbs!courses/templates/subjects', 'leaflet', 'moxie.conf'],
    function($, Backbone, _, baseTemplate, subjectsTemplate, L, MoxieConf){
        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
            },

            // Event Handlers
            events: {
                'keypress #coursesSearch': "searchEventCourses",
                'click .deleteicon': "clearSearch"
            },

            clearSearch: function(e) {
                this.$('.search-input input').val('').focus();
            },

            attributes: {
                'class': 'generic'
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
                $.ajax({
                    url: MoxieConf.urlFor('courses_subjects'),
                    dataType: 'json'
                }).success(this.renderSubjectsList);
                Backbone.trigger('domchange:title', "Courses");
                return this;
            },

            renderSubjectsList: function(data) {
                this.$("#loading").hide();
                var context = {subjects: data._links['courses:subject']};
                this.$('#results').html(subjectsTemplate(context));
            }
        });
        return SearchView;
    });
