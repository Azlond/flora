'use strict';

const { expect } = require('chai');

const Response = require('../lib/response');
const Request = require('../lib/request');

describe('Response', () => {
    it('should be instantiable', () => {
        expect(new Response()).to.be.an('object');
    });

    it('should pass through a Request parameter', () => {
        var request = new Request();
        var response = new Response(request);
        expect(response.request).to.eql(request);
    });

    it('should have basic properties', () => {
        var response = new Response(new Request());
        expect(response.meta).to.be.an('object');
        expect(response.meta.headers).to.be.an('object');
    });

    it('should have writeable meta.headers property', () => {
        var response = new Response(new Request());

        expect(() => {
            response.meta.headers = {'Content-Type': 'application/pdf'};
        }).to.not.throw(Error);
        expect(response.meta.headers).to.have.property('Content-Type');
    });

    it('should not expose headers in response.meta', () => {
        var response = new Response(new Request());
        expect(response.meta.propertyIsEnumerable('headers')).to.be.false;
    });

    it('should have default status code', () => {
        var response = new Response(new Request());
        expect(response.meta.statusCode).to.eql(200);
    });

    describe('send', () => {
        it('should call the callback', (done) => {
            var response = new Response(new Request(), function (err) {
                expect(err).to.eql(null);
                done();
            });
            response.send();
        });

        it('should pass through the payload', (done) => {
            var response = new Response(new Request(), (err, res) => {
                expect(res).to.eql(response);
                expect(res.data).to.eql('foo');
                done();
            });
            response.send('foo');
        });

        it('should pass through Errors', (done) => {
            var response = new Response(new Request(), (err, res) => {
                expect(err).to.be.an.instanceof(Error);
                expect(res).to.be.undefined;
                done();
            });
            response.send(new Error('bar'));
        });

        it('cannot be called twice', (done) => {
            var count = 0;
            var response = new Response(new Request(), (err, res) => {
                count++;
                if (count === 1) {
                    res.send('baz');
                } else if (count === 2) {
                    expect(err).to.be.an('error');
                    expect(err.message).to.equal('Response#send was already called');
                    done();
                }
            });
            response.send('foo');
        });
    });
});
