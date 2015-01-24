/*
 * spa.data.js
 * Data module
 */
spa.data = (function () {
    'use strict';
    var
        stateMap = { sio : null };

    function makeSio (){
        var socket = io.connect( '/todo' );

        return {
            emit : function ( event_name, data ) {
                socket.emit( event_name, data );
            },
            on   : function ( event_name, callback ) {
                socket.on( event_name, function (){
                    callback( arguments );
                });
            }
        };
    }

    function getSio (){
        if ( ! stateMap.sio ) { stateMap.sio = makeSio(); }
        return stateMap.sio;
    }

    function initModule (){}

    return {
        getSio     : getSio,
        initModule : initModule
    }
}());
