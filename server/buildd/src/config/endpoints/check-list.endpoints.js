"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkListRoute_1 = require("../../routes/checkListRoute");
const checkListIdPath = '/checkLists/:checkListId';
const checkListEndpoints = [
    {
        name: 'checkList',
        method: 'post',
        path: '/checkLists',
        handler: checkListRoute_1.createCheckListHandler,
    },
    {
        name: 'checkList',
        method: 'put',
        path: checkListIdPath,
        handler: checkListRoute_1.updateCheckListHandler,
    },
    {
        name: 'checkList',
        method: 'patch',
        path: checkListIdPath,
        handler: checkListRoute_1.updateJobCheckListHandler,
    },
    {
        name: 'checkList',
        method: 'get',
        path: '/checkLists',
        handler: checkListRoute_1.getCheckListsHandler,
    },
    {
        name: 'checkList',
        method: 'get',
        path: checkListIdPath,
        handler: checkListRoute_1.getCheckListHandler,
    },
    {
        name: 'checkList',
        method: 'post',
        path: '/checkLists/:jobId',
        handler: checkListRoute_1.createJobCheckListHandler,
    },
    {
        name: 'checkList',
        method: 'delete',
        path: checkListIdPath,
        handler: checkListRoute_1.deleteCheckListHandler,
    },
];
exports.default = checkListEndpoints;
