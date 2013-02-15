define(["backbone"],

    function(Backbone) {
        var Favourite = Backbone.Model.extend({
            initialize: function() {
                this.bind('remove', function() {
                    this.destroy();
                });
            }
        });
        return Favourite;
    }

);
