(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['results'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n<li data-lon=";
  foundHelper = helpers.lon;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.lon; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " data-lat=";
  foundHelper = helpers.lat;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.lat; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + ">\n<h5>";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1);
  stack1 = depth0.opening_hours;
  foundHelper = helpers.openingHours;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "openingHours", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + "</h5>\n<p class=\"metadata\">";
  foundHelper = helpers.address;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\n<p class=\"metadata\">";
  foundHelper = helpers.phone;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.phone; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\n<p class=\"metadata\">";
  foundHelper = helpers.website;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.website; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\n<p class=\"metadata\">";
  stack1 = depth0.distance;
  foundHelper = helpers.humaniseDistance;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "humaniseDistance", stack1, {hash:{}});
  buffer += escapeExpression(stack1) + " away</p>\n</li>\n";
  return buffer;}

  foundHelper = helpers.results;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)}); }
  else { stack1 = depth0.results; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if (!helpers.results) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;});
templates['search'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div id=\"map\"></div>\n<div id=\"list-bar\">\n    <input type=\"text\" placeholder=\"Places search\" name=\"q\" value=\"\">\n    <span class=\"deleteicon ss-icon\">delete</span>\n    <h5>Results near <span >here</span></h5>\n    <ul class=\"results-list\">\n    </ul>\n</div>\n";});
})();