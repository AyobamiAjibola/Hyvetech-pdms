"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckListHandler = exports.getCheckListsHandler = exports.updateJobCheckListHandler = exports.createJobCheckListHandler = exports.deleteCheckListHandler = exports.updateCheckListHandler = exports.createCheckListHandler = void 0;
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const CheckListController_1 = __importDefault(require("../controllers/CheckListController"));
exports.createCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.create(req);
    res.status(response.code).json(response);
});
exports.updateCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.update(req);
    res.status(response.code).json(response);
});
exports.deleteCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.delete(req);
    res.status(response.code).json(response);
});
exports.createJobCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.createJobCheckList(req);
    res.status(response.code).json(response);
});
exports.updateJobCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.updateJobCheckList(req);
    res.status(response.code).json(response);
});
exports.getCheckListsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.checkLists(req);
    res.status(response.code).json(response);
});
exports.getCheckListHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await CheckListController_1.default.checkList(req);
    res.status(response.code).json(response);
});
