/**
 * Created by scofield on 5/31/16.
 */

'use strict';

import path from "path";
import app from "../app";

app.factory("todoTools",["$http","$window","$cookies",function($http,$window,$cookies){
    var tools = {
        /**1w
         * 生成api请求地址
         *
         * @param url 请求的api地址
         * @returns {string|*} 返回完整的api请求地址
         */
        apiUrl:function(url){
            return path.join("/api/v1",url);
        },
        /**
         * userInfo 获取用户信息(从localStorage)
         */
        userInfo:{
            /**
             * 获取用户userid
             */
            userid:function() {
                return $window.localStorage.getItem("TODO-userid") == null ? 1 : parseInt($window.localStorage.getItem("TODO-userid"));
            },
            /**
             * 获取用户user_name
             */
            userName:function() {
                return $window.localStorage.getItem("TODO-user_name") == null ? "" : $window.localStorage.getItem("TODO-user_name");
            },
            /**
             * 获取用户上次登录时间
             */
            lastLogin:function() {
                return $window.localStorage.getItem("TODO-last_login") == null ? 0 : parseInt($window.localStorage.getItem("TODO-last_login"));
            },
            /**
             * 获取用户未完成数量
             */
            unfinishNum:function() {
                return $window.localStorage.getItem("TODO-unfinish_num") == null ? 0 : parseInt($window.localStorage.getItem("TODO-unfinish_num"));
            },
            /**
             * 保存用户信息
             *
             * @param userInfo
             */
            save:function(userInfo) {
                if (typeof userInfo == "object") {
                    if (typeof userInfo.userid != 'undefined') {
                        $window.localStorage.setItem("TODO-userid",userInfo.userid);
                    }
                    if (typeof userInfo['user_name'] != 'undefined') {
                        $window.localStorage.setItem("TODO-user_name",userInfo['user_name']);
                    }
                    if (typeof userInfo['last_login'] != 'undefined') {
                        $window.localStorage.setItem("TODO-last_login",userInfo['last_login']);
                    }
                    if (typeof userInfo['unfinish_num'] != 'undefined') {
                        $window.localStorage.setItem("TODO-unfinish_num",userInfo['unfinish_num']);
                    }
                }
            }
        },
        /**
         * 用户是否登录
         *
         * @returns {boolean}
         */
        isLogin:function() {
            return $cookies.get('todo_logintoken') != "" && typeof $cookies.get('todo_logintoken') != 'undefined';
        }
    };

    return tools;
}]);
