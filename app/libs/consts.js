/**
 * Created by scofield on 6/5/16.
 */

'use strict';

import app from "../app";

app.factory("todo-consts",function(){
    let consts = {
        DEFAULT_CATEGORYID:0, // 默认的categoryid
        DEFAULT_TODONAME:"",
        DEFAULT_TODOSTATUS:0, // 默认新建状态
        TODO_CATEGORYLIST :[
            {
                id:0,
                name:"全部"
            },
            {
                id:1,
                name:"已完成"
            },
            {
                id:2,
                name:"待完成"
            }
        ] // 默认的todo状态列表
    };

    return consts;
});
