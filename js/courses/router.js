define(["backbone", "courses/views/SearchView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection"], 
 function(Backbone, SearchView, BookingsView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({

        routes: {
            "": "search",
            "bookings": "bookings",
            "detail/:id": "course",
            ":query": "courses"
        },

        search: function(params) {
            results = new Courses();
            searchView = new SearchView({
				collection: results,
                params: params,
            });
            searchView.render();
        },

        bookings: function(params) {
            bookingsView = new BookingsView({
                params: params,
            });
            bookingsView.render();
        },

        courses: function(query, params) {
            coursesView = new CoursesView({
                params: params,
                query: query
            });
            coursesView.render();
        },

        course: function(id, params) {
            courseView = new CourseView({
                params: params,
                id: id
            });
            courseView.render();
        }

    });

    return CoursesRouter;
});
