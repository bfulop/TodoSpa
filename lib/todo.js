/**
 * Created by bfulop on 13/01/15.
 */
'use strict';

var
    socket = require( 'socket.io' ),
    crud = require ( './crud' );

var todoObj = {
    connect : function (server) {
        var io = socket.listen(server);

        // Begin io setup
        io
            .set('blacklist', [])
            .of( '/todo' )
            .on('connection', function (socket) {
                socket.on('gettasklist', function () {
                    crud.read(
                        'tasklist',
                        {}, {},
                        function ( result_map ) {
                            socket.emit( 'tasklist', result_map );
                        }
                    );
                });
                socket.on('addtask', function ( task_map ) {
                    crud.construct(
                        'tasklist',
                        {
                            "cid": task_map.cid,
                            "desc": task_map.desc,
                            "isdone": false
                        },
                        function (result_map) {
                            socket.emit('taskupdate', result_map);
                        }
                    );
                });
                socket.on('completetask', function () {});
            });

        return io;
    }
};

module.exports = todoObj;