define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/index', 'leaflet', 'moxie.conf'],
 function($, Backbone, _, baseTemplate, indexTemplate, L, MoxieConf){
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
            'keypress #coursesSearch': "searchEventCourses",
        },
		
		searchEventCourses: function(ev) {
			// 13 is Enter
            if (ev.which === 13) {
                this.search(ev.target.value);
            }
		},
		
		search: function(query) {
			this.options.router.navigate('/courses/' + query, true);
		},

        render: function() {
            $("#content").html(baseTemplate());
            this.setElement($('#content'));
			this.delegateEvents(this.events);
        },

        renderSubjectsList: function(data) {
            $('#list').html(indexTemplate(data));
        }
    });
    return SearchView;
});
