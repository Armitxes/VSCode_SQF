/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../declares.d.ts" />
'use strict';
define(["require", "exports", 'monaco', './features/extraInfoSupport', './features/commentsSupport', './features/declarationSupport', './features/occurrencesSupport', './features/referenceSupport', './features/outlineSupport', './features/parameterHintsSupport', './features/renameSupport', './features/formattingSupport', './features/bufferSyncSupport', './features/suggestSupport', './features/configuration', './features/navigateTypesSupport', './sqfServiceClient'], function (require, exports, monaco, ExtraInfoSupport, CommentsSupport, DeclarationSupport, OccurrencesSupport, ReferenceSupport, OutlineSupport, ParameterHintsSupport, RenameSupport, FormattingSupport, BufferSyncSupport, SuggestSupport, Configuration, NavigateTypeSupport, sqfServiceClient) {
    function activate(_ctx) {
        var MODE_ID = 'sqf';
        var MY_PLUGIN_ID = 'vs.language.sqf';
        // TODO@plugins -> should instantiationService be public API?
        // We must copy the `ctx` for now because it becomes invalid as soon as this method call finishes
        var ctx = {
            modelService: _ctx.modelService,
            markerService: _ctx.markerService,
            configurationService: _ctx.configurationService
        };
        var clientHost = new sqfServiceClientHost(ctx);
        var client = clientHost.serviceClient;
        monaco.Modes.TokenTypeClassificationSupport.register(MODE_ID, {
            nonWordTokenTypes: [
                'delimiter',
                'delimiter.paren',
                'delimiter.curly',
                'delimiter.square'
            ],
            wordDefinition: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
        });
        monaco.Modes.ElectricCharacterSupport.register(MODE_ID, {
            brackets: [
                { tokenType: 'delimiter.curly.sqf', open: '{', close: '}', isElectric: true },
                { tokenType: 'delimiter.square.sqf', open: '[', close: ']', isElectric: true },
                { tokenType: 'delimiter.paren.sqf', open: '(', close: ')', isElectric: true }
            ]
        });
        monaco.Modes.CharacterPairSupport.register(MODE_ID, {
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '"', close: '"', notIn: ['string'] },
                { open: '\'', close: '\'', notIn: ['string', 'comment'] }
            ]
        });
        monaco.Modes.ExtraInfoSupport.register(MODE_ID, new ExtraInfoSupport(ctx, client));
        monaco.Modes.CommentsSupport.register(MODE_ID, new CommentsSupport());
        monaco.Modes.DeclarationSupport.register(MODE_ID, new DeclarationSupport(ctx, client));
        monaco.Modes.OccurrencesSupport.register(MODE_ID, new OccurrencesSupport(ctx, client));
        monaco.Modes.ReferenceSupport.register(MODE_ID, new ReferenceSupport(ctx, client));
        monaco.Modes.OutlineSupport.register(MODE_ID, new OutlineSupport(ctx, client));
        monaco.Modes.ParameterHintsSupport.register(MODE_ID, new ParameterHintsSupport(ctx, client));
        monaco.Modes.RenameSupport.register(MODE_ID, new RenameSupport(ctx, client));
        monaco.Modes.FormattingSupport.register(MODE_ID, new FormattingSupport(ctx, client));
        monaco.Modes.NavigateTypesSupport.register(MODE_ID, new NavigateTypeSupport(ctx, client, MODE_ID));
        new BufferSyncSupport(ctx, client, MODE_ID);
        // Register suggest support as soon as possible and load configuration lazily
        // TODO: Eventually support eventing on the configuration service & adopt here
        var suggestSupport = new SuggestSupport(ctx, client);
        monaco.Modes.SuggestSupport.register(MODE_ID, suggestSupport);
        return Configuration.load(MODE_ID, ctx.configurationService).then(function (config) {
            suggestSupport.setConfiguration(config);
        });
    }
    exports.activate = activate;
    var sqfServiceClientHost = (function () {
        function sqfServiceClientHost(ctx) {
            this.markerService = ctx.markerService;
            this.client = new sqfServiceClient(this, ctx.configurationService);
            this.syntaxDiagnostics = Object.create(null);
        }
        Object.defineProperty(sqfServiceClientHost.prototype, "serviceClient", {
            get: function () {
                return this.client;
            },
            enumerable: true,
            configurable: true
        });
        /* internal */ sqfServiceClientHost.prototype.syntaxDiagnosticsReceived = function (event) {
            var body = event.body;
            if (body.diagnostics) {
                var markers = this.createMarkerDatas(body.diagnostics);
                this.syntaxDiagnostics[body.file] = markers;
            }
        };
        /* internal */ sqfServiceClientHost.prototype.semanticDiagnosticsReceived = function (event) {
            var body = event.body;
            if (body.diagnostics) {
                var markers = this.createMarkerDatas(body.diagnostics);
                var syntaxMarkers = this.syntaxDiagnostics[body.file];
                if (syntaxMarkers) {
                    delete this.syntaxDiagnostics[body.file];
                    markers = syntaxMarkers.concat(markers);
                }
                this.markerService.changeOne('sqf', this.serviceClient.asUrl(body.file), markers);
            }
        };
        sqfServiceClientHost.prototype.createMarkerDatas = function (diagnostics) {
            var markers = [];
            for (var i = 0; i < diagnostics.length; i++) {
                var diagnostic = diagnostics[i];
                var marker = {
                    severity: monaco.Services.Severity.Error,
                    message: diagnostic.text,
                    startLineNumber: diagnostic.start.line,
                    startColumn: diagnostic.start.offset,
                    endLineNumber: diagnostic.end.line,
                    endColumn: diagnostic.end.offset
                };
                markers.push(marker);
            }
            return markers;
        };
        return sqfServiceClientHost;
    })();
});
