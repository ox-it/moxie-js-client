.. highlight:: javascript


Real-time Information
=====================

Moxie presents RTI (real-time information) for different resources, currently
these are all points of interest however in the future that could change.

The JS client has a standard way of handling RTI for a POI which is inline with
how Backbone.js is structured. Each different RTI ``type`` has its own
``Backbone.Model`` and ``Backbone.View``.

Adding a new RTI type
---------------------

The modules we're interested in for adding a new RTI type are
``places/models/RTIModels.js`` and ``places/views/RTIViews.js``. These modules
*export* objects which take the following format (RTIViews.js)::

    {
        'rti-type': Backbone.View,
        'another-rti-type': Backbone.View
    }

Adding support for a new RTI type should be a matter of extending these objects
with your View and Model respectively.

To get this rendering on a particular POI (assuming the API is serving the RTI
correctly, see `Moxie RTI docs
<https://moxie.readthedocs.org/en/latest/http_api/rti.html>`__ for that) the
RTI type needs to be added to ``DEFAULT_RTI_TYPES`` in
``places/models/POIModel.js``.
