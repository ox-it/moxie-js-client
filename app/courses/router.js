define(["app", "backbone", "courses/views/SearchView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "backbone.subroute"], 
 function(app, Backbone, SearchView, BookingsView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({

        routes: {
            "": "search",
            "bookings": "bookings",
            "detail/:id": "course",
            ":query": "courses"
        },

        search: function(params) {
            app.showView(new SearchView({
                collection: new Courses(),
                params: params
            }));
        },

        bookings: function(params) {
            app.showView(new BookingsView({
                params: params
            }));
        },

        courses: function(query, params) {
            app.showView(new CoursesView({
                params: params,
                query: query
            }));
        },

        course: function(id, params) {
            app.showView(new CourseView({
                params: params,
                id: id
            }));
        }

    });

    return CoursesRouter;
});
