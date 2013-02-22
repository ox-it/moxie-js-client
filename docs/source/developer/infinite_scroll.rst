.. highlight:: javascript
Infinite Scrolling
==================

To add infinite scrolling to your views simply extend ``core/views/InfiniteScrollView``, a simple example of this can be found in ``core/views/specs/infinite``.

InfiniteScrollView
------------------

.. js:function:: InfiniteScrollView.initScroll([options])

   :param object options: The following optional arguments can be passed in the options argument

     * ``windowScroll``: default ``false`` - should be a boolean saying if we want to listen to window.scroll events
     * ``scrollElement``: default ``undefined`` - DOM element we want to listen to scroll events for
     * ``intervalPeriod``: default 250ms - time in ms which we should check if the user has scrolled
     * ``scrollThreshold``: default ``undefined`` a floating point integer between 0 and 1 - The ratio representating how far down a page scroll should the ``scrollCallbacks`` be called.
       If left undefined ``scrollCallbacks`` are called whenever the scroll event fires.

.. js:attribute:: InfiniteScrollView.scrollCallbacks

    Array like object of functions to be called when the user scrolls down the page.
