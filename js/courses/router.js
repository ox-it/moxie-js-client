define(["jquery","backbone","courses/models/CourseModel", "courses/views/SearchView", "courses/collections/CourseCollection"], function($, Backbone, POI, SearchView, Courses){

    var CoursesRouter = Backbone.Router.extend({

        routes: {
            "courses/search": "search",
        },

        search: function(params) {
            results = new Courses();
            searchView = new SearchView({
				collection: results,
                params: params
            });
            searchView.render();
        },
   
	});
	
    return CoursesRouter;
});
