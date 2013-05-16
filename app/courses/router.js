define(["app", "underscore", "backbone", "courses/views/SubjectsView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "courses/collections/SubjectCollection", "backbone.subroute"],
 function(app, _, Backbone, SubjectsView, BookingsView, CoursesView, CourseView, Courses, Subjects){
    var CoursesRouter = Backbone.SubRoute.extend({
        courses: new Courses(),
        subjects: new Subjects(),

        routes: {
            "": "browseSubject",
            "bookings": "myBookings",
            ":query": "searchCourses",
            "detail/:id": "courseDetail"
        },

        browseSubject: function() {
            this.subjects.fetch();
            app.renderView(new SubjectsView({
                collection: this.subjects,
            }), {menu: true});
        },

        myBookings: function(params) {
            app.showView(new BookingsView({
                params: params
            }));
        },

        searchCourses: function(query) {
            this.courses.fetch(query);
            app.showView(new CoursesView({
                collection: this.courses,
            }));
        },

        courseDetail: function(id, params) {
            app.showView(new CourseView({
                params: params,
                id: id
            }));
        }

    });

    return CoursesRouter;
});
