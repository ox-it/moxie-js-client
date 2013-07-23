define(['jquery', 'backbone', 'underscore', 'moxie.conf'],
    function($, Backbone, _, conf) {
        var standardClass = 'ss-standard',
            editClass = 'ss-write',
            saveClass = 'ss-check';
        var FavouritesEditButtonView = Backbone.View.extend({
            events: {'click': 'toggleEdit'},
            manage: true,
            tagName: 'a',
            attributes: {
                'class': [standardClass, editClass].join(' ')
            },
            editing: false,
            toggleEdit: function(e) {
                e.preventDefault();
                var editing = !this.editing;
                this.$el.toggleClass(editClass, !editing);
                this.$el.toggleClass(saveClass, editing);
                this.trigger('toggleEdit', editing);
                this.editing = editing;
                return false;
            }
        });
        FavouritesEditButtonView.extend(Backbone.Events);
        return FavouritesEditButtonView;
    }
);
