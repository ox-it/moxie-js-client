define(["backbone", "hbs!events/templates/event_list_item"],
    function(Backbone, eventListItemTemplate) {
        var EventListItemView = Backbone.View.extend({
            manage: true,
            tagName: "li",
            serialize: function() { return this.model.toJSON(); },
            template: eventListItemTemplate
        });
        return EventListItemView;
});