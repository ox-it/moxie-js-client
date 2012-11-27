define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/courses/index', 'leaflet', 'moxie.conf'], function($, Backbone, _, indexTemplate, L, MoxieConf){
    var SearchView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            //this.render();
            $.ajax({
                url: MoxieConf.urlFor('courses_subjects'),
                dataType: 'json'
            }).success(this.renderSubjectsList);
        },

        // Event Handlers
        events: {
            'keypress :input': "searchEvent",
        },
		
		searchEvent: function(ev) {
            if (ev.which) {
                this.search(ev.target.value);
            }
		},
		
		search: function(query) {
			this.goTo('/courses/' + query);
		},

        render: function() {
            // render basic view
            //$("#content").html(Handlebars.templates.base());
        },

        renderSubjectsList: function(data) {
			console.log(data);
            $('#list').html(indexTemplate(data));
        }
    });
    return SearchView;
});
