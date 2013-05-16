define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/subjects', 'leaflet', 'moxie.conf'], function($, Backbone, _, subjectsTemplate, L, MoxieConf){
    var SubjectsView = Backbone.View.extend({

        initialize: function() {
            this.collection.on('reset', this.render, this);
        },
        manage: true,
        template: subjectsTemplate,

        attributes: {
            'class': 'generic'
        },

        // Event Handlers
        events: {
            'keypress #coursesSearch': "searchEventCourses",
            'click .deleteicon': "clearSearch"
        },

        clearSearch: function(e) {
            this.$('.search-input input').val('').focus();
        },

        serialize: function() {
            return {
                subjects: this.collection.toJSON(),
                ongoingFetch: this.collection.ongoingFetch
            };
        },

        searchEventCourses: function(ev) {
            // 13 is Enter
            if (ev.which === 13) {
                Backbone.history.navigate('/courses/' + ev.target.value, true);
            }
        },

        beforeRender: function() {
            Backbone.trigger('domchange:title', "Courses");
        },

        cleanup: function() {
            this.collection.off('reset', this.render, this);
        }

    });
    return SubjectsView;
});
