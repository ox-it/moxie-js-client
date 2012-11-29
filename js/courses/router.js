define(["backbone", "courses/views/SearchView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection"], function(Backbone, SearchView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({

        routes: {
            "": "search",
            "detail/:id": "course",
            ":query": "courses"
        },

        search: function(params) {
            console.log("Search called");
            results = new Courses();
            searchView = new SearchView({
				collection: results,
                params: params,
				router: this,
            });
            searchView.render();
        },

        courses: function(query, params) {
            console.log("Courses called");
            coursesView = new CoursesView({
                params: params,
                query: query
            });
            coursesView.render();
        },

        course: function(id, params) {
            console.log("Course called");
            courseView = new CourseView({
                params: params,
                id: id
            });
            courseView.render();
        }

    });

    return CoursesRouter;
});
