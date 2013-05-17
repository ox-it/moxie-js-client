define(["app", "underscore", "backbone", "moxie.conf", "core/models/UserModel", "courses/views/SubjectsView", "courses/views/BookingsView", "courses/views/CoursesView", "courses/views/CourseView", "courses/collections/CourseCollection", "courses/collections/SubjectCollection", "backbone.subroute"],
 function(app, _, Backbone, conf, User, SubjectsView, BookingsView, CoursesView, CourseView, Courses, Subjects){
    var CoursesRouter = Backbone.SubRoute.extend({
        courses: new Courses(),
        subjects: new Subjects(),
        user: new User({
            oAuthVerificationURL: conf.urlFor('courses_auth_verify'),
            oAuthAuthorizedURL: conf.urlFor('courses_auth_authorized'),
        }),

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
            if (this.courses.query!==query || this.courses.length===0) {
                // If the query is different or we have no preexisting results
                this.courses.query = query;
                this.courses.reset();
                this.courses.fetch();
            }
            app.showView(new CoursesView({
                collection: this.courses,
            }));
        },

        showDetail: function(course, params) {
            app.showView(new CourseView({
                model: course,
                params: params,
                user: this.user,
            }));
        },

        courseDetail: function(id, params) {
            var course = this.courses.get(id);
            if (course) {
                this.showDetail(course, params);
            } else {
                course = new this.courses.model({id: id});
                course.fetch({success: _.bind(function(model, response, options) {
                    this.showDetail(model, params);
                }, this) });
            }
        }

    });

    return CoursesRouter;
});
