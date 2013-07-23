define(["MoxieModel"],

    function(MoxieModel) {
        var Favourite = MoxieModel.extend({
            initialize: function() {
                this.bind('remove', function() {
                    this.destroy();
                });
            }
        });
        return Favourite;
    }

);
