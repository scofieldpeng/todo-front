/**
 * Created by scofield on 5/31/16.
 */

var app = angular.module("todo",[require("angular-ui-router"),require("angular-resource"),require('angular-cookies'),require('angular-md5')]);
    app.value('TODO_VERSON','beta 1.0');

    app.config(["$resourceProvider",function($resourceProvider){
        $resourceProvider.defaults.actions.update = {
            "method":"PUT"
        };
    }]);

export default app;
