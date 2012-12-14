define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/search', 'leaflet', 'moxie.conf'],
    function($, Backbone, _, searchTemplate, L, MoxieConf){
        var SearchView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
            },

            // Event Handlers
            events: {
                'keypress #coursesSearch': "searchEventCourses"
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
                $.ajax({
                    url: MoxieConf.urlFor('courses_subjects'),
                    dataType: 'json'
                }).success(this.renderSubjectsList);
                return this;
            },

            renderSubjectsList: function(data) {
                var context = {subjects: data._links['courses:subject']};
                this.$el.html(searchTemplate(context));
            }
        });
        return SearchView;
    });
