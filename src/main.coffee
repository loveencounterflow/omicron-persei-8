
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'OMICRON-PERSEI-8'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  declare
  cast
  size_of
  last_of
  type_of }               = types.export()
Multimix                  = require 'multimix'
MAIN                      = @

#-----------------------------------------------------------------------------------------------------------
class Op8 extends Multimix

  #---------------------------------------------------------------------------------------------------------
  @defaults: Object.freeze { object_mode: true, }

  #---------------------------------------------------------------------------------------------------------
  constructor: ( settings ) ->
    super()
    @settings = { @constructor.defaults..., settings..., }
    validate.boolean @settings.object_mode
    @types    = types
    @$        = @remit.bind @

  #---------------------------------------------------------------------------------------------------------
  remit: ( remitter ) ->
    validate.callable remitter
    switch arity = remitter.length
      #.....................................................................................................
      when 1
        validate.function remitter
        transform = ( chunk, encoding, done ) -> remitter chunk; @push chunk; done()
      #.....................................................................................................
      when 2
        validate.function remitter
        transform = ( chunk, encoding, done ) -> remitter chunk, ( send = ( d ) => @push d ); done()
      #.....................................................................................................
      when 3
        debug '^2726^', remitter, remitter.length
        validate.asyncfunction remitter
        transform = ( chunk, encoding, done ) -> remitter chunk, ( send = ( d ) => @push d ), done
      #.....................................................................................................
      else
        throw new Error "^remit@4478^ expected function with 1 to 3 arguments, got one with #{arity}"
    #.......................................................................................................
    return new ( require 'readable-stream' ).Transform { transform, objectMode: @settings.object_mode, }


############################################################################################################
module.exports = new Op8()

