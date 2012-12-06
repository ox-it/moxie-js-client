define(["backbone", "courses/views/SearchView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "backbone.subroute"], 
 function(Backbone, SearchView, BookingsView, CoursesView, CourseView, Courses){
    var CoursesRouter = Backbone.SubRoute.extend({

        routes: {
            "": "search",
            "bookings": "bookings",
            "detail/:id": "course",
            ":query": "courses"
        },

        search: function(params) {
            $('#content').html(new SearchView({
                collection: new Courses(),
                params: params
            }).render().el );
        },

        bookings: function(params) {
            $('#content').html(new BookingsView({
                params: params
            }).render().el );
        },

        courses: function(query, params) {
            $('#content').html(new CoursesView({
                params: params,
                query: query
            }).render().el );
        },

        course: function(id, params) {
            $('#content').html(new CourseView({
                params: params,
                id: id
            }).render().el );
        }

    });

    return CoursesRouter;
});
