/**
 * Created by scofield on 5/31/16.
 */
'use strict';

import app from "../app";
import "../libs/tools";

/**
 * todoModel 关于todo的model操作
 */
app.factory("todoModel",["$resource","todoTools",function($resource,todoTools){
    return {
        /**
         * 获取列表信息
         *
         * @param userid
         * @returns {*|Function}
         */
        list:function(userid) {
            return $resource(todoTools.apiUrl('todo/:userid'),{userid:userid}).get().$promise;
        },
        /**
         * 插入一个新的todo数据
         * @param data
         */
        insert:function(data) {
            return $resource(todoTools.apiUrl('todo/:userid'),{userid:data.userid}).save(data).$promise;
        },
        /**
         * 更新一条todo
         * @param data
         */
        update:function(data) {
            return $resource(todoTools.apiUrl('todo/:userid/:todoid'),{userid:data.userid,todoid:data.id}).update(data).$promise;
        },
        /**
         * 删除一条todo
         * @param data
         */
        delete:function(data) {
            return $resource(todoTools.apiUrl('todo/:userid/:todoid'),{userid:data.userid,todoid:data.id}).delete().$promise;
        },
        /**
         * 获取某todo详情
         * @param data
         * @returns {*|Function}
         */
        detail:function(data) {
            return $resource(todoTools.apiUrl('todo/:userid/:todoid'),{userid:data.userid,todoid:data.id}).get().$promise;
        }
    }
}]);
