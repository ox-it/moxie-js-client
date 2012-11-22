define(["jquery","backbone","courses/models/CourseModel", "courses/views/SearchView", "courses/views/CoursesView", "courses/collections/CourseCollection"], 
	function($, Backbone, POI, SearchView, CoursesView, Courses){

    var CoursesRouter = Backbone.Router.extend({

        routes: {
            "courses/search": "search",
			"courses/:query": "courses",
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
   
	});
	
    return CoursesRouter;
});
