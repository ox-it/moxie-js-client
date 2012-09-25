//--------------------------------------------------------------------------------
//	$Id: time_domain.js,v 1.56 2011/08/10 20:26:06 wolf Exp wolf $
//--------------------------------------------------------------------------------
//	Erklärung:	http://www.netzwolf.info/kartografie/osm/time_domain/
//--------------------------------------------------------------------------------
//	Fragen, Wuensche, Bedenken, Anregungen?
//	<openlayers(%40)netzwolf.info>
//--------------------------------------------------------------------------------

var TimeDomain = {

	//--------------------------------------------------------------
	//	evaluate "opening_hours"-expression
	//		for a certain time and a certain region
	//--------------------------------------------------------------

	evaluateInTime: function (expression, checktime, option) {

		if (!option) option = {};
		var request = this.createTimestamp (checktime, null, 0);
		var mintime = new Date(request.y, request.m-1, request.d, request.H, request.M, request.S);
		this.scan (request, expression);
		request.option = option;
		this.evaluateRequest (request);

		//--------------------------------------------------------------
		//	no match → try daywrap
		//--------------------------------------------------------------

		if (request.value!=true) {
			var r24 = this.createTimestamp (checktime, null, 24);
			r24.parsedExpression = request.parsedExpression;
			r24.option = option;
			this.evaluateRequest (r24);

			var times = r24.times.concat (request.times);

			if (r24.usedrule) r24.usedrule += ' (with daywrap)';
			if (r24.value==true || r24.value==null && r24.comment!=null && request.comment==null) request=r24;
			request.times = times;
		}

		for (var i=0; i<request.times.length; i++) {
			if (request.times[i].t<mintime) request.times.splice(i--,1);
		}

		return request;
	},

	//--------------------------------------------------------------
	//	evaluate "collection_time"-expression
	//		for a certain time and a certain region
	//--------------------------------------------------------------

	evaluateNextTime: function (expression, checktime, option) {

		if (!option) option = {};
		var request = this.createTimestamp (checktime, null, 0);
		this.scan (request, expression);
		request.times = [];

		var mintime = new Date(request.y, request.m-1, request.d, request.H, request.M, request.S);
		//--------------------------------------------------------------
		//	loop
		//--------------------------------------------------------------

		var errors;
		var messages;

		for (offset=-1; offset<7; offset++) {

			var check = this.createTimestamp ({
					y: request.y,
					m: request.m,
					d: request.d+offset,
					H: 12});

			check.parsedExpression = request.parsedExpression;
			check.option = option;

			this.evaluateRequest (check);

			//--------------------------------------------------------------
			//	check and append to result
			//--------------------------------------------------------------

			for (var i in check.times) {
				if (check.times[i].t>=mintime) request.times.push (check.times[i]);
			}

			errors	= check.errors;
			messages= check.messages;

			if (request.times.length>=1) break;
		}

		request.errors  = request.errors  ? request.errors  .concat(errors  ||[]) : errors;
		request.messages= request.messages? request.messages.concat(messages||[]) : messages;

		return request;
	},

	//--------------------------------------------------------------
	//	error handler
	//--------------------------------------------------------------

	getRuleElements: function (request, start) {
		var out = [];
		for (var i=start; request.parsedExpression[i].t; i++) {
			out.push (request.parsedExpression[i].s);
		}
		return out;
	},

	log: function (request, msg, list) {
		var out = this.getRuleElements (request, request.rule_start);
		var pos = request.parsedExpression.length - request.tokens.length - request.rule_start;
		out.splice (Math.max (0, Math.min (out.length, pos)), 0, ['««»»']);
		list.push (msg + ' at "'+out.join(' ')+'"');
	},

	scanError: function (request, msg) {
		if (!request.errors) request.errors=[];
		request.errors.push (msg);
	},

	error: function (request, msg) {
		if (!request.errors) request.errors=[];
		this.log (request, msg, request.errors);
	},

	warning: function (request, msg) {
		if (!request.warnings) request.warnings=[];
		this.log (request, msg, request.warnings);
	},

	//--------------------------------------------------------------
	//	evaluate
	//--------------------------------------------------------------

	evaluateRequest: function (request) {

		request.range_match= true;
		request.value	= false;
		request.comment	= null;
		request.start	= null;
		request.tokens	= request.parsedExpression.slice();

		while (request.tokens.length>=1) {

			if (request.tokens[0].s=='||') {
				request.tokens.shift();
				if (request.value) request.skip = true;
				if (request.skip) continue;
				request.range_match= true;
				request.value	= false;
				request.comment	= null;
				continue;
			}

			if (request.tokens[0].t==null) {
				request.tokens.shift();
				continue;
			}

			//--------------------------------------------------------------
			//	evaluate a single rule
			//--------------------------------------------------------------

			request.rule_start = request.parsedExpression.length-request.tokens.length;

			var error = this.evaluateBasicRule (request);

			//--------------------------------------------------------------
			//	error handler
			//--------------------------------------------------------------

			if (typeof(error)=='string' || request.tokens[0].t) {

				if (!error) error = 'Syntax error';

				this.error (request, error);

				while (request.tokens[0].t) request.tokens.shift();

				if (request.skip) continue;

				request.value	= null;
				request.comment	= 'invalid specification';
				request.start	= request.rule_start

				continue;
			}

			//--------------------------------------------------------------
			//	skip
			//--------------------------------------------------------------

			if (request.skip) continue;

			//--------------------------------------------------------------
			//	applicable
			//--------------------------------------------------------------

			if (!request.range_match || !request.day_match) continue;

			//--------------------------------------------------------------
			//	quick fix for informal dayrange specifications
			//--------------------------------------------------------------

			if (typeof(request.range_match)=='string') {

				if (request.rule_value) request.rule_value = null;

				request.rule_comment = request.rule_comment ?
					request.range_match + " " + request.rule_comment :
					request.range_match;
			}

			//--------------------------------------------------------------
			//	store value
			//--------------------------------------------------------------

			request.value	= request.rule_value;
			request.comment	= request.rule_comment;
			request.start	= request.rule_start;
			request.minutes	= request.rule_minutes;
		}

		if (request.start != null)
		request.usedrule = this.getRuleElements(request, request.start).join(' ');

		//------------------------------------------------------------
		//	process minutes
		//------------------------------------------------------------

		var minutes = [];

		for (var i in request.minutes) {
			entry = request.minutes[i];
			if (entry.v==false) {
				for (var i=0; i<minutes.length; i++) {
					if (entry.f<=minutes[i].t && minutes[i].t<=entry.l)
						minutes.splice (i--, 1);
				}
				continue;
			}
			if (entry.s>=1) {
				for (var t=entry.f; t<=entry.l; t+=entry.s) {
					minutes.push({t:t, c:entry.c});
				}
				continue;
			}
			minutes.push ({t:entry.f, c:entry.c});
		}

		minutes.sort (function(a,b) { return a.t-b.t; });

		//--------------------------------------------------------------
		//	transform to times
		//--------------------------------------------------------------

		var base = new Date (request.y, request.m-1, request.d, 12, 0, 0).getTime()
			- 12 *3600*1000;

		request.times = [];
		for (var i in minutes) {
			request.times.push ({t:new Date (base + minutes[i].t*60*1000), c:minutes[i].c});
		}
	},

	//----------------------------------------------------------------------------
	//	evaluate single rule:
	//	string:	error
	//	null:	no error
	//----------------------------------------------------------------------------

	evaluateBasicRule: function (request) {

		//------------------------------------------------------------
		//	init
		//------------------------------------------------------------

		request.day_match	= false;
		request.time_match	= false;
		request.rule_value	= false;
		request.rule_comment	= null;
		request.rule_minutes	= [];

		//------------------------------------------------------------
		//	rule_sequence - calendar_ranges
		//------------------------------------------------------------

		var error = this.evaluateCalendarRanges (request);

		if (typeof(error)=='string') return error;

		//------------------------------------------------------------
		//	Empty rule
		//------------------------------------------------------------

		if (!request.tokens[0].t) return;

		//------------------------------------------------------------
		//	Basic Rule
		//------------------------------------------------------------

		for (;;) {

			//------------------------------------------------------------
			//	Times for Days
			//------------------------------------------------------------

			error = this.evaluateTimesForDays (request);

			if (typeof(error)=='string') return error;

			//-------------------------------------------------
			//	{ "," Times for Days }
			//-------------------------------------------------

			if (this.C(request.tokens, ',')) continue;

			//-------------------------------------------------
			//	error correction
			//-------------------------------------------------

			switch (request.tokens[0].t) {
			case 'week':	// daylist:	week
			case 'd':	// daylist:	mday
			case 'h':	// daylist:	holiday
			case 'w':	// daylist:	weekday
				this.error (request, 'Comma expected');
				continue;
			}

			return;
		}
	},

	//----------------------------------------------------------------------------
	//	evaluate single Days+Times group
	//	string:	if error
	//	null:	if no error
	//----------------------------------------------------------------------------

	evaluateTimesForDays: function (request) {

		//------------------------------------------------------------
		//	24/7
		//------------------------------------------------------------

		if (this.C(request.tokens,'24/7')) {
			if (request.H>=24) return;
			request.day_match	= true;
			request.time_match	= true;
			request.rule_value	= true;
			return;
		}

		//------------------------------------------------------------
		//	open
		//------------------------------------------------------------

		if (this.C(request.tokens,'open')) {
			var comment = this.CG(request.tokens, '"');
			if (request.H>=24) return;
			request.day_match	= true;
			request.time_match	= true;
			request.rule_value	= true;
			request.rule_comment 	= comment;
			return;
		}

		//------------------------------------------------------------
		//	closed
		//------------------------------------------------------------

		if (this.C(request.tokens,'closed') || this.C(request.tokens,'off')) {
			var comment = this.CG(request.tokens, '"');
			request.day_match	= true;
			request.time_match	= true;
			request.rule_value	= false;
			request.rule_comment 	= comment;
			return;
		}

		//------------------------------------------------------------
		//	unknown / "..."
		//------------------------------------------------------------

		if (this.C(request.tokens,'unknown') || request.tokens[0].t=='"') {
			var comment = this.CG(request.tokens, '"');
			request.day_match	= true;
			request.time_match	= true;
			request.rule_value	= null;
			request.rule_comment 	= comment;
			return;
		}

		//------------------------------------------------------------
		//	<day_list>
		//		string:	error
		//		null:	no daylist
		//		true:	in daylist
		//		false:	not in daylist
		//------------------------------------------------------------

		var day_match = this.evaluateDayList (request);

		if (typeof(day_match)=='string') return day_match;

		if (day_match!=false) request.day_match = true;

		//------------------------------------------------------------
		//	<day_list> "off"
		//------------------------------------------------------------

		if (day_match != null &&
			(this.C(request.tokens, 'off')||this.C(request.tokens, 'closed'))) {
			var comment = this.CG(request.tokens, '"');
			request.time_match	= true;
			request.rule_value	= false;
			request.rule_comment	= comment;
			return;
		}

		//------------------------------------------------------------
		//	Times
		//------------------------------------------------------------

		var in_times = this.evaluateTimes (request, day_match!=null);

		if (day_match==null) day_match = true;

		if (typeof(in_times)=='string') return in_times;

		//------------------------------------------------------------
		//	Status	(open, closed, unknown)
		//------------------------------------------------------------

		var value;
		var comment;

		if (this.C(request.tokens, 'open')) {
			value	= true;
			comment	= this.CG(request.tokens, '"');
		} else if (this.C(request.tokens, 'closed')||this.C(request.tokens, 'off')) {
			value	= false;
			comment	= this.CG(request.tokens, '"');
		} else if (this.C(request.tokens, 'unknown')) {
			value	= null;
			comment	= this.CG(request.tokens, '"');
		} else if (request.tokens[0].t=='"') {
			value	= null;
			comment	= this.G(request.tokens);
		} else {
			value	= true;
		}

		//------------------------------------------------------------
		//	If daymatch, save times for "NextTime"
		//------------------------------------------------------------

		if (day_match==true) for (var i in request._times) {
			var obj = request._times[i];
			obj.v = value;
			obj.c = comment;
			request.rule_minutes.push (obj);
		}

		//------------------------------------------------------------
		//	Rule definitely not applicable
		//------------------------------------------------------------

		if (day_match==false || in_times==false) return;

		//------------------------------------------------------------
		//	Rule definitely applicable
		//------------------------------------------------------------

		if (day_match==true && in_times==true) {
			request.rule_value	= value;
			request.rule_comment	= comment;
			request.time_match	= true;
			return;
		}

		//------------------------------------------------------------
		//	Errorhandling shortcut
		//------------------------------------------------------------

		if (typeof(request.rule_value)=='boolean' && request.rule_value==value) return;

		//------------------------------------------------------------
		//	Something went wong
		//------------------------------------------------------------

		request.rule_value = null;
		request.rule_comment  = null;
		request.time_match = true;
		return;
	},

	//============================================================================
	//
	//	CALENDAR RANGES
	//
	//============================================================================

	//----------------------------------------------------------------------------
	//	evaluate ranges:
	//		r.new_range	- range provided?
	//		r.range_match	- request matches range provided?
	//	returns:
	//		string:	error
	//		true:	range provided
	//		false:	no range provided
	//----------------------------------------------------------------------------

	evaluateCalendarRanges: function (request) {

		//--------------------------------------------------------
		//	[ calendar_ranges ]
		//--------------------------------------------------------

		switch (request.tokens[0].t) {
		case '"':
			if (request.tokens[1].t!=':') return false;
		case 'y':
		case 'm':
		case 'v':
		case 's':
			break;
		default:
			return false;
		}

		//--------------------------------------------------------
		//	calendar_ranges
		//--------------------------------------------------------

		request.range_match  = false;

		//--------------------------------------------------------
		//	sticky values
		//--------------------------------------------------------

		request.thisMonth = null;
		request.thisYear  = request.y;
		request.yearSet   = false;

		//--------------------------------------------------------
		//	list of CalendarDays
		//--------------------------------------------------------

		for (;;) {

			//-----------------------------------------
			//	year
			//-----------------------------------------

			if (request.tokens[0].t=='y') {
				request.thisYear  = this.G(request.tokens);
				request.yearSet   = true;
				request.thisMonth = null;
			}

			//--------------------------------------------------------
			//	month [ - month ]
			//--------------------------------------------------------

			if (request.tokens[0].t=='m' && request.tokens[1].t!='n' && request.tokens[1].t!='w') {

				var first = this.G(request.tokens);
				var last  = first;

				if (this.C(request.tokens, '-')) {
					if (request.tokens[0].t!='m') return 'Month expected';
					last = this.G(request.tokens);
				}

				if (first <= request.m && request.m <= last && request.y==request.thisYear)
					request.range_match=true;

				if (first>last && !request.yearSet && (request.m>=first || request.m<=last))
					request.range_match=true;

				if (first>last && request.yearSet) {
					if (request.y==request.thisYear   && request.m>=first) request.range_match=true;
					if (request.y==request.thisYear+1 && request.m<=last ) request.range_match=true;
				}

			} else if (request.tokens[0].t=='s') {

				var season = this.G(request.tokens);

				if (!request.yearSet || request.thisYear==request.y) {

					switch (season) {
					case 2:
						this.warning (request, 'Assuming "May-Oct" for "summer"');
						if (request.m>=5 && request.m<11) request.range_match=true;
						break;
					case 4:
						this.warning (request, 'Assuming "Nov-Apr" for "winter"');
						if (request.m<=4 || request.m>10) request.range_match=true;
						break;
					}
				}

			} else if (request.tokens[0].t=='"') {

				//------------------------------------------------
				//	textdescription
				//------------------------------------------------

				var comment = this.G (request.tokens);
				this.warning (request, 'Description "'+comment+'" is not evaluated.');
				request.range_match = comment;

			} else {

				//------------------------------------------------
				//	date_with_offset
				//------------------------------------------------

				var first = this.evaluateDateWithOffset (request);
				if (typeof(first) == 'string') return first;

				//------------------------------------------------
				//	[ - date_with_offset ]
				//------------------------------------------------

				var last = first;
				if (this.C(request.tokens,'-')) {
					last = this.evaluateDateWithOffset (request);
					if (typeof(last) == 'string') return last;
				} else if (this.C(request.tokens,'+')) {
					last = 999999999;
				}

				//------------------------------------------------
				//	check if date in interval
				//	dates may be null
				//------------------------------------------------

				if (first!=null && last!=null) {

					if (first <= request.e && request.e <= last)
						request.range_match=true;

					if (last<first && !request.yearSet && (request.e>=first || request.e<=last))
						request.range_match=true;

					if (last<first && request.yearSet)
						this.warning (request, 'Empty date range');

				} else if (!request.range_match) {

					request.range_match = null;

				}
			}

			//--------------------------------------------------------
			//	"," starts next range
			//--------------------------------------------------------

			if (!this.C(request.tokens, ',')) break;
		}

		if (!this.C(request.tokens, ':'))
			this.warning (request, 'Missing ":" after range');

		return true;
	},

	//----------------------------------------------------------------------------
	//	evaluate date_with_offset
	//	string:	any error
	//	null:	unknown date
	//	number:	epoch value of given day
	//----------------------------------------------------------------------------

	evaluateDateWithOffset: function (request) {

		var day = this.evaluateDate (request);

		if (typeof(day) == 'string') return day;

		//------------------------------------------------------
		//	wday_offset
		//------------------------------------------------------

		if (request.tokens[0].t=='+' && request.tokens[1].t=='w') {
			if (day!=null) day += 7 - (this.W(day)-request.tokens[1].v+7)%7;
			request.tokens.splice(0,2);
		} else if (request.tokens[0].t=='-' && request.tokens[1].t=='w') {
			if (day!=null) day -= 7 - (request.tokens[1].v-this.W(day)+7)%7;
			request.tokens.splice(0,2);
		}

		//------------------------------------------------------
		//	± <number> days
		//------------------------------------------------------

		if (request.tokens[0].t=='+' && request.tokens[1].t=='n' && request.tokens[2].t=='days') {
			if (day!=null) day += request.tokens[1].v;
			request.tokens.splice(0,3);
		} else if (request.tokens[0].t=='-' && request.tokens[1].t=='n' && request.tokens[2].t=='days') {
			if (day!=null) day -= request.tokens[1].v;
			request.tokens.splice(0,3);
		}

		return day;
	},

	//----------------------------------------------------------------------------
	//	evaluate date
	//	string:	any error
	//	null:	unknown date
	//	number:	epoch value of given day
	//----------------------------------------------------------------------------

	date2day: function (request, mday) {

		if (request.thisMonth==2 && mday==29 && !request.yearSet)
			return "Feb 29 only allowed if year specified";

		var day  = this.E (request.thisYear, request.thisMonth, mday);

		if (mday>=1 && day<=this.E (request.thisYear, request.thisMonth+1, 0))
			return day;

		this.error (request, 'Invalid day of month');
		return null;
	},

	evaluateDate: function (request) {

		//-----------------------------------------
		//	day without month
		//-----------------------------------------

		if (request.tokens[0].t=='n' && request.thisMonth) {
			return this.date2day (request, this.G(request.tokens));
		}

		//-----------------------------------------
		//	year
		//-----------------------------------------

		if (request.tokens[0].t=='y') {
			request.thisYear  = this.G(request.tokens);
			request.yearSet   = true;
			request.thisMonth = null;
		}

		//-----------------------------------------
		//	variable date
		//-----------------------------------------

		if (request.tokens[0].t=='v')
			return this.evaluateMovable(request, this.G(request.tokens));

		//-----------------------------------------
		//	month
		//-----------------------------------------

		if (request.tokens[0].t!='m') return 'Month expected';
		request.thisMonth = this.G(request.tokens);

		//-----------------------------------------
		//	mday or wday ?
		//-----------------------------------------

		switch (request.tokens[0].t) {
		case 'n':
			return this.date2day (request, this.G(request.tokens));
		case 'w':
			var wday=this.G(request.tokens);
			if (!this.C(request.tokens, '[')) return '"[" expected';

			var d;
			if (this.C(request.tokens,'-')) {
				if (request.tokens[0].t != 'n') return "Weeknumber 1-5 expected";
				d = this.E(request.thisYear, request.thisMonth+1, 1-7*this.G(request.tokens));
			} else {
				if (request.tokens[0].t != 'n') return "Weeknumber 1-5 expected";
				d = this.E(request.thisYear, request.thisMonth, 7*this.G(request.tokens)-6);
			}
			if (!this.C(request.tokens, ']')) return '"]" expected';
			return d + (wday - this.W(d) + 7) % 7;
		}

		return 'Weekday or day of month expected';
	},

	//----------------------------------------------------------------------------
	//	evaluate movable days
	//	null:	any error
	//	number:	epoch for this day
	//----------------------------------------------------------------------------

	evaluateMovable: function (request, name) {

		switch (name) {
		case 'easter':
			var a = request.thisYear % 19;
			var b = request.thisYear % 4;
			var c = request.thisYear % 7;
			var k = Math.floor (request.thisYear / 100);
			var p = Math.floor ((8*k + 13) / 25);
			var q = Math.floor (k / 4);
			var M = (15 + k - p - q) % 30;
			var N = (4 + k - q) % 7;
			var d = (19*a + M) % 30;
			var e = (2*b + 4*c + 6*d + N) % 7;
			var d = (22 + d + e);
			return this.E (request.thisYear, 3, d<57 ? d : d-7);
		}

		this.error (request, 'No date for movable "'+name+'" in year "'+request.thisYear+'"');
		return null;
	},

	//============================================================================
	//
	//	DAY LIST  incl.  WEEKS
	//
	//============================================================================

	//----------------------------------------------------------------------------
	//	string:	error
	//	null:	empty
	//	true:	not empty, match
	//	false:	not empty, no match
	//----------------------------------------------------------------------------

	evaluateDayList: function (request) {

		switch (request.tokens[0].t) {
		case 'd':
		case 'w':
		case 'h':
		case 'week':
			break;
		default:
			return null;
		}

		//------------------------------------------
		//	Days
		//------------------------------------------

		var result = false;

		for (;;) {

			var inweek = true;

			//------------------------------------------
			//	Weeks n [ - n [ / n ]]
			//------------------------------------------

			if (this.C(request.tokens, 'week')) {

				inweek = false;

				do {
					if (request.tokens[0].t!='n') return 'Weeknumber expected';

					var first = this.G(request.tokens);
					var last  = first;
					var step;

					if (this.C(request.tokens, '-')) {

						//-------------------------------------
						//	week first - last
						//-------------------------------------

						if (request.tokens[0].t!='n') return 'Weeknumber expected';
						last = this.G(request.tokens);

						//-------------------------------------
						//	week first - last / step
						//-------------------------------------

						if (this.C(request.tokens, '/')) {
							if (request.tokens[0].t!='n') return 'Number expected';
							step=this.G(request.tokens);
						}
					}

					if (!step) step=1;

					if (first <= request.yw && request.yw <= last &&
						(request.yw-first)%step==0) inweek = true;
				} while (this.C(request.tokens, ','));
			}

			//------------------------------------------
			//	Holidays-Prefix
			//------------------------------------------

			var cond = inweek;

			while (request.tokens[0].t=='h' &&
				(request.tokens[1].t=='d'||request.tokens[1].t=='w'||request.tokens[1].t=='h')) {
				if (!this.evaluateHoliday (request, this.G(request.tokens))) cond=false;
			}

			//------------------------------------------
			//	Monthday or Weekday or Holiday
			//------------------------------------------

			switch (request.tokens[0].t) {

			//------------------------------------------
			//	Monthdays
			//------------------------------------------

			case 'd':
				//------------------------------------------------
				//	mday | mday - mday
				//------------------------------------------------

				var first = this.G(request.tokens);
				var last = first;
				var step;

				if (this.C(request.tokens, '-')) {
					if (request.tokens[0].t!='d') return 'Day of month expected';
					last = this.G(request.tokens);
					//-------------------------------------
					//	/<step> (for odd/even))
					//-------------------------------------
					if (this.C(request.tokens, '/')) {
						if (request.tokens[0].t!='n') return 'Number expected';
						step=this.G(request.tokens);
					}
				}
				if (!step) step=1;
				if (first <= request.d && request.d <= last &&
						(request.d-first)%step==0 && cond)
					result = true;
				break;

			//------------------------------------------
			//	Weekdays
			//------------------------------------------

			case 'w':
				var weekday = this.G(request.tokens);

				switch (request.tokens[0].t) {

				//----------------------------------
				//	wday
				//----------------------------------

				default:
					if (request.w==weekday && cond)
						result = true;
					break;

				//----------------------------------
				//	wday - wday
				//----------------------------------

				case '-':
					request.tokens.shift();
					if (request.tokens[0].t != 'w') return null;
					if ((request.w-weekday+7)%7 <= (this.G(request.tokens)-weekday+7)%7
							&& cond)
						result = true;
					break;

				//----------------------------------
				//	wday [...]
				//----------------------------------

				case '[':
					request.tokens.shift();
					var found=false;
					for (;;) {
						switch (request.tokens[0].t) {
						default:
							return 'Number expected';
						case 'n':
							var snth = this.G(request.tokens);
							var enth = snth;
							if (this.C(request.tokens,'-')) {
								if (request.tokens[0].t!='n')
									return 'Number expected';
								var enth = this.G(request.tokens);
							}
							if (snth*7-6 <= request.d && request.d <= enth*7)
								found = true;
							break;

						case '-':
							request.tokens.shift();
							if (request.tokens[0].t != 'n')
								return 'Number expected';
							var start = request.l - this.G(request.tokens)*7;
							if (start <= request.d && request.d < start+7)
								found = true;
						}

						if (!this.C(request.tokens, ',')) break;
					}

					if (!this.C(request.tokens, ']')) return '"]" expected';

					if (found && request.w==weekday && cond)
						result = true;
				}

				break;

			//------------------------------------------
			//	Holidays
			//------------------------------------------

			case 'h':
				var type  = this.G(request.tokens);
				var offset= 0;
				if ((request.tokens[0].t=='+' || request.tokens[0].t=='-') && request.tokens[1].t=='n' && request.tokens[2].t=='days') {
					offset = (request.tokens[0].t=='-' ? -1 : +1) * request.tokens[1].v;
					request.tokens.splice (0,3);
				}
				var r = this.evaluateHoliday (request, type, offset);
				if (!result && cond) result = r;
				break;

			default:
				return 'Day of month, weekday or type of holiday expected';
			}

			//--------------------------------------------------------
			//	"," starts next selection
			//--------------------------------------------------------

			if (!this.C (request.tokens, ',')) return result;
		}
	},

	//----------------------------------------------------------------------------
	//	true:	parameter day is holiday
	//	false:	parameter day is not holiday
	//	null:	unknown
	//----------------------------------------------------------------------------

	evaluateHoliday: function (request, type, offset) {

		if (!request.option.region) {
			this.warning (request, 'Assuming "'+this.defaultRegion+'" for region');
			request.option.region = this.defaultRegion;
		}

		var region = request.option.region.toLowerCase();
		var checker = this['holidays_'+region];

		if (!checker) {
			this.warning (request,'No holiday list for type "'+type+'" and region "'+region+'"');
			return false;
		}

		if (!this.holidayDates[region]) this.holidayDates[region]=[];
		if (!this.holidayDates[region][type]) this.holidayDates[region][type]=[];

		var date  = request.e - offset;
		var years = [request.y-1, request.y, request.y+1];

		for (var i in years) {

			var year = years[i];
			var list = this.holidayDates[region][type][year];

			if (!list) this.holidayDates[region][type][year] = list =
				this['holidays_'+region] (request, year, type);

			if (!list) {
				this.warning (request,
					'Holiday type "'+type+'" for region "'+region+'" not configured');
				return false;
			}
				
			for (var holidayName in list) {
				if (list[holidayName]!=date) continue;
				this.warning (request,
					'Found "'+holidayName+'" for holiday type "'+type+'"');
				return true;
			}
		}
		return false;
	},

	holidays_de: function (request, year, type) {

		switch (type) {
		case 'public':
			list = {};
			list['Neujahrstag']               = this.E (year,  1,  1);
			list['Tag der Arbeit']            = this.E (year,  5,  1);
			list['Tag der Deutschen Einheit'] = this.E (year, 10,  3);
			list['1. Weihnachtstag']          = this.E (year, 12, 25);
			list['2. Weihnachtstag']          = this.E (year, 12, 26);

			var easterDate = this.evaluateMovable (request, 'easter');

			if (easterDate) {
				list['Karfreitag']          = easterDate - 2;
				list['Ostermontag']         = easterDate + 1;
				list['Christi Himmelfahrt'] = easterDate +39;
				list['Pfingstmontag']       = easterDate +50;
			}
			return list;
		}
		return null;
	},

	holidays_at: function (request, year, type) {

		switch (type) {
		case 'public':
			list = {};
			list['Neujahr']                   = this.E (year,  1,  1);
			list['Heilige Drei Könige']       = this.E (year,  1,  6);
			list['Staatsfeiertag']            = this.E (year,  5,  1);
			list['Mariä Himmelfahrt']         = this.E (year,  8, 15);
			list['Nationalfeiertag']          = this.E (year, 10, 26);
			list['Allerheiligen']             = this.E (year, 11,  1);
			list['Mariä Empängnis']           = this.E (year, 12,  8);
			//list['Heiliger Abend']            = this.E (year, 12, 24);
			list['Christtag']                 = this.E (year, 12, 25);
			list['Stephanitag']               = this.E (year, 12, 26);
			//list['Silvester']                 = this.E (year, 12, 31);

			var easterDate = this.evaluateMovable (request, 'easter');

			if (easterDate) {
				//list['Karfreitag']          = easterDate - 2;
				list['Ostermontag']         = easterDate + 1;
				list['Christi Himmelfahrt'] = easterDate +39;
				list['Pfingstmontag']       = easterDate +50;
				list['Fronleichnam']        = easterDate +60;
			}
			return list;
		}
		return null;
	},

	//============================================================================
	//
	//	TIMES
	//
	//============================================================================

	//----------------------------------------------------------------------------
	//	true:	match
	//	false:	no match
	//	null:	unknown
	//	default is 00:00-24:00 and Error message
	//----------------------------------------------------------------------------

	evaluateTimes: function (request, acceptEmpty) {

		request._times = [];

		switch (request.tokens[0].t) {
		case 't':
		case 'e':
			break;
		case '-':
			if (request.tokens[1].t=='t' || request.tokens[1].t=='e') break;
		default:
			if (!acceptEmpty) return "";
			this.warning (request, 'No time specification, assuming 0:00-24:00');
		case '??':
			return request.H < 24
		}

		var time = request.H * 60 + request.M;
		var result = false;

		for (;;) {

			//-------------------------------------
			//	[time]
			//-------------------------------------

			var first=-1;

			if (request.tokens[0].t!='-') {
				first = this.evaluateTime (request);
				if (typeof(first)=='string') return first;
			}

			var last=first;
			var step=0;

			switch (request.tokens[0].t) {
			//-------------------------------------
			//	time - time
			//-------------------------------------
			case '-':
				request.tokens.shift();
				last = this.evaluateTime (request);
				if (typeof(last)=='string') return last;
				if (first<0) {
					var h = last>6*60 ? 6 : 0;
					first = h*60;
					this.error (request, 'Missing starttime for timerange, assuming '+h+':00');
				}
				if (last<=first) last += 24*60;
				//-------------------------------------
				//	/<step> (for collection_times)
				//-------------------------------------
				if (this.C(request.tokens, '/')) {
					switch (request.tokens[0].t) {
					case 't':
						step=this.G(request.tokens);
						break;
					case 'n':
						step=this.G(request.tokens);
						break;
					default:
						return 'H:MM or number of minutes expected';
					}
				} else if (this.C(request.tokens,'+')) {
					this.warning (request, 'Assuming '+
						Math.floor(last/60)+':'+(last%60<10?'0':'')+last%60+
						' as endtime for "+" notation');
				}
				break;
			//-------------------------------------
			//	time+
			//-------------------------------------
			case '+':
				request.tokens.shift();
				last = first + 4 * 60;
				if (last>=24*60) last=24*60;
				this.warning (request, 'Assuming '+
					Math.floor(last/60)+':'+(last%60<10?'0':'')+last%60+
					' as endtime for "+" notation');
				break;
			}

			//-------------------------------------
			//	eval
			//-------------------------------------

			if (first!=null && last!=null) {
				if (first <= time && time < last) result = true;
				request._times.push ({f:first,l:last,s:(step?step:last-first)});
			} else if (!result) {
				result = null;
			}

			//-------------------------------------
			//	…, nexttimerange
			//-------------------------------------

			if (request.tokens[0].t == ',' && (request.tokens[1].t == 't' || request.tokens[1].t == 'e')) {
				request.tokens.shift();
				continue;
			}

			//-------------------------------------------------
			//	error correction
			//-------------------------------------------------

			switch (request.tokens[0].t) {
			case 't':	// timespan:	time
			case 'e':	// timespan:	event
				var msg = 'Comma expected before "'+request.tokens[0].s+'" in "'+request.rule+'"';
				this.error (request, 'Comma expected');
				continue;
			}

			break;
		}

		return result;
	},

	//----------------------------------------------------------------------------
	//	string:	error
	//	number:	minutes since midnight
	//----------------------------------------------------------------------------

	evaluateTime: function (request, last) {

		//--------------------------------------------
		//	hh:mm
		//--------------------------------------------

		if (request.tokens[0].t=='t') return this.G(request.tokens);

		//--------------------------------------------
		//	event
		//--------------------------------------------

		if (request.tokens[0].t=='e') {

			var t = this.evaluateEvent (request, this.G(request.tokens));

			if (typeof(t)=='string') return t;

			if (request.tokens[0].t=='+' && request.tokens[1].t=='t' && request.tokens[2].t=='hours') {
				t += request.tokens[1].v;
				request.tokens.splice(0, 3);
				return t;
			}

			if (request.tokens[0].t=='-' && request.tokens[1].t=='t' && request.tokens[2].t=='hours') {
				t -= request.tokens[1].v;
				request.tokens.splice(0, 3);
				return t;
			}

			return t;
		}

		//--------------------------------------------
		//	syntax error
		//--------------------------------------------

		return 'HH:MM or sunset/sunrise expected';
	},

	//----------------------------------------------------------------------------
	//	number:	minutes from midnight
	//	null:	unknown
	//----------------------------------------------------------------------------

	evaluateEvent: function (request, name) {

		switch (name) {

		case 'sunrise':
			this.warning (request, 'Using 06:00 for "sunrise"');
			return 6*60+00;

		case 'sunset':
			this.warning (request, 'Using 18:00 for "sunset"');
			return 18*60;
		}

		this.error (request, 'No time for event "'+name+'"');
		return null;
	},


	//==============================================================================
	//
	//	Lexical analysis
	//
	//==============================================================================

	//----------------------------------------------------------------------------
	//	scans an expression
	//		result to request.request.tokens
	//----------------------------------------------------------------------------

	scan: function (request, expression) {

		request.parsedExpression = [];

		var conflicts = expression.match (/[a-z_àè]+[0-9][a-z0-9_]*|[0-9]+[a-z_]\w*/gi);
		if (conflicts) this.scanError (request,
			'Missing space at '+conflicts.join(', '));

		conflicts = expression.match (/[0-9]+[.h][0-9]+/g);
		if (conflicts) this.scanError (request,
			'Please use ":" as hour/minute-separator at '+conflicts.join(', '));

		var symbols = expression.match (/[a-z_]+|24\/7|[0-9]+[.:][0-9]+|[0-9]+[.]|[0-9]+|"[^";]*"|\|\||[^\w\s]/gi);

		sym:
		for (i in symbols) {

			var f = symbols[i];

			//------------------------------------------------------------
			//	Integers...
			//	0..60		number
			//	1970..2069	year
			//------------------------------------------------------------

			var v = parseInt (f, 10);
			var l = f.toLowerCase();

			if (!isNaN(v)) {
				var l2 = f.split(f.match(/[.]/) ? '.' : ':')[1];
				var v2 = parseInt (l2);
				if (!isNaN(v2)) {
					if (f.length>5 || l2.length!=2 || v>36 || v2>=60)
					this.scanError (request,
						'Invalid time at "'+f+'" in rule "'+request.rule+'"');
					request.parsedExpression.push ({t:'t', v:v*60+v2, s:f});
					continue;
				}
				if (f.split('.').length>=2) {
					if (v<1 || v>31)
					this.scanError (request,
						'Invalid day at "'+f+'" in rule "'+request.rule+'"');
					request.parsedExpression.push ({t:'d', v:v, s:f});
					continue;
				}
				if (f=='24/7') {
					request.parsedExpression.push ({t:f, s:f});
					continue;
				}
				if (v<=365) {
					request.parsedExpression.push ({t:'n', v:v, s:f});
					continue;
				}
				if (v>=1970 && v<2070) {
					request.parsedExpression.push ({t:'y', v:v, s:f});
					continue;
				}
			}

			//------------------------------------------------------------
			//	wrong words
			//------------------------------------------------------------

			for (var msg in this.wrong_words) {
				ok = this.wrong_words[msg][l]; 
				if (ok==null) continue;
				l=ok.toLowerCase();
				this.scanError (request,
					msg.replace(/<ko>/,f).replace(/<ok>/,ok));
				if (l=='') continue sym;
				break;
			}

			//------------------------------------------------------------
			//	Symbols
			//------------------------------------------------------------

			switch (l) {
			case '+':
			case ',':
			case '-':
			case '/':
			case ':':
			case '[':
			case ']':
				request.parsedExpression.push ({t:l, s:f});
				continue;
			case '–':
				this.scanError (request,
					'Use a minus sign "-" instead of a dash "–".');
				request.parsedExpression.push ({t:'-', s:f});
				continue;
			case ';':
				request.parsedExpression.push ({s:f});
				continue;
			case '||':
				request.parsedExpression.push ({s:f});
				continue;
			}

			//------------------------------------------------------------
			//	Words...
			//	- name of month
			//	- name of weekday
			//	- name of holiday
			//	- other
			//------------------------------------------------------------

			if ((v=this.seasons[l]) != null) {
				request.parsedExpression.push ({t:'s', v:v, s:f});
				continue;
			}
			if ((v=this.months[l]) != null) {
				request.parsedExpression.push ({t:'m', v:v, s:f});
				continue;
			}
			if ((v=this.weekdays[l]) != null) {
				request.parsedExpression.push ({t:'w', v:v, s:f});
				continue;
			}
			if ((v=this.movables[l]) != null) {
				request.parsedExpression.push ({t:'v', v:v, s:f});
				continue;
			}
			if ((v=this.holidays[l]) != null) {
				request.parsedExpression.push ({t:'h', v:v, s:f});
				continue;
			}
			if ((v=this.events[l]) != null) {
				request.parsedExpression.push ({t:'e', v:v, s:f});
				continue;
			}

			switch (l) {
			case 'closed':
			case 'days':
			case 'hours':
			case 'off':
			case 'open':
			case 'unknown':
			case 'week':
				request.parsedExpression.push ({t:l, s:f});
				continue;
			}

			//------------------------------------------------------------
			//	Comment
			//------------------------------------------------------------

			if (f.substr(0,1)=='"') {
				request.parsedExpression.push ({t:'"', v:this.T(f.substr(1,f.length-2)), s:f});
				continue;
			}

			//------------------------------------------------------------
			//	Error correction
			//------------------------------------------------------------

			for (var msg in this.wrong_weekdays) {
				v = this.wrong_weekdays[msg][l]; 
				if (v==null) continue;
				var ok = ['Su','Mo','Tu','We','Th','Fr','Sa'][v];
				this.scanError (request,
					msg.replace(/<ko>/,f).replace(/<ok>/,ok));
				request.parsedExpression.push ({t:'w', v:v, s:f});
				continue sym;
			}

			for (var msg in this.wrong_months) {
				v = this.wrong_months[msg][l]; 
				if (v==null) continue;
				var ok = [null,'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][v];
				this.scanError (request,
					msg.replace(/<ko>/,f).replace(/<ok>/,ok));
				request.parsedExpression.push ({t:'m', v:v, s:f});
				continue sym;
			}

			for (var msg in this.wrong_seasons) {
				v = this.wrong_seasons[msg][l]; 
				if (v==null) continue;
				var ok = [null,'Spring','Summer','Autumn','Winter'][v];
				this.scanError (request,
					msg.replace(/<ko>/,f).replace(/<ok>/,ok));
				request.parsedExpression.push ({t:'s', v:v, s:f});
				continue sym;
			}

			//------------------------------------------------------------
			//	Symbols
			//------------------------------------------------------------

			request.parsedExpression.push ({t:'??', s:f});
		}

		//------------------------------------------------------------
		//	eof marker
		//------------------------------------------------------------

		request.parsedExpression.push ({});
	},

	//----------------------------------------------------------------------------
	//	little helper functions
	//----------------------------------------------------------------------------

	T: function (s) {
		return s.toString().replace (/^\s+/, '').replace (/\s+$/, '');
	},

	G: function (tokens) {
		var v = tokens[0].v;
		tokens.shift();
		return v;
	},

	CG: function (tokens, tag) {
		if (tokens[0].t!=tag) return null;
		var v = tokens[0].v;
		tokens.shift();
		return v;
	},

	C: function (tokens, tag) {
		if (tokens[0].t!=tag) return false;
		tokens.shift();
		return true;
	},

	//----------------------------------------------------------------------------
	//	initialized arrays
	//----------------------------------------------------------------------------

	seasons: {
			summer: 2, winter: 4
		},

	months: {
			jan:  1, feb:  2, mar:  3, apr:  4, may:  5, jun:  6,
			jul:  7, aug:  8, sep:  9, oct: 10, nov: 11, dec: 12
		},

	weekdays: {
			su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6
		},

	movables: {
			easter: 'easter'
		},

	holidays: {
			sh: 'school', ph: 'public'
		},

	events: {
			sunrise: 'sunrise', sunset: 'sunset'
		},

	holidayDates: {},

	defaultRegion: 'de',

	//----------------------------------------------------------------------------
	//	error correction
	//----------------------------------------------------------------------------

	wrong_words: {
		'Please ommit "<ko>".': {
			h:		''
		}, 'Please use notation "<ok>" for "<ko>".': {
			to:		'-'
		}, 'Bitte verzichte auf "<ko>".': {
			uhr:		''
		}, 'Bitte benutze die Schreibweise "<ok>" für "<ko>".': {
			und:		','
		}, 'Bitte benutze die englische Abkürzung "<ok>" für "<ko>".': {
			feiertag:	'PH',
			feiertage:	'PH',
			feiertagen:	'PH'
		}, 'S\'il vous plaît utiliser "<ok>" pour "<ko>".': {
			'fermé':	'off',
			'et':		',',
			'à':		'-'
		}, 'Neem de engelse afkorting "<ok>" voor "<ko>" alstublieft.': {
			feestdag:	'PH',
			feestdagen:	'PH'
		}},

	wrong_seasons: {
		'Bitte benutze die englische Schreibweise "<ok>" für "<ko>".': {
			sommer:		2
		}},

	wrong_months: {
		'Please use the englisch abbreviation "<ok>" for "<ko>".': {
			january:	1,
			february:	2,
			march:		3,
			april:		4,
			may:		5,
			june:		6,
			july:		7,
			august:		8,
			september:	9,
			october:	10,
			november:	11,
			december:	12
		}, 'Bitte benutze die englische Abkürzung "<ok>" für "<ko>".': {
			januar:		1,
			februar:	2,
			märz:		3,
			maerz:		3,
			mai:		5,
			juni:		6,
			juli:		7,
			okt:		10,
			oktober:	10,
			dez:		12,
			dezember:	12
		}, 'S\'il vous plaît utiliser l\'abréviation "<ok>" pour "<ko>".': {
			janvier:	1,
			février:	2,
			fév:		2,
			mars:		3,
			avril:		4,
			avr:		4,
			mai:		5,
			juin:		6,
			juillet:	7,
			août:		8,
			aoû:		8,
			septembre:	9,
			octobre:	10,
			novembre:	11,
			décembre:	12
		}, 'Neem de engelse afkorting "<ok>" voor "<ko>" alstublieft.': {
			januari:	1,
			februari:	2,
			maart:		3,
			mei:		5,
			augustus:	8
		}},

	wrong_weekdays: {
		'Please use the abbreviation "<ok>" for "<ko>".': {
			sun:		0,
			sunday:		0,
			mon:		1,
			monday:		1,
			tue:		2,
			tuesday:	2,
			wed:		3,
			wednesday:	3,
			thu:		4,
			thursday:	4,
			fri:		5,
			friday:		5,
			sat:		6,
			saturday:	6
		}, 'Bitte benutze die englische Abkürzung "<ok>" für "<ko>".': {
			so:		0,
			son:		0,
			sonntag:	0,
			montag:		1,
			di:		2,
			die:		2,
			dienstag:	2,
			mi:		3,
			mit:		3,
			mittwoch:	3,
			'do':		4,
			don:		4,
			donnerstag:	4,
			fre:		5,
			freitag:	5,
			sam:		6,
			samstag:	6
		}, 'S\'il vous plaît utiliser l\'abréviation "<ok>" pour "<ko>".': {
			dim:		0,
			dimanche:	0,
			lu:		1,
			lun:		1,
			lundi:		1,
			mardi:		2,
			mer:		3,
			mercredi:	3,
			je:		4,
			jeu:		4,
			jeudi:		4,
			ve:		5,
			ven:		5,
			vendredi:	5,
			samedi:		6
		}, 'Neem de engelse afkorting "<ok>" voor "<ko>" alstublieft.': {
			zo:		0,
			zon:		0,
			zontag:		0,
			maandag:	1,
			din:		2,
			dinsdag:	2,
			wo:		3,
			woe:		3,
			woensdag:	3,
			donderdag:	4,
			vr:		5,
			vri:		5,
			vrijdag:	5,
			za:		6,
			zat:		6,
			zaterdag:	6
		}},

	//==============================================================================
	//
	//	DATE / TIME
	//
	//==============================================================================

	//----------------------------------------------------------------------------
	//	create timestamp from Data()-object or component-object
	//----------------------------------------------------------------------------

	createTimestamp: function (timestamp, offset, shift) {

		var result = {};
		var now    = new Date();

		if (timestamp==null) timestamp = now;

		if (timestamp.getSeconds) {
			//--------------------------------------------
			//	components from JS Date-object
			//--------------------------------------------
			result.S = timestamp.getSeconds();
			result.M = timestamp.getMinutes();
			result.H = timestamp.getHours();
			result.d = timestamp.getDate();
			result.m = timestamp.getMonth()+1;
			result.y = timestamp.getFullYear();
		} else {
			//--------------------------------------------
			//	parse components from input argument
			//--------------------------------------------
			result.S = parseInt(timestamp.S,10); if (isNaN(result.S)) result.S=0;
			result.M = parseInt(timestamp.M,10); if (isNaN(result.M)) result.M=0;
			result.H = parseInt(timestamp.H,10); if (isNaN(result.H)) result.H=0;
			result.d = parseInt(timestamp.d,10); if (isNaN(result.d)) result.d=1;
			result.m = parseInt(timestamp.m,10); if (isNaN(result.m)) result.m=1;
			result.y = isNaN (parseInt (timestamp.y, 10)) ?
				now.getFullYear() : (parseInt (timestamp.y, 10)+30)%100+1970;
		}

		//-----------------------------------------------------------
		//	offset is a real offset to the input argument time
		//-----------------------------------------------------------

		if (offset) result.S += offset;

		//-----------------------------------------------------------
		//	shift forces the hour to be >= 24
		//	used to implement day wrap
		//-----------------------------------------------------------

		if (shift ) result.H -= shift;

		//-----------------------------------------------------------
		//	normalize time
		//-----------------------------------------------------------

		var carry;
		carry = Math.floor (result.S / 60); result.S -= carry * 60; result.M += carry;
		carry = Math.floor (result.M / 60); result.M -= carry * 60; result.H += carry;
		carry = Math.floor (result.H / 24); result.H -= carry * 24; result.d += carry;

		//-----------------------------------------------------------
		//	normalize date
		//-----------------------------------------------------------

		if (result.d<1) {
			result.m--;
			result.d=this.E(result.y,result.m+1,1)-this.E(result.y,result.m,1);
		}
		if (this.E(result.y,result.m,result.d)>=this.E(result.y,result.m+1,1)) {
			result.m++; result.d=1;
		}
		if (result.m< 1) {
			result.y--;
			result.m=12;
		}
		if (result.m>12) {
			result.y++;
			result.m= 1;
		}

		//-----------------------------------------------------------
		//	shift forces the hour to be >= 24
		//	used to implement day wrap
		//-----------------------------------------------------------

		if (shift) result.H += shift;

		//-----------------------------------------------------------
		//	compute absolute day number and weekday
		//-----------------------------------------------------------

		result.s = this.E (result.y,1,1);
		result.e = this.E (result.y,result.m,result.d);
		result.w = this.W (result.e);
		result.l = this.L (result)+1;
		result.wy= result.y; var s = this.S (result.wy); if (result.e<s) s=this.S(--result.wy);
		result.yw= Math.floor((result.e-s)/7)+1;
		return result;
	},

	//----------------------------------------------------------------------------
	//	little helper functions
	//----------------------------------------------------------------------------

	E: function (y,m,d) {
		return 367*y - Math.floor (1.75 * (y + Math.floor ((m+9)/12))) +Math.floor(275*m/9) +d - 719574;
	},

	L: function (request) {
		return this.E(request.y, request.m+1, 1) - this.E(request.y, request.m, 1);
	},

	W: function (d) {
		return (d+4) % 7;
	},

	S: function (y) {
		var s = this.E (y, 1, 1);
		return s + (11-this.W(s))%7-3;
	},

	YW: function (y, d) {
		var s = this.S (y);
		if (d<s) s = this.S(--y);
		return {y: y, w: Math.floor((d-s)/7)+1};
	},

	//==============================================================================
	//
	//	Debug
	//
	//==============================================================================

	alertRule: function (tokens, name) {
		var result = [];
		for (var i in request.tokens) {
			result.push (tokens[i].t ? '{'+tokens[i].s+'}' : ';');
		}
		alert ((name||'')+'['+tokens.length+']:\n'+result.join(' '));
	},

	alertTokens: function (o) {
		var result = [];
		for (var tag in o) {
			result.push (o[tag].s);
		}
		alert (result.join(' '));
	},

	text: function (obj, name) {
		if (obj==null) return name+': Ø';
		var type = typeof(obj);
		if (type != 'object') return name+': '+obj+' ['+type+']';
		if (obj.getTime) return name+': '+obj.toLocaleString()+' [Date]';
		var result = [];
		result.push (name+': object');
		for (var tag in obj) {
			result.push (this.text(obj[tag], name+'.'+tag));
		}
		return result.join('\n');
	},

	alertObject: function (obj, name) {
		if (name==null) name='*';
		alert (this.text(obj, name));
	}
};

//--------------------------------------------------------------------------------
//	$Id: time_domain.js,v 1.56 2011/08/10 20:26:06 wolf Exp wolf $
//--------------------------------------------------------------------------------
