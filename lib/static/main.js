(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var templater = require("handlebars/runtime").default.template;module.exports = templater(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<article class='entry' data-name='";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' data-version='";
  if (helper = helpers.version) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.version); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\r\n	<h3>\r\n		<a class='name icon-angle-right' href='javascript:void(0)'>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\r\n		<small class='version'>v";
  if (helper = helpers.version) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.version); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</small>\r\n		<div class='author'>By: "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0._npmUser)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\r\n	</h3>\r\n	<p>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n</article>";
  return buffer;
  });
},{"handlebars/runtime":12}],2:[function(require,module,exports){
"use strict";
var $ = require('unopinionate').selector,
	onClick = require('onclick'),
	transitionComplete = require('transition-complete');

$(function() {
	onClick('.entry .name', function() {
		var $this = $(this),
			$entry = $this.closest('.entry');

		//Close entry
		if($entry.hasClass('open')) {
			$entry
				.height($entry.height())
				.removeClass('open');

			setTimeout(function() {
				$entry.css('height', $entry.attr('data-height') + 'px');
			}, 0);

            transitionComplete(function() {
				$entry.find('.readme').remove();
				$entry.css('height', 'auto');
			});
		}
		//Open entry
		else {
			//Close open entries
			$('.entry.open').each(function() {
				var $entry = $(this);
				$entry
                    .height($entry.height())
                    .removeClass('open');

                setTimeout(function() {
                    $entry.css('height', $entry.attr('data-height') + 'px');
                }, 0);

                transitionComplete(function() {
                    $entry.find('.readme').remove();
                    $entry.css('height', 'auto');
                });
			});

			//Add the open class
			$entry.addClass('open');

			//Explicitly set heights for transitions
			var height = $entry.height();
			$entry
				.attr('data-height', height)
				.css('height', height);

			//Get the data
			$.ajax({
				url: '/-/readme/'+$entry.attr('data-name')+'/'+$entry.attr('data-version'),
				dataType: 'text',
				success: function(html) {
					var $readme = $("<div class='readme'>")
						.html(html)
						.appendTo($entry);

					$entry.height(height + $readme.outerHeight());

					transitionComplete(function() {
						$entry.css('height', 'auto');
					});
				}
			});
		}
	});
});
},{"onclick":13,"transition-complete":15,"unopinionate":16}],3:[function(require,module,exports){
require('./search');
require('./entry');
require('./header');
},{"./entry":2,"./header":4,"./search":5}],4:[function(require,module,exports){
/* global window */
"use strict";
var $ = require('unopinionate').selector,
	onScroll = require('onscroll');

$(function() {
	var $header = $('header'),
		$content = $('#content'),
		bottomOffset = 52;

	var scrollFunc = function(top) {
		var limit =  $header.outerHeight() - bottomOffset;

		if(top < 0) {
			$header.css('top', 0);
		}
		else if(top > limit) {
			$header.css('top', -limit + 'px');
		}
		else {
			$header.css('top', -top + 'px');
		}
	};

	onScroll(scrollFunc);
	scrollFunc();

	$(window).resize(function() {
		$content.css('margin-top', $header.outerHeight());
	}).resize();
});
},{"onscroll":14,"unopinionate":16}],5:[function(require,module,exports){
"use strict";
var $ = require('unopinionate').selector,
	template = require('../entry.hbs');

require('onscroll'); // jshint ignore:line

$(function() {

	var $form	= $('#search-form'),
		$input	= $form.find('input'),
		$searchResults = $("#search-results"),
		$body	= $('body'),
		$clear	= $form.find('.clear'),
		request,
		currentResults;

	$form.bind('submit keyup', function(e) {
		e.preventDefault();

		var q = $input.val();

		$body.addClass('state-search');

		//Switch the icons
		$clear
			[q  ? 'addClass' : 'removeClass']('icon-cancel')
			[!q ? 'addClass' : 'removeClass']('icon-search');

		if(q) {
			if(request) {
				request.abort();
			}

			if(!currentResults) {
				$searchResults.html("<img class='search-ajax' src='/-/static/ajax.gif' alt='Spinner'/>");
			}

			request = $.getJSON('/-/search/' + q, function(results) {
				currentResults = results;

				if(results.length) {
					var html = '';

                    $.each(results, function(i, entry) {
                        html += template(entry);
					});

					$searchResults.html(html);
				}
				else {
					$searchResults.html("<div class='no-results'><big>No Results</big></div>");
				}
			});
		}
		else {
            request.abort();
			currentResults = null;
			$searchResults.html('');
			$body.removeClass('state-search');
		}
	});

	$clear.click(function(e) {
		e.preventDefault();
		$input.val('');
		$form.keyup();
	});

});

},{"../entry.hbs":1,"onscroll":14,"unopinionate":16}],6:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":7,"./handlebars/exception":8,"./handlebars/runtime":9,"./handlebars/safe-string":10,"./handlebars/utils":11}],7:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":8,"./utils":11}],8:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],9:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":7,"./exception":8,"./utils":11}],10:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],11:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":10}],12:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":6}],13:[function(require,module,exports){
var $ = require('unopinionate').selector;

var $document   = $(document),
    bindings    = {};

var click = function(events) {
    click.bind.apply(click, arguments);
    return click;
};

/*** Configuration Options ***/
click.distanceLimit = 10;
click.timeLimit     = 140;

/*** Useful Properties ***/
click.isTouch = ('ontouchstart' in window) ||
                window.DocumentTouch &&
                document instanceof DocumentTouch;

/*** Cached Functions ***/
var onTouchstart = function(e) {
    e.stopPropagation(); //Prevents multiple click events from happening

    click._doAnywheres(e);

    var $this       = $(this),
        startTime   = new Date().getTime(),
        startPos    = click._getPos(e);

    $this.one('touchend', function(e) {
        e.preventDefault(); //Prevents click event from firing
        
        var time        = new Date().getTime() - startTime,
            endPos      = click._getPos(e),
            distance    = Math.sqrt(
                Math.pow(endPos.x - startPos.x, 2) +
                Math.pow(endPos.y - startPos.y, 2)
            );

        if(time < click.timeLimit && distance < click.distanceLimit) {
            //Find the correct callback
            $.each(bindings, function(selector, callback) {
                if($this.is(selector)) {
                    callback.apply(e.target, [e]);
                    return false;
                }
            });
        }
    });
};

/*** API ***/
click.bind = function(events) {

    //Argument Surgery
    if(!$.isPlainObject(events)) {
        newEvents = {};
        newEvents[arguments[0]] = arguments[1];
        events = newEvents;
    }

    $.each(events, function(selector, callback) {

        /*** Register Binding ***/
        if(typeof bindings[selector] != 'undefined') {
            click.unbind(selector); //Ensure no duplicates
        }
        
        bindings[selector] = callback;

        /*** Touch Support ***/
        if(click.isTouch) {
            $document.delegate(selector, 'touchstart', onTouchstart);
        }

        /*** Mouse Support ***/
        $document.delegate(selector, 'click', function(e) {
            e.stopPropagation(); //Prevents multiple click events from happening
            //click._doAnywheres(e); //Do anywheres first to be consistent with touch order
            callback.apply(this, [e]);
        });
    });

    return this;
};

