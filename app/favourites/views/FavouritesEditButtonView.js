define(['jquery', 'backbone', 'underscore', 'moxie.conf'],
    function($, Backbone, _, conf) {
        var standardClass = 'ss-standard',
            disabledClass = 'ss-writingdisabled',
            editClass = 'ss-write',
            saveClass = 'ss-check';
        var FavouritesEditButtonView = Backbone.View.extend({
            initialize: function(options) {
                options = options || {};
                if (options.disabled) {
                    this.disabled = true;
                    this.events = {};
                }
            },
            disabled: false,
            events: {'click': 'toggleEdit'},
            manage: true,
            tagName: 'a',
            attributes: {
                'class': [standardClass, editClass].join(' ')
            },
            beforeRender: function() {
                if (this.disabled) {
                    this.$el.addClass(disabledClass);
                }
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
