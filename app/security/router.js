define(["app", "moxie.conf", "underscore", "backbone", "security/views/StaticView",
    "hbs!security/templates/index", "hbs!security/templates/accommodation", "hbs!security/templates/being_followed",
    "hbs!security/templates/cycle_theft", "hbs!security/templates/out_about", "hbs!security/templates/personal_safety"],
    function(app, conf, _, Backbone, StaticView, indexTemplate, accommodationTemplate, beingFollowedTemplate,
             cycleTheftTemplate, outAboutTemplate, personalSafetyTemplate){

        var SecurityRouter = Backbone.SubRoute.extend({
            routes: {
                '': 'index',
                'personal-safety': 'personal_safety',
                'cycle-theft': 'cycle_theft',
                'out-about': 'out_about',
                'being-followed': 'being_followed',
                'accommodation': 'accommodation'
            },

            index: function() {
                app.renderView(new StaticView({template: indexTemplate}));
            },
            personal_safety: function() {
                app.renderView(new StaticView({template: personalSafetyTemplate}));
            },
            cycle_theft: function() {
                app.renderView(new StaticView({template: cycleTheftTemplate}));
            },
            out_about: function() {
                app.renderView(new StaticView({template: outAboutTemplate}));
            },
            being_followed: function() {
                app.renderView(new StaticView({template: beingFollowedTemplate}));
            },
            accommodation: function() {
                app.renderView(new StaticView({template: accommodationTemplate}));
            }
        });
        return SecurityRouter;
});
