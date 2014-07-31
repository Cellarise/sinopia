"use strict";
var Logger = require('bunyan'),
    Stream = require('stream'),
    utils = require('./utils');

function getlvl(x) {
	switch(true) {
		case x < 15:
            return 'trace';
		case x < 25:
            return 'debug';
		case x < 35:
            return 'info';
		case x === 35:
            return 'http';
		case x < 45:
            return 'warn';
		case x < 55:
            return 'error';
		default:
            return 'fatal';
	}
}

module.exports.setup = function(logs) {
	var streams = [];
	if (logs === null) {
        logs = [{ type: 'stdout', format: 'pretty', level: 'http' }];
    }

	logs.forEach(function(target) {
        var dest;
		var stream = new Stream();
		stream.writable = true;

		if (target.type === 'stdout' || target.type === 'stderr') {
			// destination stream
			dest = target.type === 'stdout' ? process.stdout : process.stderr;

			if (target.format === 'pretty') {
				// making fake stream for prettypritting
				stream.write = function(obj) {
					dest.write(print(obj.level, obj.msg, obj, dest.isTTY) + '\n');
				};
			} else {
				stream.write = function(obj) {
					dest.write(JSON.stringify(obj, Logger.safeCycles()) + '\n');
				};
			}
		} else if (target.type === 'file') {
			dest = require('fs').createWriteStream(target.path, {flags: 'a', encoding: 'utf8'});
			dest.on('error', function (err) {
				Logger.emit('error', err);
			});
			stream.write = function(obj) {
				dest.write(JSON.stringify(obj, Logger.safeCycles()) + '\n');
			};
		} else {
			throw new Error('wrong target type for a log');
		}

		if (target.level === 'http') {
            target.level = 35;
        }
		streams.push({
			type: 'raw',
			level: target.level || 35,
			stream: stream
		});
	});

	var logger = new Logger({
		name: 'sinopia',
		streams: streams,
		serializers: {
			err: Logger.stdSerializers.err,
			req: Logger.stdSerializers.req,
			res: Logger.stdSerializers.res
		}
	});

	module.exports.logger = logger;
};

// adopted from socket.io
// this part was converted to coffee-script and back again over the years,
// so it might look weird

// level to color
var levels = {
	fatal: 31,
	error: 31,
	warn: 33,
	http: 35,
	info: 36,
	debug: 90,
	trace: 90
};

var max = 0;
var l;
for (l in levels) {
    if(levels.hasOwnProperty(l)){
        max = Math.max(max, l.length);
    }
}


function pad(str) {
	if (str.length < max) {
        return str + new Array(max - str.length + 1).join(' ');
    }
	return str;
}

var subsystems = [{
	in: '\x1b[32m<--\x1b[39m',
	out: '\x1b[33m-->\x1b[39m',
	fs: '\x1b[90m-=-\x1b[39m',
	default: '\x1b[34m---\x1b[39m'
}, {
	in: '<--',
	out: '-->',
	fs: '-=-',
	default: '---'
}];

function print(type, msg, obj, colors) {
	if (typeof type === 'number') {
        type = getlvl(type);
    }
	var finalmsg = msg.replace(/@{(!?[$A-Za-z_][$0-9A-Za-z\._]*)}/g, function(_, name) {
		var str = obj, is_error;
		if (name[0] === '!') {
			name = name.substr(1);
			is_error = true;
		}

		var _ref = name.split('.');
		for (var _i = 0; _i < _ref.length; _i++) {
			var id = _ref[_i];
			if (utils.is_object(str) || Array.isArray(str)) {
				str = str[id];
			} else {
				str = undefined;
			}
		}

		if (typeof(str) === 'string') {
			if (!colors || str.indexOf('\n') >= 0) {
				return str;
			} else if (is_error) {
				return '\x1b[31m' + str + '\x1b[39m';
			} else {
				return '\x1b[32m' + str + '\x1b[39m';
			}
		} else {
			return require('util').inspect(str, void 0, void 0, colors);
		}
	});
	var sub = subsystems[+!colors][obj.sub] || subsystems[+!colors].default;
	//                   ^^--- black magic... kidding, just "colors ? 0 : 1"

	if (colors) {
		return ' \x1b[' + levels[type] + 'm' + (pad(type)) + '\x1b[39m ' + sub + ' ' + finalmsg;
	} else {
		return ' ' + (pad(type)) + ' ' + sub + ' ' + finalmsg;
	}
}