click.unbind = function(selector) {
    $document
        .undelegate(selector, 'touchstart')
        .undelegate(selector, 'click');

    delete bindings[selector];

    return this;
};

click.unbindAll = function() {
    $.each(bindings, function(selector, callback) {
        $document
            .undelegate(selector, 'touchstart')
            .undelegate(selector, 'click');
    });
    
    bindings = {};

    return this;
};

click.trigger = function(selector, e) {
    e = e || $.Event('click');

    if(typeof bindings[selector] != 'undefined') {
        bindings[selector](e);
    }
    else {
        console.error("No click events bound for selector '"+selector+"'.");
    }

    return this;
};

click.anywhere = function(callback) {
    click._anywheres.push(callback);
    return this;
};

/*** Internal (but useful) Methods ***/
click._getPos = function(e) {
    e = e.originalEvent;

    if(e.pageX || e.pageY) {
        return {
            x: e.pageX,
            y: e.pageY
        };
    }
    else if(e.changedTouches) {
        return {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
    }
    else {
        return {
            x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            y: e.clientY + document.body.scrollTop  + document.documentElement.scrollTop
        };
    }
};

click._anywheres = [];

click._doAnywheres = function(e) {
    var i = click._anywheres.length;
    while(i--) {
        click._anywheres[i](e);
    }
};

$(document).bind('mousedown', click._doAnywheres);

module.exports = click;


},{"unopinionate":16}],14:[function(require,module,exports){
var $ = require('unopinionate').selector;

var bodyScrollers = [];

$(function() {
    var $html = $('html'),
        $body = $('body');

    $(window, document, 'body').bind('scroll touchmove', function() {
        var top = $html[0].scrollTop || $body[0].scrollTop;

        for(var i=0; i<bodyScrollers.length; i++) {
            bodyScrollers[i](top);
        }
    });
});

var onScroll = function(callback) {
    bodyScrollers.push(callback);
};

module.exports = onScroll;
},{"unopinionate":16}],15:[function(require,module,exports){
(function(root) {
    var callbacks = [];

    var transitionComplete = function(callback) {
        if(callbacks.length === 0) {
            setEvent();
        }

        callbacks.push(callback);
    };

    function setEvent() {
        document.addEventListener(eventName(), function() {
            var i = callbacks.length;
            while(i--) {
                callbacks[i]();
            }

            callbacks = [];
        });
    }

    var _eventName;

    function eventName() {
        if(!_eventName) {
            // Sourced from: http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers
            var el = document.createElement('fakeelement');
                transitions = {
                    transition:       'transitionend',
                    OTransition:      'oTransitionEnd',
                    MozTransition:    'transitionend',
                    WebkitTransition: 'webkitTransitionEnd'
                };

            for(var t in transitions) {
                if(el.style[t] !== undefined) {
                    _eventName = transitions[t];
                }
            }
        }

        return _eventName;
    }
    
    /*** Export ***/

    // AMD
    if(typeof define === 'function' && define.amd) {
        define([], function() {
          return transitionComplete;
        });
    }
    // CommonJS
    else if(typeof exports !== 'undefined') {
        module.exports = transitionComplete;
    }
    // Browser Global
    else {
        root.transitionComplete = transitionComplete;
    }
})(this);

},{}],16:[function(require,module,exports){
(function (global){
(function(root) {
    var unopinionate = {
        selector: root.jQuery || root.Zepto || root.ender || root.$,
        template: root.Handlebars || root.Mustache
    };

    /*** Export ***/

    //AMD
    if(typeof define === 'function' && define.amd) {
        define([], function() {
            return unopinionate;
        });
    }
    //CommonJS
    else if(typeof module.exports !== 'undefined') {
        module.exports = unopinionate;
    }
    //Global
    else {
        root.unopinionate = unopinionate;
    }
})(typeof window != 'undefined' ? window : global);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxBdGxhc3NpYW5cXE5QTVxcc2lub3BpYVxcbm9kZV9tb2R1bGVzXFxndWxwLWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL2xpYi9HVUkvZW50cnkuaGJzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL2xpYi9HVUkvanMvZW50cnkuanMiLCJDOi9BdGxhc3NpYW4vTlBNL3Npbm9waWEvbGliL0dVSS9qcy9mYWtlXzM0ODI4MmVmLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL2xpYi9HVUkvanMvaGVhZGVyLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL2xpYi9HVUkvanMvc2VhcmNoLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIkM6L0F0bGFzc2lhbi9OUE0vc2lub3BpYS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2Jhc2UuanMiLCJDOi9BdGxhc3NpYW4vTlBNL3Npbm9waWEvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9leGNlcHRpb24uanMiLCJDOi9BdGxhc3NpYW4vTlBNL3Npbm9waWEvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMvc2FmZS1zdHJpbmcuanMiLCJDOi9BdGxhc3NpYW4vTlBNL3Npbm9waWEvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy91dGlscy5qcyIsIkM6L0F0bGFzc2lhbi9OUE0vc2lub3BpYS9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL25vZGVfbW9kdWxlcy9vbmNsaWNrL3NyYy9vbkNsaWNrLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL25vZGVfbW9kdWxlcy9vbnNjcm9sbC9vblNjcm9sbC5qcyIsIkM6L0F0bGFzc2lhbi9OUE0vc2lub3BpYS9ub2RlX21vZHVsZXMvdHJhbnNpdGlvbi1jb21wbGV0ZS90cmFuc2l0aW9uLWNvbXBsZXRlLmpzIiwiQzovQXRsYXNzaWFuL05QTS9zaW5vcGlhL25vZGVfbW9kdWxlcy91bm9waW5pb25hdGUvdW5vcGluaW9uYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdGVtcGxhdGVyID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKS5kZWZhdWx0LnRlbXBsYXRlO21vZHVsZS5leHBvcnRzID0gdGVtcGxhdGVyKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uO1xuXG5cbiAgYnVmZmVyICs9IFwiPGFydGljbGUgY2xhc3M9J2VudHJ5JyBkYXRhLW5hbWU9J1wiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5uYW1lKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLm5hbWUpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiJyBkYXRhLXZlcnNpb249J1wiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy52ZXJzaW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnZlcnNpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiJz5cXHJcXG5cdDxoMz5cXHJcXG5cdFx0PGEgY2xhc3M9J25hbWUgaWNvbi1hbmdsZS1yaWdodCcgaHJlZj0namF2YXNjcmlwdDp2b2lkKDApJz5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMubmFtZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5uYW1lKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvYT5cXHJcXG5cdFx0PHNtYWxsIGNsYXNzPSd2ZXJzaW9uJz52XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnZlcnNpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAudmVyc2lvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L3NtYWxsPlxcclxcblx0XHQ8ZGl2IGNsYXNzPSdhdXRob3InPkJ5OiBcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9ICgoc3RhY2sxID0gKGRlcHRoMCAmJiBkZXB0aDAuX25wbVVzZXIpKSxzdGFjazEgPT0gbnVsbCB8fCBzdGFjazEgPT09IGZhbHNlID8gc3RhY2sxIDogc3RhY2sxLm5hbWUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIjwvZGl2Plxcclxcblx0PC9oMz5cXHJcXG5cdDxwPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5kZXNjcmlwdGlvbikgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5kZXNjcmlwdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L3A+XFxyXFxuPC9hcnRpY2xlPlwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTsiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyICQgPSByZXF1aXJlKCd1bm9waW5pb25hdGUnKS5zZWxlY3RvcixcclxuXHRvbkNsaWNrID0gcmVxdWlyZSgnb25jbGljaycpLFxyXG5cdHRyYW5zaXRpb25Db21wbGV0ZSA9IHJlcXVpcmUoJ3RyYW5zaXRpb24tY29tcGxldGUnKTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcblx0b25DbGljaygnLmVudHJ5IC5uYW1lJywgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHQkZW50cnkgPSAkdGhpcy5jbG9zZXN0KCcuZW50cnknKTtcclxuXHJcblx0XHQvL0Nsb3NlIGVudHJ5XHJcblx0XHRpZigkZW50cnkuaGFzQ2xhc3MoJ29wZW4nKSkge1xyXG5cdFx0XHQkZW50cnlcclxuXHRcdFx0XHQuaGVpZ2h0KCRlbnRyeS5oZWlnaHQoKSlcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JGVudHJ5LmNzcygnaGVpZ2h0JywgJGVudHJ5LmF0dHIoJ2RhdGEtaGVpZ2h0JykgKyAncHgnKTtcclxuXHRcdFx0fSwgMCk7XHJcblxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uQ29tcGxldGUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JGVudHJ5LmZpbmQoJy5yZWFkbWUnKS5yZW1vdmUoKTtcclxuXHRcdFx0XHQkZW50cnkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdC8vT3BlbiBlbnRyeVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdC8vQ2xvc2Ugb3BlbiBlbnRyaWVzXHJcblx0XHRcdCQoJy5lbnRyeS5vcGVuJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJGVudHJ5ID0gJCh0aGlzKTtcclxuXHRcdFx0XHQkZW50cnlcclxuICAgICAgICAgICAgICAgICAgICAuaGVpZ2h0KCRlbnRyeS5oZWlnaHQoKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRlbnRyeS5jc3MoJ2hlaWdodCcsICRlbnRyeS5hdHRyKCdkYXRhLWhlaWdodCcpICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uQ29tcGxldGUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVudHJ5LmZpbmQoJy5yZWFkbWUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAkZW50cnkuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly9BZGQgdGhlIG9wZW4gY2xhc3NcclxuXHRcdFx0JGVudHJ5LmFkZENsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0XHQvL0V4cGxpY2l0bHkgc2V0IGhlaWdodHMgZm9yIHRyYW5zaXRpb25zXHJcblx0XHRcdHZhciBoZWlnaHQgPSAkZW50cnkuaGVpZ2h0KCk7XHJcblx0XHRcdCRlbnRyeVxyXG5cdFx0XHRcdC5hdHRyKCdkYXRhLWhlaWdodCcsIGhlaWdodClcclxuXHRcdFx0XHQuY3NzKCdoZWlnaHQnLCBoZWlnaHQpO1xyXG5cclxuXHRcdFx0Ly9HZXQgdGhlIGRhdGFcclxuXHRcdFx0JC5hamF4KHtcclxuXHRcdFx0XHR1cmw6ICcvLS9yZWFkbWUvJyskZW50cnkuYXR0cignZGF0YS1uYW1lJykrJy8nKyRlbnRyeS5hdHRyKCdkYXRhLXZlcnNpb24nKSxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ3RleHQnLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGh0bWwpIHtcclxuXHRcdFx0XHRcdHZhciAkcmVhZG1lID0gJChcIjxkaXYgY2xhc3M9J3JlYWRtZSc+XCIpXHJcblx0XHRcdFx0XHRcdC5odG1sKGh0bWwpXHJcblx0XHRcdFx0XHRcdC5hcHBlbmRUbygkZW50cnkpO1xyXG5cclxuXHRcdFx0XHRcdCRlbnRyeS5oZWlnaHQoaGVpZ2h0ICsgJHJlYWRtZS5vdXRlckhlaWdodCgpKTtcclxuXHJcblx0XHRcdFx0XHR0cmFuc2l0aW9uQ29tcGxldGUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdCRlbnRyeS5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59KTsiLCJyZXF1aXJlKCcuL3NlYXJjaCcpO1xyXG5yZXF1aXJlKCcuL2VudHJ5Jyk7XHJcbnJlcXVpcmUoJy4vaGVhZGVyJyk7IiwiLyogZ2xvYmFsIHdpbmRvdyAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxudmFyICQgPSByZXF1aXJlKCd1bm9waW5pb25hdGUnKS5zZWxlY3RvcixcclxuXHRvblNjcm9sbCA9IHJlcXVpcmUoJ29uc2Nyb2xsJyk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG5cdHZhciAkaGVhZGVyID0gJCgnaGVhZGVyJyksXHJcblx0XHQkY29udGVudCA9ICQoJyNjb250ZW50JyksXHJcblx0XHRib3R0b21PZmZzZXQgPSA1MjtcclxuXHJcblx0dmFyIHNjcm9sbEZ1bmMgPSBmdW5jdGlvbih0b3ApIHtcclxuXHRcdHZhciBsaW1pdCA9ICAkaGVhZGVyLm91dGVySGVpZ2h0KCkgLSBib3R0b21PZmZzZXQ7XHJcblxyXG5cdFx0aWYodG9wIDwgMCkge1xyXG5cdFx0XHQkaGVhZGVyLmNzcygndG9wJywgMCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmKHRvcCA+IGxpbWl0KSB7XHJcblx0XHRcdCRoZWFkZXIuY3NzKCd0b3AnLCAtbGltaXQgKyAncHgnKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQkaGVhZGVyLmNzcygndG9wJywgLXRvcCArICdweCcpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG9uU2Nyb2xsKHNjcm9sbEZ1bmMpO1xyXG5cdHNjcm9sbEZ1bmMoKTtcclxuXHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdCRjb250ZW50LmNzcygnbWFyZ2luLXRvcCcsICRoZWFkZXIub3V0ZXJIZWlnaHQoKSk7XHJcblx0fSkucmVzaXplKCk7XHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgJCA9IHJlcXVpcmUoJ3Vub3BpbmlvbmF0ZScpLnNlbGVjdG9yLFxyXG5cdHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vZW50cnkuaGJzJyk7XHJcblxyXG5yZXF1aXJlKCdvbnNjcm9sbCcpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcblxyXG5cdHZhciAkZm9ybVx0PSAkKCcjc2VhcmNoLWZvcm0nKSxcclxuXHRcdCRpbnB1dFx0PSAkZm9ybS5maW5kKCdpbnB1dCcpLFxyXG5cdFx0JHNlYXJjaFJlc3VsdHMgPSAkKFwiI3NlYXJjaC1yZXN1bHRzXCIpLFxyXG5cdFx0JGJvZHlcdD0gJCgnYm9keScpLFxyXG5cdFx0JGNsZWFyXHQ9ICRmb3JtLmZpbmQoJy5jbGVhcicpLFxyXG5cdFx0cmVxdWVzdCxcclxuXHRcdGN1cnJlbnRSZXN1bHRzO1xyXG5cclxuXHQkZm9ybS5iaW5kKCdzdWJtaXQga2V5dXAnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIHEgPSAkaW5wdXQudmFsKCk7XHJcblxyXG5cdFx0JGJvZHkuYWRkQ2xhc3MoJ3N0YXRlLXNlYXJjaCcpO1xyXG5cclxuXHRcdC8vU3dpdGNoIHRoZSBpY29uc1xyXG5cdFx0JGNsZWFyXHJcblx0XHRcdFtxICA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXSgnaWNvbi1jYW5jZWwnKVxyXG5cdFx0XHRbIXEgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oJ2ljb24tc2VhcmNoJyk7XHJcblxyXG5cdFx0aWYocSkge1xyXG5cdFx0XHRpZihyZXF1ZXN0KSB7XHJcblx0XHRcdFx0cmVxdWVzdC5hYm9ydCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZighY3VycmVudFJlc3VsdHMpIHtcclxuXHRcdFx0XHQkc2VhcmNoUmVzdWx0cy5odG1sKFwiPGltZyBjbGFzcz0nc2VhcmNoLWFqYXgnIHNyYz0nLy0vc3RhdGljL2FqYXguZ2lmJyBhbHQ9J1NwaW5uZXInLz5cIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlcXVlc3QgPSAkLmdldEpTT04oJy8tL3NlYXJjaC8nICsgcSwgZnVuY3Rpb24ocmVzdWx0cykge1xyXG5cdFx0XHRcdGN1cnJlbnRSZXN1bHRzID0gcmVzdWx0cztcclxuXHJcblx0XHRcdFx0aWYocmVzdWx0cy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdHZhciBodG1sID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChyZXN1bHRzLCBmdW5jdGlvbihpLCBlbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IHRlbXBsYXRlKGVudHJ5KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdCRzZWFyY2hSZXN1bHRzLmh0bWwoaHRtbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0JHNlYXJjaFJlc3VsdHMuaHRtbChcIjxkaXYgY2xhc3M9J25vLXJlc3VsdHMnPjxiaWc+Tm8gUmVzdWx0czwvYmlnPjwvZGl2PlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcclxuXHRcdFx0Y3VycmVudFJlc3VsdHMgPSBudWxsO1xyXG5cdFx0XHQkc2VhcmNoUmVzdWx0cy5odG1sKCcnKTtcclxuXHRcdFx0JGJvZHkucmVtb3ZlQ2xhc3MoJ3N0YXRlLXNlYXJjaCcpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkY2xlYXIuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0JGlucHV0LnZhbCgnJyk7XHJcblx0XHQkZm9ybS5rZXl1cCgpO1xyXG5cdH0pO1xyXG5cclxufSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuLypnbG9iYWxzIEhhbmRsZWJhcnM6IHRydWUgKi9cbnZhciBiYXNlID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9iYXNlXCIpO1xuXG4vLyBFYWNoIG9mIHRoZXNlIGF1Z21lbnQgdGhlIEhhbmRsZWJhcnMgb2JqZWN0LiBObyBuZWVkIHRvIHNldHVwIGhlcmUuXG4vLyAoVGhpcyBpcyBkb25lIHRvIGVhc2lseSBzaGFyZSBjb2RlIGJldHdlZW4gY29tbW9uanMgYW5kIGJyb3dzZSBlbnZzKVxudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nXCIpW1wiZGVmYXVsdFwiXTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3V0aWxzXCIpO1xudmFyIHJ1bnRpbWUgPSByZXF1aXJlKFwiLi9oYW5kbGViYXJzL3J1bnRpbWVcIik7XG5cbi8vIEZvciBjb21wYXRpYmlsaXR5IGFuZCB1c2FnZSBvdXRzaWRlIG9mIG1vZHVsZSBzeXN0ZW1zLCBtYWtlIHRoZSBIYW5kbGViYXJzIG9iamVjdCBhIG5hbWVzcGFjZVxudmFyIGNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaGIgPSBuZXcgYmFzZS5IYW5kbGViYXJzRW52aXJvbm1lbnQoKTtcblxuICBVdGlscy5leHRlbmQoaGIsIGJhc2UpO1xuICBoYi5TYWZlU3RyaW5nID0gU2FmZVN0cmluZztcbiAgaGIuRXhjZXB0aW9uID0gRXhjZXB0aW9uO1xuICBoYi5VdGlscyA9IFV0aWxzO1xuXG4gIGhiLlZNID0gcnVudGltZTtcbiAgaGIudGVtcGxhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHJ1bnRpbWUudGVtcGxhdGUoc3BlYywgaGIpO1xuICB9O1xuXG4gIHJldHVybiBoYjtcbn07XG5cbnZhciBIYW5kbGViYXJzID0gY3JlYXRlKCk7XG5IYW5kbGViYXJzLmNyZWF0ZSA9IGNyZWF0ZTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBIYW5kbGViYXJzOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vZXhjZXB0aW9uXCIpW1wiZGVmYXVsdFwiXTtcblxudmFyIFZFUlNJT04gPSBcIjEuMy4wXCI7XG5leHBvcnRzLlZFUlNJT04gPSBWRVJTSU9OO3ZhciBDT01QSUxFUl9SRVZJU0lPTiA9IDQ7XG5leHBvcnRzLkNPTVBJTEVSX1JFVklTSU9OID0gQ09NUElMRVJfUkVWSVNJT047XG52YXIgUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc+PSAxLjAuMCdcbn07XG5leHBvcnRzLlJFVklTSU9OX0NIQU5HRVMgPSBSRVZJU0lPTl9DSEFOR0VTO1xudmFyIGlzQXJyYXkgPSBVdGlscy5pc0FycmF5LFxuICAgIGlzRnVuY3Rpb24gPSBVdGlscy5pc0Z1bmN0aW9uLFxuICAgIHRvU3RyaW5nID0gVXRpbHMudG9TdHJpbmcsXG4gICAgb2JqZWN0VHlwZSA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG5mdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG59XG5cbmV4cG9ydHMuSGFuZGxlYmFyc0Vudmlyb25tZW50ID0gSGFuZGxlYmFyc0Vudmlyb25tZW50O0hhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nLFxuXG4gIHJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lLCBmbiwgaW52ZXJzZSkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBpZiAoaW52ZXJzZSB8fCBmbikgeyB0aHJvdyBuZXcgRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnZlcnNlKSB7IGZuLm5vdCA9IGludmVyc2U7IH1cbiAgICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICAgIH1cbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHN0cikge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgICBVdGlscy5leHRlbmQodGhpcy5wYXJ0aWFscywgIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gc3RyO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0SGVscGVycyhpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGFyZykge1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJNaXNzaW5nIGhlbHBlcjogJ1wiICsgYXJnICsgXCInXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2Jsb2NrSGVscGVyTWlzc2luZycsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZSB8fCBmdW5jdGlvbigpIHt9LCBmbiA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmKGNvbnRleHQgPT09IGZhbHNlIHx8IGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbnRleHQpKSB7XG4gICAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4oY29udGV4dCk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZm4gPSBvcHRpb25zLmZuLCBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlO1xuICAgIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGlmKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaTxqOyBpKyspIHtcbiAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgZGF0YS5sYXN0ICA9IChpID09PSAoY29udGV4dC5sZW5ndGgtMSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2ldLCB7IGRhdGE6IGRhdGEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcih2YXIga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZihjb250ZXh0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmKGRhdGEpIHsgXG4gICAgICAgICAgICAgIGRhdGEua2V5ID0ga2V5OyBcbiAgICAgICAgICAgICAgZGF0YS5pbmRleCA9IGk7XG4gICAgICAgICAgICAgIGRhdGEuZmlyc3QgPSAoaSA9PT0gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtkYXRhOiBkYXRhfSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoaSA9PT0gMCl7XG4gICAgICByZXQgPSBpbnZlcnNlKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdpZicsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uYWwpKSB7IGNvbmRpdGlvbmFsID0gY29uZGl0aW9uYWwuY2FsbCh0aGlzKTsgfVxuXG4gICAgLy8gRGVmYXVsdCBiZWhhdmlvciBpcyB0byByZW5kZXIgdGhlIHBvc2l0aXZlIHBhdGggaWYgdGhlIHZhbHVlIGlzIHRydXRoeSBhbmQgbm90IGVtcHR5LlxuICAgIC8vIFRoZSBgaW5jbHVkZVplcm9gIG9wdGlvbiBtYXkgYmUgc2V0IHRvIHRyZWF0IHRoZSBjb25kdGlvbmFsIGFzIHB1cmVseSBub3QgZW1wdHkgYmFzZWQgb24gdGhlXG4gICAgLy8gYmVoYXZpb3Igb2YgaXNFbXB0eS4gRWZmZWN0aXZlbHkgdGhpcyBkZXRlcm1pbmVzIGlmIDAgaXMgaGFuZGxlZCBieSB0aGUgcG9zaXRpdmUgcGF0aCBvciBuZWdhdGl2ZS5cbiAgICBpZiAoKCFvcHRpb25zLmhhc2guaW5jbHVkZVplcm8gJiYgIWNvbmRpdGlvbmFsKSB8fCBVdGlscy5pc0VtcHR5KGNvbmRpdGlvbmFsKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuaW52ZXJzZSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZm4odGhpcyk7XG4gICAgfVxuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbiwgaGFzaDogb3B0aW9ucy5oYXNofSk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCd3aXRoJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmICghVXRpbHMuaXNFbXB0eShjb250ZXh0KSkgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdsb2cnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGxldmVsID0gb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuZGF0YS5sZXZlbCAhPSBudWxsID8gcGFyc2VJbnQob3B0aW9ucy5kYXRhLmxldmVsLCAxMCkgOiAxO1xuICAgIGluc3RhbmNlLmxvZyhsZXZlbCwgY29udGV4dCk7XG4gIH0pO1xufVxuXG52YXIgbG9nZ2VyID0ge1xuICBtZXRob2RNYXA6IHsgMDogJ2RlYnVnJywgMTogJ2luZm8nLCAyOiAnd2FybicsIDM6ICdlcnJvcicgfSxcblxuICAvLyBTdGF0ZSBlbnVtXG4gIERFQlVHOiAwLFxuICBJTkZPOiAxLFxuICBXQVJOOiAyLFxuICBFUlJPUjogMyxcbiAgbGV2ZWw6IDMsXG5cbiAgLy8gY2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgb2JqKSB7XG4gICAgaWYgKGxvZ2dlci5sZXZlbCA8PSBsZXZlbCkge1xuICAgICAgdmFyIG1ldGhvZCA9IGxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgY29uc29sZVttZXRob2RdLmNhbGwoY29uc29sZSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5leHBvcnRzLmxvZ2dlciA9IGxvZ2dlcjtcbmZ1bmN0aW9uIGxvZyhsZXZlbCwgb2JqKSB7IGxvZ2dlci5sb2cobGV2ZWwsIG9iaik7IH1cblxuZXhwb3J0cy5sb2cgPSBsb2c7dmFyIGNyZWF0ZUZyYW1lID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBvYmogPSB7fTtcbiAgVXRpbHMuZXh0ZW5kKG9iaiwgb2JqZWN0KTtcbiAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmNyZWF0ZUZyYW1lID0gY3JlYXRlRnJhbWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgdmFyIGxpbmU7XG4gIGlmIChub2RlICYmIG5vZGUuZmlyc3RMaW5lKSB7XG4gICAgbGluZSA9IG5vZGUuZmlyc3RMaW5lO1xuXG4gICAgbWVzc2FnZSArPSAnIC0gJyArIGxpbmUgKyAnOicgKyBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG5cbiAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG1lc3NhZ2UpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxuXG4gIGlmIChsaW5lKSB7XG4gICAgdGhpcy5saW5lTnVtYmVyID0gbGluZTtcbiAgICB0aGlzLmNvbHVtbiA9IG5vZGUuZmlyc3RDb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4Y2VwdGlvbjsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG52YXIgQ09NUElMRVJfUkVWSVNJT04gPSByZXF1aXJlKFwiLi9iYXNlXCIpLkNPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSByZXF1aXJlKFwiLi9iYXNlXCIpLlJFVklTSU9OX0NIQU5HRVM7XG5cbmZ1bmN0aW9uIGNoZWNrUmV2aXNpb24oY29tcGlsZXJJbmZvKSB7XG4gIHZhciBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgY3VycmVudFJldmlzaW9uID0gQ09NUElMRVJfUkVWSVNJT047XG5cbiAgaWYgKGNvbXBpbGVyUmV2aXNpb24gIT09IGN1cnJlbnRSZXZpc2lvbikge1xuICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICB2YXIgcnVudGltZVZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRlbXBsYXRlIHdhcyBwcmVjb21waWxlZCB3aXRoIGFuIG9sZGVyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVc2UgdGhlIGVtYmVkZGVkIHZlcnNpb24gaW5mbyBzaW5jZSB0aGUgcnVudGltZSBkb2Vzbid0IGtub3cgYWJvdXQgdGhpcyByZXZpc2lvbiB5ZXRcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcnVudGltZSB0byBhIG5ld2VyIHZlcnNpb24gKFwiK2NvbXBpbGVySW5mb1sxXStcIikuXCIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmNoZWNrUmV2aXNpb24gPSBjaGVja1JldmlzaW9uOy8vIFRPRE86IFJlbW92ZSB0aGlzIGxpbmUgYW5kIGJyZWFrIHVwIGNvbXBpbGVQYXJ0aWFsXG5cbmZ1bmN0aW9uIHRlbXBsYXRlKHRlbXBsYXRlU3BlYywgZW52KSB7XG4gIGlmICghZW52KSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk5vIGVudmlyb25tZW50IHBhc3NlZCB0byB0ZW1wbGF0ZVwiKTtcbiAgfVxuXG4gIC8vIE5vdGU6IFVzaW5nIGVudi5WTSByZWZlcmVuY2VzIHJhdGhlciB0aGFuIGxvY2FsIHZhciByZWZlcmVuY2VzIHRocm91Z2hvdXQgdGhpcyBzZWN0aW9uIHRvIGFsbG93XG4gIC8vIGZvciBleHRlcm5hbCB1c2VycyB0byBvdmVycmlkZSB0aGVzZSBhcyBwc3VlZG8tc3VwcG9ydGVkIEFQSXMuXG4gIHZhciBpbnZva2VQYXJ0aWFsV3JhcHBlciA9IGZ1bmN0aW9uKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7IHJldHVybiByZXN1bHQ7IH1cblxuICAgIGlmIChlbnYuY29tcGlsZSkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7IGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuICAgICAgcGFydGlhbHNbbmFtZV0gPSBlbnYuY29tcGlsZShwYXJ0aWFsLCB7IGRhdGE6IGRhdGEgIT09IHVuZGVmaW5lZCB9LCBlbnYpO1xuICAgICAgcmV0dXJuIHBhcnRpYWxzW25hbWVdKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSnVzdCBhZGQgd2F0ZXJcbiAgdmFyIGNvbnRhaW5lciA9IHtcbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgICAgdmFyIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXTtcbiAgICAgIGlmKGRhdGEpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSBwcm9ncmFtKGksIGZuLCBkYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoIXByb2dyYW1XcmFwcGVyKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IHByb2dyYW0oaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKHBhcmFtLCBjb21tb24pIHtcbiAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgIGlmIChwYXJhbSAmJiBjb21tb24gJiYgKHBhcmFtICE9PSBjb21tb24pKSB7XG4gICAgICAgIHJldCA9IHt9O1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBjb21tb24pO1xuICAgICAgICBVdGlscy5leHRlbmQocmV0LCBwYXJhbSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgcHJvZ3JhbVdpdGhEZXB0aDogZW52LlZNLnByb2dyYW1XaXRoRGVwdGgsXG4gICAgbm9vcDogZW52LlZNLm5vb3AsXG4gICAgY29tcGlsZXJJbmZvOiBudWxsXG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgbmFtZXNwYWNlID0gb3B0aW9ucy5wYXJ0aWFsID8gb3B0aW9ucyA6IGVudixcbiAgICAgICAgaGVscGVycyxcbiAgICAgICAgcGFydGlhbHM7XG5cbiAgICBpZiAoIW9wdGlvbnMucGFydGlhbCkge1xuICAgICAgaGVscGVycyA9IG9wdGlvbnMuaGVscGVycztcbiAgICAgIHBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlU3BlYy5jYWxsKFxuICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICBuYW1lc3BhY2UsIGNvbnRleHQsXG4gICAgICAgICAgaGVscGVycyxcbiAgICAgICAgICBwYXJ0aWFscyxcbiAgICAgICAgICBvcHRpb25zLmRhdGEpO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGVudi5WTS5jaGVja1JldmlzaW9uKGNvbnRhaW5lci5jb21waWxlckluZm8pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmV4cG9ydHMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtmdW5jdGlvbiBwcm9ncmFtV2l0aERlcHRoKGksIGZuLCBkYXRhIC8qLCAkZGVwdGggKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YV0uY29uY2F0KGFyZ3MpKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IGFyZ3MubGVuZ3RoO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtV2l0aERlcHRoID0gcHJvZ3JhbVdpdGhEZXB0aDtmdW5jdGlvbiBwcm9ncmFtKGksIGZuLCBkYXRhKSB7XG4gIHZhciBwcm9nID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMuZGF0YSB8fCBkYXRhKTtcbiAgfTtcbiAgcHJvZy5wcm9ncmFtID0gaTtcbiAgcHJvZy5kZXB0aCA9IDA7XG4gIHJldHVybiBwcm9nO1xufVxuXG5leHBvcnRzLnByb2dyYW0gPSBwcm9ncmFtO2Z1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgbmFtZSwgY29udGV4dCwgaGVscGVycywgcGFydGlhbHMsIGRhdGEpIHtcbiAgdmFyIG9wdGlvbnMgPSB7IHBhcnRpYWw6IHRydWUsIGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuXG4gIGlmKHBhcnRpYWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gIH0gZWxzZSBpZihwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnRzLmludm9rZVBhcnRpYWwgPSBpbnZva2VQYXJ0aWFsO2Z1bmN0aW9uIG5vb3AoKSB7IHJldHVybiBcIlwiOyB9XG5cbmV4cG9ydHMubm9vcCA9IG5vb3A7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBcIlwiICsgdGhpcy5zdHJpbmc7XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNhZmVTdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKmpzaGludCAtVzAwNCAqL1xudmFyIFNhZmVTdHJpbmcgPSByZXF1aXJlKFwiLi9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG5cbnZhciBlc2NhcGUgPSB7XG4gIFwiJlwiOiBcIiZhbXA7XCIsXG4gIFwiPFwiOiBcIiZsdDtcIixcbiAgXCI+XCI6IFwiJmd0O1wiLFxuICAnXCInOiBcIiZxdW90O1wiLFxuICBcIidcIjogXCImI3gyNztcIixcbiAgXCJgXCI6IFwiJiN4NjA7XCJcbn07XG5cbnZhciBiYWRDaGFycyA9IC9bJjw+XCInYF0vZztcbnZhciBwb3NzaWJsZSA9IC9bJjw+XCInYF0vO1xuXG5mdW5jdGlvbiBlc2NhcGVDaGFyKGNocikge1xuICByZXR1cm4gZXNjYXBlW2Nocl0gfHwgXCImYW1wO1wiO1xufVxuXG5mdW5jdGlvbiBleHRlbmQob2JqLCB2YWx1ZSkge1xuICBmb3IodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDt2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICB9O1xufVxudmFyIGlzRnVuY3Rpb247XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgPyB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJyYXldJyA6IGZhbHNlO1xufTtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGVzY2FwZUV4cHJlc3Npb24oc3RyaW5nKSB7XG4gIC8vIGRvbid0IGVzY2FwZSBTYWZlU3RyaW5ncywgc2luY2UgdGhleSdyZSBhbHJlYWR5IHNhZmVcbiAgaWYgKHN0cmluZyBpbnN0YW5jZW9mIFNhZmVTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSBpZiAoIXN0cmluZyAmJiBzdHJpbmcgIT09IDApIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAvLyB0aGUgcmVnZXggdGVzdCB3aWxsIGRvIHRoaXMgdHJhbnNwYXJlbnRseSBiZWhpbmQgdGhlIHNjZW5lcywgY2F1c2luZyBpc3N1ZXMgaWZcbiAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gIHN0cmluZyA9IFwiXCIgKyBzdHJpbmc7XG5cbiAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydHMuZXNjYXBlRXhwcmVzc2lvbiA9IGVzY2FwZUV4cHJlc3Npb247ZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7IiwiLy8gQ3JlYXRlIGEgc2ltcGxlIHBhdGggYWxpYXMgdG8gYWxsb3cgYnJvd3NlcmlmeSB0byByZXNvbHZlXG4vLyB0aGUgcnVudGltZSBvbiBhIHN1cHBvcnRlZCBwYXRoLlxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZScpO1xuIiwidmFyICQgPSByZXF1aXJlKCd1bm9waW5pb25hdGUnKS5zZWxlY3RvcjtcblxudmFyICRkb2N1bWVudCAgID0gJChkb2N1bWVudCksXG4gICAgYmluZGluZ3MgICAgPSB7fTtcblxudmFyIGNsaWNrID0gZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgY2xpY2suYmluZC5hcHBseShjbGljaywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gY2xpY2s7XG59O1xuXG4vKioqIENvbmZpZ3VyYXRpb24gT3B0aW9ucyAqKiovXG5jbGljay5kaXN0YW5jZUxpbWl0ID0gMTA7XG5jbGljay50aW1lTGltaXQgICAgID0gMTQwO1xuXG4vKioqIFVzZWZ1bCBQcm9wZXJ0aWVzICoqKi9cbmNsaWNrLmlzVG91Y2ggPSAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoO1xuXG4vKioqIENhY2hlZCBGdW5jdGlvbnMgKioqL1xudmFyIG9uVG91Y2hzdGFydCA9IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpOyAvL1ByZXZlbnRzIG11bHRpcGxlIGNsaWNrIGV2ZW50cyBmcm9tIGhhcHBlbmluZ1xuXG4gICAgY2xpY2suX2RvQW55d2hlcmVzKGUpO1xuXG4gICAgdmFyICR0aGlzICAgICAgID0gJCh0aGlzKSxcbiAgICAgICAgc3RhcnRUaW1lICAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgc3RhcnRQb3MgICAgPSBjbGljay5fZ2V0UG9zKGUpO1xuXG4gICAgJHRoaXMub25lKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvL1ByZXZlbnRzIGNsaWNrIGV2ZW50IGZyb20gZmlyaW5nXG4gICAgICAgIFxuICAgICAgICB2YXIgdGltZSAgICAgICAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZSxcbiAgICAgICAgICAgIGVuZFBvcyAgICAgID0gY2xpY2suX2dldFBvcyhlKSxcbiAgICAgICAgICAgIGRpc3RhbmNlICAgID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgIE1hdGgucG93KGVuZFBvcy54IC0gc3RhcnRQb3MueCwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KGVuZFBvcy55IC0gc3RhcnRQb3MueSwgMilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgaWYodGltZSA8IGNsaWNrLnRpbWVMaW1pdCAmJiBkaXN0YW5jZSA8IGNsaWNrLmRpc3RhbmNlTGltaXQpIHtcbiAgICAgICAgICAgIC8vRmluZCB0aGUgY29ycmVjdCBjYWxsYmFja1xuICAgICAgICAgICAgJC5lYWNoKGJpbmRpbmdzLCBmdW5jdGlvbihzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZigkdGhpcy5pcyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoZS50YXJnZXQsIFtlXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqKiBBUEkgKioqL1xuY2xpY2suYmluZCA9IGZ1bmN0aW9uKGV2ZW50cykge1xuXG4gICAgLy9Bcmd1bWVudCBTdXJnZXJ5XG4gICAgaWYoISQuaXNQbGFpbk9iamVjdChldmVudHMpKSB7XG4gICAgICAgIG5ld0V2ZW50cyA9IHt9O1xuICAgICAgICBuZXdFdmVudHNbYXJndW1lbnRzWzBdXSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgZXZlbnRzID0gbmV3RXZlbnRzO1xuICAgIH1cblxuICAgICQuZWFjaChldmVudHMsIGZ1bmN0aW9uKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuXG4gICAgICAgIC8qKiogUmVnaXN0ZXIgQmluZGluZyAqKiovXG4gICAgICAgIGlmKHR5cGVvZiBiaW5kaW5nc1tzZWxlY3Rvcl0gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNsaWNrLnVuYmluZChzZWxlY3Rvcik7IC8vRW5zdXJlIG5vIGR1cGxpY2F0ZXNcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYmluZGluZ3Nbc2VsZWN0b3JdID0gY2FsbGJhY2s7XG5cbiAgICAgICAgLyoqKiBUb3VjaCBTdXBwb3J0ICoqKi9cbiAgICAgICAgaWYoY2xpY2suaXNUb3VjaCkge1xuICAgICAgICAgICAgJGRvY3VtZW50LmRlbGVnYXRlKHNlbGVjdG9yLCAndG91Y2hzdGFydCcsIG9uVG91Y2hzdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKioqIE1vdXNlIFN1cHBvcnQgKioqL1xuICAgICAgICAkZG9jdW1lbnQuZGVsZWdhdGUoc2VsZWN0b3IsICdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7IC8vUHJldmVudHMgbXVsdGlwbGUgY2xpY2sgZXZlbnRzIGZyb20gaGFwcGVuaW5nXG4gICAgICAgICAgICAvL2NsaWNrLl9kb0FueXdoZXJlcyhlKTsgLy9EbyBhbnl3aGVyZXMgZmlyc3QgdG8gYmUgY29uc2lzdGVudCB3aXRoIHRvdWNoIG9yZGVyXG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBbZV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuY2xpY2sudW5iaW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICAkZG9jdW1lbnRcbiAgICAgICAgLnVuZGVsZWdhdGUoc2VsZWN0b3IsICd0b3VjaHN0YXJ0JylcbiAgICAgICAgLnVuZGVsZWdhdGUoc2VsZWN0b3IsICdjbGljaycpO1xuXG4gICAgZGVsZXRlIGJpbmRpbmdzW3NlbGVjdG9yXTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuY2xpY2sudW5iaW5kQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgJC5lYWNoKGJpbmRpbmdzLCBmdW5jdGlvbihzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgJGRvY3VtZW50XG4gICAgICAgICAgICAudW5kZWxlZ2F0ZShzZWxlY3RvciwgJ3RvdWNoc3RhcnQnKVxuICAgICAgICAgICAgLnVuZGVsZWdhdGUoc2VsZWN0b3IsICdjbGljaycpO1xuICAgIH0pO1xuICAgIFxuICAgIGJpbmRpbmdzID0ge307XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmNsaWNrLnRyaWdnZXIgPSBmdW5jdGlvbihzZWxlY3RvciwgZSkge1xuICAgIGUgPSBlIHx8ICQuRXZlbnQoJ2NsaWNrJyk7XG5cbiAgICBpZih0eXBlb2YgYmluZGluZ3Nbc2VsZWN0b3JdICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGJpbmRpbmdzW3NlbGVjdG9yXShlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyBjbGljayBldmVudHMgYm91bmQgZm9yIHNlbGVjdG9yICdcIitzZWxlY3RvcitcIicuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuY2xpY2suYW55d2hlcmUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGNsaWNrLl9hbnl3aGVyZXMucHVzaChjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKioqIEludGVybmFsIChidXQgdXNlZnVsKSBNZXRob2RzICoqKi9cbmNsaWNrLl9nZXRQb3MgPSBmdW5jdGlvbihlKSB7XG4gICAgZSA9IGUub3JpZ2luYWxFdmVudDtcblxuICAgIGlmKGUucGFnZVggfHwgZS5wYWdlWSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZS5wYWdlWCxcbiAgICAgICAgICAgIHk6IGUucGFnZVlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSBpZihlLmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICAgICAgICB5OiBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlLmNsaWVudFggKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgICAgIHk6IGUuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5jbGljay5fYW55d2hlcmVzID0gW107XG5cbmNsaWNrLl9kb0FueXdoZXJlcyA9IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgaSA9IGNsaWNrLl9hbnl3aGVyZXMubGVuZ3RoO1xuICAgIHdoaWxlKGktLSkge1xuICAgICAgICBjbGljay5fYW55d2hlcmVzW2ldKGUpO1xuICAgIH1cbn07XG5cbiQoZG9jdW1lbnQpLmJpbmQoJ21vdXNlZG93bicsIGNsaWNrLl9kb0FueXdoZXJlcyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xpY2s7XG5cbiIsInZhciAkID0gcmVxdWlyZSgndW5vcGluaW9uYXRlJykuc2VsZWN0b3I7XG5cbnZhciBib2R5U2Nyb2xsZXJzID0gW107XG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgdmFyICRodG1sID0gJCgnaHRtbCcpLFxuICAgICAgICAkYm9keSA9ICQoJ2JvZHknKTtcblxuICAgICQod2luZG93LCBkb2N1bWVudCwgJ2JvZHknKS5iaW5kKCdzY3JvbGwgdG91Y2htb3ZlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0b3AgPSAkaHRtbFswXS5zY3JvbGxUb3AgfHwgJGJvZHlbMF0uc2Nyb2xsVG9wO1xuXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGJvZHlTY3JvbGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJvZHlTY3JvbGxlcnNbaV0odG9wKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbnZhciBvblNjcm9sbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgYm9keVNjcm9sbGVycy5wdXNoKGNhbGxiYWNrKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb25TY3JvbGw7IiwiKGZ1bmN0aW9uKHJvb3QpIHtcbiAgICB2YXIgY2FsbGJhY2tzID0gW107XG5cbiAgICB2YXIgdHJhbnNpdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgaWYoY2FsbGJhY2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgc2V0RXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lKCksIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBjYWxsYmFja3MubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUoaS0tKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50TmFtZTtcblxuICAgIGZ1bmN0aW9uIGV2ZW50TmFtZSgpIHtcbiAgICAgICAgaWYoIV9ldmVudE5hbWUpIHtcbiAgICAgICAgICAgIC8vIFNvdXJjZWQgZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MDIzNTE0L2hvdy1kby1pLW5vcm1hbGl6ZS1jc3MzLXRyYW5zaXRpb24tZnVuY3Rpb25zLWFjcm9zcy1icm93c2Vyc1xuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKTtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICBPVHJhbnNpdGlvbjogICAgICAnb1RyYW5zaXRpb25FbmQnLFxuICAgICAgICAgICAgICAgICAgICBNb3pUcmFuc2l0aW9uOiAgICAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zaXRpb246ICd3ZWJraXRUcmFuc2l0aW9uRW5kJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvcih2YXIgdCBpbiB0cmFuc2l0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmKGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX2V2ZW50TmFtZSA9IHRyYW5zaXRpb25zW3RdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfZXZlbnROYW1lO1xuICAgIH1cbiAgICBcbiAgICAvKioqIEV4cG9ydCAqKiovXG5cbiAgICAvLyBBTURcbiAgICBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbkNvbXBsZXRlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gQ29tbW9uSlNcbiAgICBlbHNlIGlmKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHRyYW5zaXRpb25Db21wbGV0ZTtcbiAgICB9XG4gICAgLy8gQnJvd3NlciBHbG9iYWxcbiAgICBlbHNlIHtcbiAgICAgICAgcm9vdC50cmFuc2l0aW9uQ29tcGxldGUgPSB0cmFuc2l0aW9uQ29tcGxldGU7XG4gICAgfVxufSkodGhpcyk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4oZnVuY3Rpb24ocm9vdCkge1xuICAgIHZhciB1bm9waW5pb25hdGUgPSB7XG4gICAgICAgIHNlbGVjdG9yOiByb290LmpRdWVyeSB8fCByb290LlplcHRvIHx8IHJvb3QuZW5kZXIgfHwgcm9vdC4kLFxuICAgICAgICB0ZW1wbGF0ZTogcm9vdC5IYW5kbGViYXJzIHx8IHJvb3QuTXVzdGFjaGVcbiAgICB9O1xuXG4gICAgLyoqKiBFeHBvcnQgKioqL1xuXG4gICAgLy9BTURcbiAgICBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB1bm9waW5pb25hdGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvL0NvbW1vbkpTXG4gICAgZWxzZSBpZih0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gdW5vcGluaW9uYXRlO1xuICAgIH1cbiAgICAvL0dsb2JhbFxuICAgIGVsc2Uge1xuICAgICAgICByb290LnVub3BpbmlvbmF0ZSA9IHVub3BpbmlvbmF0ZTtcbiAgICB9XG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
