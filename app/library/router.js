define(["app", "backbone", "library/models/ItemModel", "library/collections/ItemCollection", "places/collections/POICollection", "library/views/SearchView", "library/views/ItemView", "backbone.subroute"],
    function(app, Backbone, Item, Items, POIs, SearchView, ItemView){


    var items = new Items();
    var LibraryRouter = Backbone.SubRoute.extend({

        // All of your Backbone Routes (add more)
        routes: {

            "": "search",
            "item/:id": "detail"
        },

        search: function(params) {
            params = params || {};
            items.query = params;
            items.geoFetch();
            app.showView(new SearchView({
                collection: items
            }));
        },

        showDetail: function(item) {
            var layout = app.getLayout('MapBrowseLayout');
            var itemView =  new ItemView({
                model: item
            });
            layout.setView('.content-browse', itemView);
            layout.getView('.content-map').setCollection(item.getPOIs());
            itemView.render();
        },

        detail: function(id) {
            var item = items.get(id);
            if (!item) {
                item = new Item({id: id});
            }
            item.fetch({success: _.bind(function(model, response, options) {
                this.showDetail(model);
            }, this) });
        }
    });

    // Returns the Router class
    return LibraryRouter;

});
