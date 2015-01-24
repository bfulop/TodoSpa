/**
 * Created by bfulop on 08/01/15.
 */

/*
 * spa.fake.js
 * Fake module
 */


spa.fake = (function () {
    'use strict';

    var
    fakeIdSerial = 5;

    function makeFakeId () {
        return 'id_' + String( fakeIdSerial++ );
    }

    var taskList = [
            {
                desc: 'Water the plants',
                _id: 'id_01',
                isdone: false
            },
            {
                desc: 'Update status',
                _id: 'id_02',
                isdone: false
            },
            {
                desc: 'Go for a walk',
                _id: 'id_03',
                isdone: false
            },
            {
                desc: 'Watch TV',
                _id: 'id_04',
                isdone: true
            }
        ];


    function get_task ( task_id ) {
        var i;
        TASK:
            for (i = 0; i < taskList.length; i++) {

                if (taskList[i]._id != task_id) {
                    continue;
                }
                return taskList[i];
            }

    }

    function set_task_status ( task_id, task_status) {
        var task_map = get_task( task_id );
        task_map.isdone = task_status;
        return task_map;
    }

    // Start Public methods

    function getTaskList () {
        return taskList;
    }


    var mockSio = (function () {
        var
            callback_map = {};

        function on_sio ( msg_type, callback ) {
            callback_map[ msg_type ] = callback;
        }

        function emit_sio ( msg_type, data ) {
            //    respond to 'addtask' event with 'taskupdate'
            //    callback after 3 seconds delay
            if ( msg_type === 'addtask' && callback_map.taskupdate ) {
                setTimeout(function () {
                    callback_map.taskupdate(
                        [{
                            _id : makeFakeId(),
                            desc : data.desc,
                            isdone : data.isdone
                        }]
                    );
                },3000)
            }
            if ( msg_type === 'completetask' && callback_map.taskCompleted ) {
                var completedTask = set_task_status(data, true);
                setTimeout(function () {
                    callback_map.taskCompleted(
                        [completedTask]
                    );
                },3000)
            }
        }

        function emit_mock_msg () {
            setTimeout( function () {
                var user = spa.model.people.get_user();
                if ( callback_map.updatechat ) {

                }
                else { emit_mock_msg(); }
            }, 8000 );
        }

        return { emit : emit_sio, on : on_sio };
    }());

    return {
        getTaskList : getTaskList,
        mockSio : mockSio
    };
}());
