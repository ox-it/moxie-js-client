Overview
========

Documentation for developers on good practices when coding on an app / a view.

When creating a new app
-----------------------

Make sure that you have a default empty route pointing to a page that should be the home screen for your app.

When creating a new view
------------------------

Each view should have a correct title describing the page. This is particularly important for views that will be put in favorites.

.. code-block:: javascript

    Backbone.trigger('domchange:title', "My title");
