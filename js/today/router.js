define(["jquery","backbone", "today/views/IndexView",], function($, Backbone, IndexView){

    var TodayRouter = Backbone.Router.extend({

        routes: {
            "": "index",
        },

        index: function(params) {
            indexView = new IndexView({params: params});
            indexView.render();
        },
    });

    return TodayRouter;
});
