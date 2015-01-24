/**
 * Created by bfulop on 08/01/15.
 */

/*
 * spa.todojs
 * TodoMVC feature module for SPA
 */



spa.todo = (function () {
    'use strict';
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html : String()
            + '<div class="spa-todo-addtask-in">'
                + '<form class="spa-todo-addtask-form">'
                    + '<input type="text"/>'
                    + '<input type="submit" style="display:none"/>'
                    + '<div class="spa-todo-addtask-send">'
                    + 'add task'
                + '</div>'
            + '</form>'
            + '</div>'
            + '<div class="spa-todo">These are my todos:'
            + '<ul class="spa-todo-list-box"></ul>'
            + '</div>',

            settable_map : {
                todo_model      : true
            },

            todo_model      : null
        },
        stateMap  = {
            $container   : null
        },
        jqueryMap = {};

    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    function setJqueryMap () {
        var
            $container = stateMap.$container;

        jqueryMap = {
            $container   : $container,
            $list_box : $container.find( '.spa-todo-list-box' ),
            $form     : $container.find( '.spa-todo-addtask-form' ),
            $input    : $container.find( '.spa-todo-addtask-in input[type=text]')
        };
    }
    // End DOM method /setJqueryMap/

    // Begin DOM method /addTasktoDOM/
    function addTaskToDom ( task ) {
        jqueryMap.$list_box.prepend(
            '<li data-id="' + task.id + '" >' + task.desc + '</li>'
        );
    }

    function setTaskStatus ( task ) {
        var target_task = jqueryMap.$list_box.find( 'li[data-id="'+task._id+'"]');
        target_task.addClass('spa-todo-task-completed');
    }


    //


    //---------------------- END DOM METHODS ---------------------

    //------------------- BEGIN EVENT HANDLERS -------------------

    function onListchange ( event ) {
        alert("list changed!");
    }

    function onSubmitTask ( event ) {
        var task_text = jqueryMap.$input.val();
        if ( task_text.trim() === '' ) { return false; }
        configMap.todo_model.add_task( task_text );
        jqueryMap.$input.focus();

        return false;
    }

    function onTaskAdd ( event, task_map ) {
        addTaskToDom( task_map );
        jqueryMap.$input.val( '' );
        jqueryMap.$input.focus();
    }

    function onCompleteTask ( event ) {
        var $clicked  = $( event.target );

        var task_id = $clicked.attr( 'data-id' );

        configMap.todo_model.complete_task(task_id);
        return false;
    }

    function finishCompleteTask (event, task_map ) {
        setTaskStatus( task_map );
    }

    //-------------------- END EVENT HANDLERS --------------------

    //------------------- BEGIN PUBLIC METHODS -------------------

    // Begin public method /redrawList/
    function redrawList ( ) {
        var task_list_db = configMap.todo_model.get_db();
        task_list_db().each( function _task_list_iterator (task, idx) {
            addTaskToDom(task);
        } );

    }


    // End public method /redrawList/

    // Begin public method /configModule/
    // Example   : spa.chat.configModule({ slider_open_em : 18 });
    // Purpose   : Configure the module prior to initialization
    // Arguments :
    //   * todo_model - the todomvc model object which provides
    //       methods to manage the list of tasks the model maintains
    // Action    :
    //   The internal configuration data structure (configMap) is
    //   updated with provided arguments. No other actions are taken.
    // Returns   : true
    // Throws    : JavaScript error object and stack trace on
    //             unacceptable or missing arguments
    //
    function configModule ( input_map ) {
        spa.util.setConfigMap({
            input_map    : input_map,
            settable_map : configMap.settable_map,
            config_map   : configMap
        });
        return true;
    }
    // End public method /configModule/

    // Begin public method /initModule/
    // Example    : spa.todomvc.initModule( $('#div_id') );
    // Purpose    :
    //   Directs Chat to offer its capability to the user
    // Arguments  :
    //   * $container (example: $('#div_id')).
    //     A jQuery collection that should represent
    //     a single DOM container
    // Returns    : true on success, false on failure
    // Throws     : none
    //
    function initModule ( $container ) {
        var $list_box;

        // load chat slider html and jquery cache
        stateMap.$container = $container;
        $container.append( configMap.main_html );
        setJqueryMap();

        // Have $list_box subscribe to jQuery global events
        $list_box = jqueryMap.$list_box;
        $.gevent.subscribe( $list_box, 'spa-addtask', onTaskAdd );
        $.gevent.subscribe( $list_box, 'spa-completetask', finishCompleteTask );
        $.gevent.subscribe( $list_box, 'spa-loadtasks', redrawList );

        // bind user input events
        //jqueryMap.$head.bind(     'utap', onTapToggle );
        jqueryMap.$form.on( 'submit', onSubmitTask );
        jqueryMap.$list_box.on( 'click', 'li', onCompleteTask);

        // draw the taks list
        //redrawList();
    }
    // End public method /initModule/



    // return public methods
    return {
        configModule      : configModule,
        initModule        : initModule,
        redrawlist : redrawList
    };
    //------------------- END PUBLIC METHODS ---------------------
}());
