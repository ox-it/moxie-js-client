Testing
=======

Moxie JS client is tested using `Jasmine`_ a behaviour-driven development framework. The specs (BDD lingo for TestSuite) for the common Moxie JavaScript can be found in ``app/tests/specs/*``, specs for each applicaiton should be located alongside the application in a folder called *specs*. This is done with a view to possibly breaking applications into separate repositories if ever possible.

.. _Jasmine: http://pivotal.github.com/jasmine/

Running the tests
-----------------
The easiest way to run the tests is to open your browser to the ``SpecRunner.html`` file. However it's also possible to run the tests with `phantomjs`_::

    $ phantomjs run-jasmine.js SpecRunner.html
    6 specs, 0 failures in 0.018s

The test runner, ``run-jasmine.js`` will handle setting the correct exit code and output the details of any failing specs.

.. _phantomjs: http://phantomjs.org

Adding specs
------------
When adding new spec files to be run as part of the test suite it's important to add the path of the spec file in ``app/tests/main.js``.
