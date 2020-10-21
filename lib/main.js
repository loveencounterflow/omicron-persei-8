(function() {
  'use strict';
  var CND, MAIN, Multimix, Op8, alert, badge, cast, debug, declare, echo, help, info, isa, last_of, log, rpr, size_of, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'OMICRON-PERSEI-8';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, validate, declare, cast, size_of, last_of, type_of} = types.export());

  Multimix = require('multimix');

  MAIN = this;

  Op8 = (function() {
    //-----------------------------------------------------------------------------------------------------------
    class Op8 extends Multimix {
      //---------------------------------------------------------------------------------------------------------
      constructor(settings) {
        super();
        this.settings = {...this.constructor.defaults, ...settings};
        validate.boolean(this.settings.object_mode);
        this.types = types;
        this.$ = this.remit.bind(this);
      }

      //---------------------------------------------------------------------------------------------------------
      remit(remitter) {
        var arity, transform;
        validate.callable(remitter);
        switch (arity = remitter.length) {
          //.....................................................................................................
          case 1:
            validate.function(remitter);
            transform = function(chunk, encoding, done) {
              remitter(chunk);
              this.push(chunk);
              return done();
            };
            break;
          //.....................................................................................................
          case 2:
            validate.function(remitter);
            transform = function(chunk, encoding, done) {
              var send;
              remitter(chunk, (send = (d) => {
                return this.push(d);
              }));
              return done();
            };
            break;
          //.....................................................................................................
          case 3:
            debug('^2726^', remitter, remitter.length);
            validate.asyncfunction(remitter);
            transform = function(chunk, encoding, done) {
              var send;
              return remitter(chunk, (send = (d) => {
                return this.push(d);
              }), done);
            };
            break;
          default:
            //.....................................................................................................
            throw new Error(`^remit@4478^ expected function with 1 to 3 arguments, got one with ${arity}`);
        }
        //.......................................................................................................
        return new (require('readable-stream')).Transform({
          transform,
          objectMode: this.settings.object_mode
        });
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Op8.defaults = Object.freeze({
      object_mode: true
    });

    return Op8;

  }).call(this);

  //###########################################################################################################
  module.exports = new Op8();

}).call(this);

//# sourceMappingURL=main.js.map