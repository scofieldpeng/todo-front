/**
 * Created by scofield on 5/31/16.
 */
'use strict';

import app from "./app";

import "./controllers/todoController";
import "./controllers/userController";

import "./libs/tools";

app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/todo/list");

    $stateProvider
    // todo列表
    .state('todo',{
        abstract:true,
        url:"/todo",
        template:"<div ui-view></div>"
    })
    .state('todo.list',{
        url:"/list",
        templateUrl:"/statics/tpls/todo/list.html",
        controller:"todoController"
    })
    // todo详情
    .state('todo.detail',{
        url:"/detail/:todoid",
        templateUrl:'/statics/tpls/todo/detail.html',
        controller:"todoController"
    })
    // todo新建
    .state('todo.insert',{
        url:'/insert',
        templateUrl:'/statics/tpls/todo/edit.html',
        controller:"todoController"
    })
    // todo编辑
    .state('todo.edit',{
        url:"/edit/:todoid",
        templateUrl:'/statics/tpls/todo/edit.html',
        controller:"todoController"
    })
    // todo删除
    .state('todo.delete',{
        url:"/delete/:todoid",
        templateUrl:"/statics/tpls/todo/delete.html",
        controller:"todoController"
    })
    // 用户登录
    .state('login',{
        url:"/user/login",
        templateUrl:"/statics/tpls/user/login.html",
        controller:"userController"
    });
}]);

app.run(["$rootScope","$state","todoTools",function($rootScope,$state,todoTools){
    // publicUrls 不需要登录的states
    let publicUrls = ["todo","todo.list","user.login"];
    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams,error) => {
        $rootScope.previousState = fromState.name;
        // 判断用户是否登录
        if (publicUrls.indexOf(toState.name) == -1) {
            console.log(todoTools.isLogin());
            if (!todoTools.isLogin()) {
                $state.go('login');
            }
        }
    });
}]);
