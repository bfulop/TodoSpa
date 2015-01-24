/**
 * Created by bfulop on 13/12/14.
 */
module.exports = function ($) {

    $.root = 'http://localhost:3000/';

    $.mapper = function (url) {
        if (url.indexOf('jquery') >= 0) {
            return {
                instrument: false
            };
        }

        return {
            instrument: {
                prettify: false,
                objectDump: {
                    depth: 2,
                    propertyNumber: 4,
                    arrayLength: 3,
                    stringLength: 50
                }
            }
        };
    };

    //$.eventFilter = {
    //    globalScope: false,
    //    timeout: true,
    //    interval: true,
    //    events: ['click']
    //};
};