/* global describe, it */
"use strict";

var assert = require('assert'),
    Storage = require('../../lib/up-storage');

require('../../lib/logger').setup([]);

function setup(host, config, mainconfig) {
	config.url = host;
	return new Storage(config, mainconfig);
}

describe('Use proxy', function() {
    var x;
	it('should work fine without proxy', function() {
		x = setup('http://x/x', {}, {});
		assert.equal(x.proxy, null);
	});

	it('local config should take priority', function() {
		x = setup('http://x/x', {http_proxy: '123'}, {http_proxy: '456'});
		assert.equal(x.proxy, '123');
	});
	it('no_proxy is invalid', function() {
		x = setup('http://x/x', {http_proxy: '123', no_proxy: false}, {});
		assert.equal(x.proxy, '123');
		x = setup('http://x/x', {http_proxy: '123', no_proxy: null}, {});
		assert.equal(x.proxy, '123');
		x = setup('http://x/x', {http_proxy: '123', no_proxy: []}, {});
		assert.equal(x.proxy, '123');
		x = setup('http://x/x', {http_proxy: '123', no_proxy: ''}, {});
		assert.equal(x.proxy, '123');
	});

	it('no_proxy - simple/include', function() {
		x = setup('http://localhost', {http_proxy: '123'}, {no_proxy: 'localhost'});
		assert.equal(x.proxy, undefined);
	});

	it('no_proxy - simple/not', function() {
		var x = setup('http://localhost', {http_proxy: '123'}, {no_proxy: 'blah'});
		assert.equal(x.proxy, '123');
	});

	it('no_proxy - various, single string', function() {
		x = setup('http://blahblah', {http_proxy: '123'}, {no_proxy: 'blah'});
		assert.equal(x.proxy, '123');
		x = setup('http://blah.blah', {}, {http_proxy: '123', no_proxy: 'blah'});
		assert.equal(x.proxy, null);
		x = setup('http://blahblah', {}, {http_proxy: '123', no_proxy: '.blah'});
		assert.equal(x.proxy, '123');
		x = setup('http://blah.blah', {http_proxy: '123', no_proxy: '.blah'}, {});
		assert.equal(x.proxy, null);
		x = setup('http://blah', {http_proxy: '123', no_proxy: '.blah'}, {});
		assert.equal(x.proxy, null);
		x = setup('http://blahh', {http_proxy: '123', no_proxy: 'blah'},  {});
		assert.equal(x.proxy, '123');
	});

	it('no_proxy - various, array', function() {
		x = setup('http://blahblah', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
		assert.equal(x.proxy, '123');
		x = setup('http://blah.blah', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
		assert.equal(x.proxy, null);
		x = setup('http://blah.foo', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
		assert.equal(x.proxy, null);
		x = setup('http://foo.baz', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
		assert.equal(x.proxy, '123');
		x = setup('http://blahblah', {http_proxy: '123'}, {no_proxy: ['foo','bar','blah']});
		assert.equal(x.proxy, '123');
		x = setup('http://blah.blah', {http_proxy: '123'}, {no_proxy: ['foo','bar','blah']});
		assert.equal(x.proxy, null);
	});

	it('no_proxy - hostport', function() {
		x = setup('http://localhost:80', {http_proxy: '123'}, {no_proxy: 'localhost'});
		assert.equal(x.proxy, null);
		x = setup('http://localhost:8080', {http_proxy: '123'}, {no_proxy: 'localhost'});
		assert.equal(x.proxy, null);
	});

	it('no_proxy - secure', function() {
		x = setup('https://something', {http_proxy: '123'}, {});
		assert.equal(x.proxy, null);
		x = setup('https://something', {https_proxy: '123'}, {});
		assert.equal(x.proxy, '123');
		x = setup('https://something', {http_proxy: '456', https_proxy: '123'}, {});
		assert.equal(x.proxy, '123');
	});
});
