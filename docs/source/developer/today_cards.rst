.. highlight:: javascript

Today view "cards"
==================

Our Today view is composed of many individual "cards", for example a card for displaying the image from a webcam in Oxford. Another showing the current term date, weather etc.

This allows users to explore different applications within Moxie from the today screen.

Creating a card
---------------

The best way to see how to implement a card is to look at an example::

    // From today/models/RiverStatus.js
    define(['backbone', 'underscore', 'moxie.conf', 'today/views/RiversCard'], function(Backbone, _, conf, RiversCard) {
        var RiverStatus = Backbone.Model.extend({
            url: conf.urlFor('rivers'),
            View: RiversCard
        });
        return RiverStatus;
    });

    // From today/views/RiversCard.js
    define(['backbone', 'hbs!today/templates/rivers'], function(Backbone, riversTemplate) {
        var RiversCard = Backbone.View.extend({
            manage: true,
            id: 'rivers_status',
            attributes: {'class': 'today'},
            serialize: function() {
                return this.model.toJSON();
            },
            template: riversTemplate
        });
        return RiversCard;
    });


The ``RiverStatus`` model provides an attribute ``View`` which points to our ``RiversCard`` view.

Models which represent cards are added to the ``TodayItems`` collection, which calls ``fetch()`` on each model. Once that Model fetches its default value the View is rendered and the card is **inserted** into the page.
