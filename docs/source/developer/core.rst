.. highlight:: javascript

Core Moxie Modules
==================

When developing with Backbone.js we identify common code and move that into the ``core`` module.

core/collections/MoxieCollection
--------------------------------

Our base Collection providing some common methods we're using throughout our applications. To create a new collection using ``MoxieCollection`` simply extend it.

.. js:function:: MoxieCollection.getAsync(key[, options, retry])

   We found that a common usecase for us was waiting for a "fetch" or somesuch async call to be made before
   we could confidently call ``get`` to get our object. Since we were doing this quite often we created
   ``getAsync``. This allows you to wait for an event to fire on your collection before calling ``get`` on
   the key. Passing a success callback which will receive the object requested as the first argument.

   :param key: The ``id`` of the model you want to access from the collection. See ``Backbone.Model.idAttribute``.
   :param object options: The following optional arguments can be passed in the options argument

     * ``success``: Called when the get has succeeded, this function will be called with the object returned from the collection as the argument.
     * ``failure``: Called if the ``key`` cannot be found in the collection.
     * ``pendingEvent``: default ``reset`` - The event you want getAsync to wait for before calling ``success``.
   :param boolean retry: Used to prevent repeated callbacks occuring.


core/media
----------

Simple module which presents an API to determine which media queries are active
on the ``document`` at a particular time.

.. js:attribute:: media.isTablet()

   Does our media query suggest the ``document`` is being rendered in a tablet
   style layout. This also applies for desktop's and any device with
   significant width.

.. js:attribute:: media.isPhone()

   Are we being rendered on a device with a small width suggesting a phone.

core/views/MapView
------------------

Base view for rendering a Map with a collection of Points of Interest
(POICollection) on it.

.. js:class:: MapView([options])

   Accepts all the usual ``Backbone.View`` arguments. As well as:

   :param options.fullScreen: Should this Map have the full-screen class to
                              render at 100% height?
   :param options.interactiveMap: Should the map allow user interaction e.g.
                                  touch and drag the map about. If this is
                                  falsy or the map is rendered in phone view
                                  then click events on the map will be fired as
                                  ``mapClick`` on the ``MapView`` object.


.. js:function:: MapView.setCollection(collection)

   Update the MapView, removing any points currently rendered and place
   pointers for the new ``collection``.

   :param collection: The new ``Backbone.Collection`` to be rendered. Models
                      within this collection should have ``lat`` and ``lon`
                      attribute in order for points to be placed.
