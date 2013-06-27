.. highlight:: javascript
Handling Geolocation
====================

Any components in moxie-js-client can access the users location data through two different APIs found in the ``moxie.position`` module.

Follow/Unfollow - subscribe to updates
--------------------------------------

.. js:function:: UserPosition.follow(callback)

   :param function callback: a callback to be called each time the user position updates.

   Start listening to user position updates.

.. js:function:: UserPosition.unfollow(callback)

   :param function callback: the callback already registered you want to remove from the listener

   Stop listening to user position updates.

getLocation - one shot accurate position
----------------------------------------

.. js:function:: UserPosition.getLocation(cb [, options])

   :param function callback: a callback to be called once a good enough position has returned from the navigator
                             APIs or the timeout has fired.
   :param object options: Optional paramters passed in this object include, ``errorMargin`` specify in meters
                          how accurate a response you want returned by getLocation. Also a ``timeout`` in ms
                          how long should getLocation wait before returning the most recent result which didn't
                          meet the ``errorMargin`` criteria.

   Uses the phones most accurate capabilities to get a good position result within the specified paramaters.
