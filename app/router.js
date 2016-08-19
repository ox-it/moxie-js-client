define(["app/app", "app/cordova.help", "backbone", "app/places/router", "app/today/views/IndexView", "app/today/collections/TodayItems", "app/courses/router", "app/library/router", "app/contacts/router", "app/news/router", "app/events/router", "app/feedback/router", "app/notifications/router", "app/favourites/views/FavouritesEditButtonView", "app/favourites/views/FavouritesView", "app/today/views/EditTodayButton", "app/today/views/SaveTodayButton", "app/today/views/EditTodayView", "app/security/router", "app/student-advice-service/views/StaticView", "app/learning-resources/views/StaticView", "app/privacy/views/PrivacyView"],
    function(app, cordova, Backbone, PlacesRouter, IndexView, TodayItems, CoursesRouter, LibraryRouter, ContactsRouter, NewsRouter, EventsRouter, FeedbackRouter, NotificationsRouter, FavouritesEditButtonView, FavouritesView, EditTodayButton, SaveTodayButton, EditTodayView, SecurityRouter, StudentAdviceView, LearningResourcesView, PrivacyView){
    var MoxieRouter = Backbone.Router.extend({
        subrouters: {},

        initialize: function(options) {
            // Pass favourites to the TodayItems to personalise the Today View
            // from the user Favourites. First arg here is empty array of models
            this.today = new TodayItems([], {favourites: app.favourites, settings: app.todaySettings});
        },

        routes: {
            "": "index",
            "today/edit": "editTodayView",
            "favourites/": "manageFavourites",

            "places/*subroute": "placesModule",
            "courses/*subroute": "coursesModule",
            "library/*subroute": "libraryModule",
            "contacts/*subroute": "contacts",
            "news/*subroute": "news",
            "events/*subroute": "events",
            "security/*subroute": "security",
            "feedback/*subroute": "feedback",
            "notifications/*subroute": "notifications",
            "student-advice-service/": "studentAdvice",
            "learning-resources/": "learningResources",
            "privacy/": "privacy"
        },

        index: function() {
            if (cordova.isOnline()) {
                this.today.fetch();
            }
            var editTodayButton = new EditTodayButton();
            app.renderView(new IndexView({collection: this.today}), {menu: true, contextButtonView: editTodayButton});
        },

        editTodayView: function(params) {
            var saveTodayButton = new SaveTodayButton();
            var editTodayView = new EditTodayView({collection: this.today, button: saveTodayButton});
            app.renderView(editTodayView, {menu: true, contextButtonView: saveTodayButton});
        },

        manageFavourites: function(params) {
            var favouritesEditButtonView = new FavouritesEditButtonView({disabled: app.favourites.isEmpty()});
            var favouritesView = new FavouritesView({collection: app.favourites, button: favouritesEditButtonView});
            app.renderView(favouritesView, {menu: true, contextButtonView: favouritesEditButtonView});
        },

        contacts: function(params) {
            if (!this.subrouters.Contacts) {
                this.subrouters.Contacts = new ContactsRouter('contacts', {createTrailingSlashRoutes: true});
            }
        },
        news: function(params) {
            if (!this.subrouters.News) {
                this.subrouters.News = new NewsRouter('news', {createTrailingSlashRoutes: true});
            }
        },
        events: function(params) {
            if (!this.subrouters.Events) {
                this.subrouters.Events = new EventsRouter('events', {createTrailingSlashRoutes: true});
            }
        },
        security: function(params) {
            if (!this.subrouters.Security) {
                this.subrouters.Security = new SecurityRouter('security', {createTrailingSlashRoutes: true});
            }
        },
        feedback: function(params) {
            if (!this.subrouters.Feedback) {
                this.subrouters.Feedback = new FeedbackRouter('feedback', {createTrailingSlashRoutes: true});
            }
        },
        notifications: function(params) {
            if (!this.subrouters.Notifications) {
                this.subrouters.Notifications = new NotificationsRouter('notifications', {createTrailingSlashRoutes: true});
            }
        },
        placesModule: function(subroute) {
            if (!this.subrouters.Places) {
                this.subrouters.Places = new PlacesRouter('places', {createTrailingSlashRoutes: true});
            }
        },
        coursesModule: function(subroute) {
            if (!this.subrouters.Courses) {
                this.subrouters.Courses = new CoursesRouter('courses', {createTrailingSlashRoutes: true});
            }
        },
        libraryModule: function(subroute) {
            if (!this.subrouters.Library) {
                this.subrouters.Library = new LibraryRouter('library', {createTrailingSlashRoutes: true});
            }
        },
        studentAdvice: function(params) {
            app.renderView(new StudentAdviceView(), {menu: true});
        },
        learningResources: function(params) {
            app.renderView(new LearningResourcesView(), {menu: true});
        },
        privacy: function(params) {
            app.renderView(new PrivacyView(), {menu: false});
        }


    });
    return MoxieRouter;
});
