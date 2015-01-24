/**
 * Created by bfulop on 08/01/15.
 */

/*
 * spa.shell.js
 * Shell module for SPA
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global $, spa */

spa.shell = (function () {
    'use strict';
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html : String()
            + '<div class="spa-shell"></div>'
        },
        stateMap = {
            $container  : undefined
        },
        jqueryMap = {}
        ;


    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN UTILITY METHODS ------------------

    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    function setJqueryMap () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container : $container
        };
    }
    // End DOM method /setJqueryMap/


    // End DOM method /changeAnchorPart/
    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN EVENT HANDLERS -------------------

    //-------------------- END EVENT HANDLERS --------------------

    //---------------------- BEGIN CALLBACKS ---------------------

    // End callback method /setChatAnchor/
    //----------------------- END CALLBACKS ----------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin Public method /initModule/
    function initModule ( $container ) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJqueryMap();


        // configure and initialize feature modules
        spa.todo.configModule({
            todo_model    : spa.model.todo
        });
        spa.todo.initModule( jqueryMap.$container );

    }
    // End PUBLIC method /initModule/

    return { initModule : initModule };
    //------------------- END PUBLIC METHODS ---------------------
}());
