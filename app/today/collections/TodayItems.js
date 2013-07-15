define(['underscore', 'core/collections/MoxieCollection', 'today/models/OxfordDate', 'today/models/Weather', 'today/models/Webcam', 'today/models/RiverStatus', 'today/models/NearbyRTI', 'today/models/FavouriteRTI', 'today/models/ParkAndRide'], function(_, MoxieCollection, OxfordDate, Weather, Webcam, RiverStatus, NearbyRTI, FavRTI, ParkAndRide) {
    var TodayItems = MoxieCollection.extend({
        initialize: function(models, options) {
            this.favourites = options.favourites;
            this.favouritesUpdated = false;
            this.favourites.on('change add remove', _.bind(function() {
                this.favouritesUpdated = true;
            }, this));
        },
        fetch: function() {
            // If we have already loaded the Cards and the favourites haven't updated
            // we don't need to load them again.
            if (this.length===0 || this.favouritesUpdated) {
                this.favouritesUpdated = false;
                var models = [
                    new OxfordDate(),
                    new Weather(),
                    new RiverStatus(),
                    new Webcam(),
                    new NearbyRTI(),
                    new ParkAndRide()
                ];
                this.favourites.each(function(fav) {
                    var attrs = fav.attributes;
                    if ('options' in attrs && 'model' in attrs.options && 'RTI' in attrs.options.model) {
                        // Find a user Favourite which has an RTI attribute
                        var favRTI = new FavRTI(attrs.options.model);
                        if (fav.has('userTitle')) {
                            favRTI.set('userTitle', fav.get('userTitle'));
                        }
                        models.push(favRTI);
                    }
                }, this);
                this.reset(models);
                this.each(function(model) {
                    model.fetch();
                });
            }
        }
    });
    return TodayItems;
});
