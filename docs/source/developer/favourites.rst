.. highlight:: javascript

Favourites
==========

Moxie has a customisable home view which responds to users making favourites of
resources in the application. For example a favourited bus stop will appear on
the today view.

Responding to items being "favourited"
--------------------------------------

When a user clicks the favourite button and that model is successfully saved we
fire an event on the ``Backbone`` object with the event type ``favourited``.
Here's an example of capturing the event and setting the ``type`` attribute on
a favourite model::

    Backbone.on('favourited', function(favourite) {
        favourite.set('type', 'poi:tram-station');
        favourite.save();
    });

This event can be captured anywhere so be sure to call
``Backbone.off('favourited')`` once you're done (e.g. on ``cleanup``).

Now your :doc:`today_cards` can respond to favourites with your specified type.
