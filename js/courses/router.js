define(["jquery","backbone","courses/models/CourseModel", "courses/views/SearchView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection"], 
	function($, Backbone, POI, SearchView, CoursesView, CourseView, Courses){

    var CoursesRouter = Backbone.Router.extend({

        routes: {
            "courses/search": "search",
			"courses/:query": "courses",
			"course/:id": "course",
        },

        search: function(params) {
            results = new Courses();
            searchView = new SearchView({
				collection: results,
                params: params
            });
            searchView.render();
        },
		
		courses: function(query, params) {
			coursesView = new CoursesView({
				params: params,
				query: query,
			});
			coursesView.render();
		},
		
		course: function(id, params) {
			courseView = new CourseView({
				params: params,
				id: id,
			});
			courseView.render();
		},
   
	});
	
    return CoursesRouter;
});
