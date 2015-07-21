/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../declares.d.ts" />
'use strict';
define(["require", "exports", 'vs/languages/lib/wireProtocol', 'monaco', 'child_process', 'path'], function (require, exports, WireProtocol, monaco, cp, path) {
    var isWin = /^win/.test(process.platform);
    var isDarwin = /^darwin/.test(process.platform);
    var isLinux = /^linux/.test(process.platform);
    var arch = process.arch;
    var sqfServiceClient = (function () {
        function sqfServiceClient(host, configService) {
            this.host = host;
            this.configService = configService;
            this.pathSeparator = path.sep;
            this.servicePromise = null;
            this.lastError = null;
            this.sequenceNumber = 0;
            this.requestQueue = [];
            this.pendingResponses = 0;
            this.callbacks = Object.create(null);
            this.startService();
        }
        Object.defineProperty(sqfServiceClient.prototype, "trace", {
            get: function () {
                return sqfServiceClient.Trace;
            },
            enumerable: true,
            configurable: true
        });
        sqfServiceClient.prototype.service = function () {
            if (this.servicePromise) {
                return this.servicePromise;
            }
            if (this.lastError) {
                return monaco.Promise.wrapError(this.lastError);
            }
            this.startService();
            return this.servicePromise;
        };
        sqfServiceClient.prototype.startService = function () {
            var _this = this;
            this.servicePromise = new monaco.Promise(function (c, e, p) {
                _this.configService.loadConfiguration('sqf').done(function (config) {
                    var childProcess = null;
                    try {
                        var tsserverConfig = config ? config['tsdk'] : undefined;
                        var modulePath = tsserverConfig ? path.join(tsserverConfig, 'tsserver.js') : path.join(__dirname, 'lib', 'tsserver.js');
                        var args;
                        var value = process.env.TSS_DEBUG;
                        if (value) {
                            var port = parseInt(value);
                            args = isNaN(port) ? [modulePath] : ['--debug=' + port, modulePath];
                        }
                        else {
                            args = [modulePath];
                        }
                        if (isWin) {
                            childProcess = cp.spawn(path.join(monaco.Paths.getAppRoot(), 'tools/bin/win/node.exe'), args);
                        }
                        else if (isDarwin) {
                            childProcess = cp.spawn(path.join(monaco.Paths.getAppRoot(), 'tools/bin/osx/node'), args);
                        }
                        else if (isLinux && arch === 'x64') {
                            childProcess = cp.spawn(path.join(monaco.Paths.getAppRoot(), 'tools/bin/linux/x64/node'), args);
                        }
                        else {
                            childProcess = cp.fork(modulePath, [], {
                                silent: true
                            });
                        }
                        childProcess.on('error', function (err) {
                            _this.lastError = err;
                            _this.serviceExited();
                        });
                        childProcess.on('exit', function (err) {
                            _this.serviceExited();
                        });
                        _this.reader = new WireProtocol.Reader(childProcess.stdout, function (msg) {
                            _this.dispatchMessage(msg);
                        });
                        c(childProcess);
                    }
                    catch (error) {
                        e(error);
                    }
                }, function (err) {
                    e(err);
                });
            });
            this.serviceStarted();
        };
        sqfServiceClient.prototype.serviceStarted = function () {
            /*
            this.mode.getOpenBuffers().forEach((file) => {
                this.execute('open', { file: file }, false);
            });
            */
        };
        sqfServiceClient.prototype.serviceExited = function () {
            var _this = this;
            this.servicePromise = null;
            Object.keys(this.callbacks).forEach(function (key) {
                _this.callbacks[parseInt(key)].e(new Error('Service died.'));
            });
        };
        sqfServiceClient.prototype.asAbsolutePath = function (resource) {
            if (resource.scheme !== 'file') {
                return null;
            }
            var result = resource.fsPath;
            //var absolutePath = monaco.Paths.toAbsoluteFilePath(resource);
            // Both \ and / must be escaped in regular expressions
            return result ? result.replace(new RegExp('\\' + this.pathSeparator, 'g'), '/') : null;
        };
        sqfServiceClient.prototype.asUrl = function (filepath) {
            return new monaco.URL(monaco.URI.file(filepath));
        };
        sqfServiceClient.prototype.execute = function (command, args, expectsResult) {
            var _this = this;
            if (expectsResult === void 0) { expectsResult = true; }
            var request = {
                seq: this.sequenceNumber++,
                type: 'request',
                command: command,
                arguments: args
            };
            var requestInfo = {
                request: request,
                promise: null,
                callbacks: null
            };
            var result = null;
            if (expectsResult) {
                result = new monaco.Promise(function (c, e, p) {
                    requestInfo.callbacks = { c: c, e: e, start: Date.now() };
                }, function () {
                    _this.tryCancelRequest(request.seq);
                });
            }
            requestInfo.promise = result;
            this.requestQueue.push(requestInfo);
            this.sendNextRequests();
            return result;
        };
        sqfServiceClient.prototype.sendNextRequests = function () {
            while (this.pendingResponses === 0 && this.requestQueue.length > 0) {
                this.sendRequest(this.requestQueue.shift());
            }
        };
        sqfServiceClient.prototype.sendRequest = function (requestItem) {
            var _this = this;
            var serverRequest = requestItem.request;
            if (sqfServiceClient.Trace) {
                console.log('sqf Service: sending request ' + serverRequest.command + '(' + serverRequest.seq + '). Response expected: ' + (requestItem.callbacks ? 'yes' : 'no') + '. Current queue length: ' + this.requestQueue.length);
            }
            if (requestItem.callbacks) {
                this.callbacks[serverRequest.seq] = requestItem.callbacks;
                this.pendingResponses++;
            }
            this.service().done(function (childProcess) {
                childProcess.stdin.write(JSON.stringify(serverRequest) + '\r\n', 'utf8');
            }, function (err) {
                var callback = _this.callbacks[serverRequest.seq];
                if (callback) {
                    callback.e(err);
                    delete _this.callbacks[serverRequest.seq];
                    _this.pendingResponses--;
                }
            });
        };
        sqfServiceClient.prototype.tryCancelRequest = function (seq) {
            for (var i = 0; i < this.requestQueue.length; i++) {
                if (this.requestQueue[i].request.seq === seq) {
                    this.requestQueue.splice(i, 1);
                    if (sqfServiceClient.Trace) {
                        console.log('sqf Service: canceled request with sequence number ' + seq);
                    }
                    return true;
                }
            }
            if (sqfServiceClient.Trace) {
                console.log('sqf Service: tried to cancel request with sequence number ' + seq + '. But request got already delivered.');
            }
            return false;
        };
        sqfServiceClient.prototype.dispatchMessage = function (message) {
            try {
                if (message.type === 'response') {
                    var response = message;
                    var p = this.callbacks[response.request_seq];
                    if (p) {
                        if (sqfServiceClient.Trace) {
                            console.log('sqf Service: request ' + response.command + '(' + response.request_seq + ') took ' + (Date.now() - p.start) + 'ms. Success: ' + response.success);
                        }
                        delete this.callbacks[response.request_seq];
                        this.pendingResponses--;
                        if (response.success) {
                            p.c(response);
                        }
                        else {
                            p.e(response);
                        }
                    }
                }
                else if (message.type === 'event') {
                    var event = message;
                    if (event.event === 'syntaxDiag') {
                        this.host.syntaxDiagnosticsReceived(event);
                    }
                    if (event.event === 'semanticDiag') {
                        this.host.semanticDiagnosticsReceived(event);
                    }
                }
                else {
                    throw new Error('Unknown message type ' + message.type + ' recevied');
                }
            }
            finally {
                this.sendNextRequests();
            }
        };
        sqfServiceClient.Trace = false;
        return sqfServiceClient;
    })();
    return sqfServiceClient;
});
