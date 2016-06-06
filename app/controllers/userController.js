/**
 * Created by scofield on 5/31/16.
 */
'use strict';

import app from "../app.js";
import "../models/userModel";
import "../libs/tools";

/**
 * userController 用户相关的controller
 */
app.controller("userController",["$scope","userModel","md5","$state","todoTools",function($scope,userModel,md5,$state,todoTools){
    // 用户信息
    $scope.userInfo = {
        userid:0,
        user_name:"",
        create_time:0,
        last_login:0,
        unfinish_num:0
    };

    // 用户登录信息相关
    $scope.userLoginInfo = {
        user_name:"",
        password:""
    };

    $scope.validate = {
        msg:'',
        error:{
            user_name:false,
            password:false
        }
    };

    // 错误提示
    $scope.errMsg = "";

    // 用户登录
    $scope.login = () => {
        // 验证用户信息
        if( !/^[a-zA-Z0-9]{6,16}$/.test($scope.userLoginInfo.user_name) ) {
            $scope.validate.msg = "请输入正确的用户名(长度6-16位)";
            $scope.validate.error.user_name = true;
            return;
        }
        if( $scope.userLoginInfo.password.length < 6 || $scope.userLoginInfo.password.length > 16 ) {
            $scope.validate.msg = "密码长度在6-16位之间";
            $scope.validate.error.password = true;
            return;
        }

        let loginInfo = {
            user_name:$scope.userLoginInfo.user_name,
            password:md5.createHash($scope.userLoginInfo.password)
        };

        userModel.login(loginInfo).then((data) => {
            $scope.validate.msg = '';
            $scope.validate.error.user_name = false;
            $scope.validate.error.password = false;

            todoTools.userInfo.save(data);

            $state.go("todo.list");
        }, (response) => {
            $scope.validate.error.user_name = false;
            $scope.validate.error.password = false;
            $scope.validate.msg = response.data.errmsg + "(" + "错误代码:" + response.data.errcode + ")";
        });
    };
    
    if(todoTools.isLogin()) {
        $state.go("todo.list");
    }
}]);
