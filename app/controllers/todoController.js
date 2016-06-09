/**
 * Created by scofield on 5/31/16.
 */
"use strict";
import app from '../app';

import "../libs/consts";
import "../libs/tools";
import "../models/todoModel";

/**
 * todo todo的一些controller
 */
app.controller("todoController",["$scope","$window","todoTools","todoModel","$state","$stateParams","todo-consts",function($scope,$window,todoTools,todoModel,$state,$stateParams,todoConsts){
    // 用户的todo列表
    $scope.todoList = [];
    // 用户的todo列表(
    $scope.filterList = [];

    // 用户待完成数量
    $scope.todoNum = 0;

    $scope.title = "新建";

    // 默认的新建todo
    $scope.newTodo = {};

    // 待完成todo数量
    $scope.unfinishNum = 0;

    /**
     * 初始化新建todo对象
     */
    $scope.initNewTodo = () => {
        $scope.newTodo = {
            todo_name:todoConsts.DEFAULT_TODONAME,
            userid:todoTools.userInfo.userid() == 0 ? 1 : parseInt(todoTools.userInfo.userid()),
            categoryid:todoConsts.DEFAULT_CATEGORYID,
            status:todoConsts.DEFAULT_TODOSTATUS,
            remark:""
        };
    };

    // 状态列表
    $scope.todoStatusCateogries = todoConsts.TODO_CATEGORYLIST;
    $scope.currentStatus = todoConsts.TODO_CATEGORYLIST[0].id;

    // 是否正在载入中
    $scope.loading = true;

    $scope.stateParams = $stateParams;

    $scope.validate = {
        msg:"",
        error:{
            todo_name:false,
            remark:false,
            start_time:false,
            end_time:false
        }
    };

    /**
     * 获取todo列表
     */
    $scope.fetchList = () => {
        if(todoTools.userInfo.userid() != 0) {
            todoModel.list(todoTools.userInfo.userid).then(function(data){
                $scope.loading = false;
                $scope.filterList = $scope.todoList = data.list;
                for(let i=0,len=$scope.todoList.length;i<len;i++) {
                    if(data.list[i].status != 2) {
                        $scope.unfinishNum += 1;
                    }
                }
            },function(){
                $scope.loading = false;
            });
        }
    };

    /**
     * 选择某一个setStatus的状态
     * @param status
     */
    $scope.filterStatusList  = (status) => {
        $scope.currentStatus = status;
        $scope.filterList = $scope.todoList.filter( (item) => {
            switch($scope.currentStatus) {
                case 0:
                    return true;
                case 1:
                    return item.status == 2;
                case 2:
                default:
                    return item.status == 0;
            }
        });
    };

    /**
     * 获取详情
     */
    $scope.getDetail = () => {
        if(typeof $stateParams.todoid != 'undefined') {
            $scope.title = "编辑";
            todoModel.detail({
                userid: todoTools.userInfo.userid(),
                id:$stateParams.todoid
            }).then( (data) => {
                $scope.newTodo = data;
                if ($scope.newTodo.start_time != 0 ) {
                    $scope.newTodo.start_time = new Date($scope.newTodo.start_time * 1000);
                }
                if ($scope.newTodo.end_time != 0 ) {
                    $scope.newTodo.end_time = new Date($scope.newTodo.end_time * 1000);
                }
            }, (response) => {
                let errMsg = "请求错误";
                if(typeof response.data == 'object' && typeof response.data.errmsg != 'undefined') {
                    errMsg = response.data.errmsg + "(错误代码:" + response.data.errcode + ")";
                }
                $window.alert(errMsg);
                $state.go("todo.list");
            });
        } else {
            $scope.initNewTodo();
            $scope.title = "新建";
        }
    };

    /**
     * 跳转到todo详情
     * @param todoid
     */
    $scope.directToDetail = (todoid) => {
        $state.go('todo.edit',{
            userid:todoTools.userInfo.userid(),
            todoid:todoid
        });
    };

    /**
     * 添加一个todo
     */
    $scope.saveTodo = () => {
        if($scope.newTodo.todo_name.length<3|| $scope.newTodo.todo_name.length>30) {
            $scope.validate.msg = "TODO名称长度不合法:3-30个字符之间!";
            $scope.validate.error.todo_name = true;
            return;
        }

        let startTimeStamp = 0,
            endTimestamp = 0;

        startTimeStamp = parseInt(Date.parse(new Date($scope.newTodo.start_time)) / 1000);
        endTimestamp = parseInt(Date.parse(new Date($scope.newTodo.end_time)) / 1000);
        
        if (startTimeStamp != 0 && endTimestamp != 0) {
            if (startTimeStamp > endTimestamp) {
                $scope.validate.error.start_time = true;
                $scope.validate.error.end_time = true;
                $scope.validate.msg = "最晚时间不能小于开始时间";
                return;
            }
        }

        $scope.newTodo.start_time = startTimeStamp;
        $scope.newTodo.end_time = endTimestamp;

        let promise = null;
        if(typeof $stateParams.todoid != 'undefined') {
            promise = todoModel.update($scope.newTodo);
        } else {
            promise = todoModel.insert($scope.newTodo);
        }

        promise.then((data)=>{
            $scope.validate.msg = "";
            $scope.validate.error.todo_name = false;
            $scope.validate.error.remark = false;
            $scope.todoList.splice(0,0,data);
            $state.go("todo.list");
        },(resp)=>{
            if(resp.status == 401) {
                $state.go("login");
                return;
            }
            $scope.validate.msg = "";
            $scope.validate.error.todo_name = false;
            $scope.validate.error.remark = false;
            $window.alert(resp.data.errmsg);
        });
    };

    /**
     * 更新todo状态
     * @param todoid
     */
    $scope.updateStatus = (todoid) => {
        console.log(todoid);
        let todoItem = $scope.filterList.find((item) => {
            if (item.id == todoid) {
                item.status = item.status == 2 ? 0 : 2;
                if(item.status==2){
                    $scope.unfinishNum--;
                } else {
                    $scope.unfinishNum++;
                }
            }
            return item.id === todoid;
        });

        todoModel.update(todoItem).then( (data) => {
        }, (response) => {
            if(response.status == 401) {
                $state.go("login");
                return;
            }
            $window.alert(response.data.errmsg);
        });
    };

    /**
     * 删除一个todo
     * @param todoid
     */
    $scope.deleteTodo = (todoid) => {
        if(!$window.confirm("确定要删除该条todo?")){
            return;
        }
        todoModel.delete({
            userid:todoTools.userInfo.userid(),
            id:todoid
        }).then( (data) => {
            $state.go("todo.list");
        }, (response) => {
            if(response.status == 401) {
                $state.go("login");
                return;
            }
            let errMsg = "请求错误";
            if(typeof response.data == 'object' && typeof response.data.errmsg != 'undefined') {
                errMsg = response.data.errmsg + "(错误代码:" + response.data.errcode + ")";
            }
            $window.alert(errMsg);
        });
    };

    /**
     * 时间戳转日期
     * @param timestamp
     * @returns {string}
     */
    $scope.timestampToDate = (timestamp) => {
        let dateObj = new Date(timestamp*1000),
            date = "";

        date = dateObj.getFullYear();
        date += "-" + (parseInt(dateObj.getMonth())+1);
        date += "-" + dateObj.getDate();
        return date;
    };
}]);

