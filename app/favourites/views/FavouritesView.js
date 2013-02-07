define(['jquery', 'backbone', 'underscore', 'favourites/models/Favourite', 'favourites/collections/Favourites'],
    function($, Backbone, _, Favourite, Favourites) {
        var FavouritesView = Backbone.View.extend({
            initialize: function() {
                _.bindAll(this);
            }
        });
        return FavouritesView;
    }
);
