/**
 * Created by scofield on 5/31/16.
 */
'use strict';

import app from "../app";
import "../libs/tools";

/**
 * userModel 关于user的一些model
 */
app.factory("userModel",["$resource","todoTools",function ($resource,todoTools) {
    return {
        /**
         * 用户登录
         * @param data
         * @returns {*|Function}
         */
        login:function(data) {
            return $resource(todoTools.apiUrl('login')).save(data).$promise;
        }
    }
}]);