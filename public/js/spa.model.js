/**
 * Created by bfulop on 08/01/15.
 */

/*
 * spa.model.js
 * Model module
 */

/*global TAFFY, $, spa */

spa.model = (function () {
    'use strict';
    var
        configMap = {  },
        stateMap  = {
            cid_serial     : 0,
            todo_cid_map : {},
            todo_db      : TAFFY()
        },

        isFakeData = false;

    // The _Todo object API
    // ---------------------

    var taskProto = {
    //    no need for taks methods right now
    };

    function makeCid () {
        return 'c' + String( stateMap.cid_serial++ );
    }


    function makeTask ( task_map ) {
        var task,
            cid     = task_map.cid,
            id      = task_map.id,
            desc    = task_map.desc,
            isdone    = task_map.isdone;

        if ( cid === undefined || ! desc ) {
            throw 'client id and name required';
        }

        task         = Object.create( taskProto );
        task.cid     = cid;
        task.desc    = desc;
        task.isdone = isdone;

        if ( id ) { task.id = id; }

        stateMap.todo_cid_map[ cid ] = task;

        stateMap.todo_db.insert( task );
        return task;
    }

    function completeAddTask ( task_list ) {
        var task_map = task_list[0];
        stateMap.todo_cid_map[ task_map._id ] = task_map;
        stateMap.todo_cid_map[ task_map._id].cid = task_map._id;
        $.gevent.publish( 'spa-addtask', task_map );

    }

    function ontaskCompleted ( task_list ) {
        var task_map = task_list[0];
        stateMap.todo_cid_map[ task_map._id].isdone = task_map.isdone;
        stateMap.todo_db({ id:task_map._id }).update({ isdone : task_map.isdone });
        $.gevent.publish( 'spa-completetask', task_map);
    }

    function onGetTaskList (result_map) {
        var i, task_map;
        var result_list = result_map[0];
        for ( i = 0; i < result_list.length; i++ ) {
            task_map = result_list[ i ];
            makeTask({
                id      : task_map._id,
                cid     : task_map._id,
                desc : task_map.desc,
                isdone    : task_map.isdone
            });
        }
        $.gevent.publish( 'spa-loadtasks');
    }



    var todo = (function () {

        function get_by_cid ( cid ) {
            return stateMap.todo_cid_map[ cid ];
        }

        function get_db () { return stateMap.todo_db; }


        function add_task ( task_name ) {
            var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();
            var new_task = makeTask({
                cid : makeCid(),
                desc : task_name,
                isdone : false
            });
            sio.on( 'taskupdate', completeAddTask );

            sio.emit( 'addtask', new_task);

            return true;

        }

        function complete_task ( task_id ) {
            var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();

            sio.on( 'taskCompleted', ontaskCompleted);

            sio.emit ( 'completetask', task_id );

            return true;
        }

        return {
            get_by_cid : get_by_cid,
            get_db     : get_db,
            add_task   : add_task,
            complete_task      : complete_task
        };
    }());

    function initModule () {
        var i, todo_list, task_map;
        var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();


        if ( isFakeData ) {
            todo_list = spa.fake.getTaskList();
            for ( i = 0; i < todo_list.length; i++ ) {
                task_map = todo_list[ i ];
                makeTask({
                    id      : task_map._id,
                    cid     : task_map._id,
                    desc : task_map.desc,
                    isdone    : task_map.isdone
                });
            }

        } else {
            sio.on( 'tasklist', onGetTaskList);

            sio.emit('gettasklist');

        }
    }


    return {
        initModule : initModule,
        todo     : todo
    };
}());
