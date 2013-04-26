.. highlight:: javascript

Moxie Backbone Extensions
=========================

When developing with Backbone.js we identify common code and move that into the ``core`` module.

MoxieCollection
---------------

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
