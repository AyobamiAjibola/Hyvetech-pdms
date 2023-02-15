"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const dao_1 = __importDefault(require("../services/dao"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const constants_1 = require("../config/constants");
const formidable_1 = __importDefault(require("formidable"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
class CheckListController {
    static async create(req) {
        try {
            const { error, value } = joi_1.default.object({
                partners: joi_1.default.array().required().label('Partners'),
                checkList: joi_1.default.string().required().label('Check List Name'),
                description: joi_1.default.string().required().label('Check List Description'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const partners = value.partners;
            const name = value.checkList;
            const description = value.description;
            const $partners = [];
            const exist = await dao_1.default.checkListDAOService.findByAny({
                where: { name },
            });
            if (exist)
                return Promise.reject(CustomAPIError_1.default.response(`Check list with name already exist`, HttpStatus_1.default.BAD_REQUEST.code));
            for (let i = 0; i < partners.length; i++) {
                const partnerId = +partners[i];
                const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
                if (!partner)
                    return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                $partners.push(partner);
            }
            const data = { name, description };
            const checkList = await dao_1.default.checkListDAOService.create(data);
            for (let i = 0; i < $partners.length; i++) {
                await $partners[i].$add('checkLists', [checkList]);
            }
            const checkLists = await dao_1.default.checkListDAOService.findAll({
                include: [{ all: true }],
            });
            const results = checkLists.map(checkList => checkList.toJSON());
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `Created Check List Successfully`,
                results,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async update(req) {
        try {
            const checkListId = req.params.checkListId;
            const { error, value } = joi_1.default.object({
                partners: joi_1.default.array().allow().label('Partners'),
                checkList: joi_1.default.string().allow('').label('Check List Name'),
                description: joi_1.default.string().allow('').label('Check List Description'),
            }).validate(req.body);
            const partnerIds = value.partners;
            const partners = [];
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const checkList = await dao_1.default.checkListDAOService.findById(+checkListId);
            if (!checkList)
                return Promise.reject(CustomAPIError_1.default.response(`Check List does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            for (let i = 0; i < partnerIds.length; i++) {
                const partnerId = +partnerIds[i];
                const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
                if (!partner)
                    return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                partners.push(partner);
            }
            const checklistPartners = await checkList.$get('partners');
            await checkList.$remove('partners', checklistPartners);
            await checkList.update({
                name: value.checkList,
                description: value.checkList,
            });
            for (const partner of partners)
                await partner.$add('checkLists', [checkList]);
            const checkLists = await dao_1.default.checkListDAOService.findAll({
                include: [{ all: true }],
            });
            const results = checkLists.map(checkList => checkList.toJSON());
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `Updated Check List Successfully`,
                results,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async delete(req) {
        try {
            const checkListId = req.params.checkListId;
            const checkList = await dao_1.default.checkListDAOService.findById(+checkListId);
            if (!checkList)
                return Promise.reject(CustomAPIError_1.default.response(`Check List does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const partners = await checkList.$get('partners');
            if (!partners.length)
                return Promise.reject(CustomAPIError_1.default.response(`Partner does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            for (const partner of partners) {
                await partner.$remove('checkLists', checkList);
            }
            await checkList.destroy();
            return Promise.resolve({
                code: HttpStatus_1.default.OK.code,
                message: 'CheckList deleted successfully.',
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async createJobCheckList(req) {
        const jobId = req.params.jobId;
        // eslint-disable-next-line sonarjs/cognitive-complexity
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err)
                    return reject(CustomAPIError_1.default.response(err, HttpStatus_1.default.BAD_REQUEST.code));
                try {
                    const { error, value } = joi_1.default.object({
                        checkList: joi_1.default.string().required().label('Check List'),
                        vehicleInfo: joi_1.default.string().allow('').label('Vehicle Info'),
                    }).validate(fields);
                    if (error)
                        return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                    const job = await dao_1.default.jobDAOService.findById(+jobId);
                    if (!job)
                        return reject(CustomAPIError_1.default.response(`Job does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const vehicle = await job.$get('vehicle');
                    if (!vehicle)
                        return reject(CustomAPIError_1.default.response(`Vehicle does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const technician = await job.$get('technician');
                    if (!technician)
                        return reject(CustomAPIError_1.default.response(`Technician does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const checkList = value.checkList;
                    const checkListJSON = JSON.parse(checkList);
                    const sections = checkListJSON.sections;
                    const images = [];
                    const basePath = `${constants_1.UPLOAD_BASE_PATH}/checklists`;
                    for (const section of sections) {
                        const questions = section.questions;
                        for (const question of questions) {
                            if (question.images) {
                                for (const image of question.images) {
                                    images.push(image);
                                }
                            }
                        }
                    }
                    for (const image of images) {
                        const { originalFilename, filepath } = files[image.title];
                        image.url = await Generic_1.default.getImagePath({
                            tempPath: filepath,
                            filename: originalFilename,
                            basePath,
                        });
                    }
                    const newSections = sections.map(section => {
                        section.questions.forEach(question => {
                            question.images = images;
                        });
                        return section;
                    });
                    const checklistValues = JSON.stringify({
                        ...checkListJSON,
                        sections: newSections,
                    });
                    await vehicle.update({
                        onInspection: false,
                        isBooked: false,
                    });
                    await technician.update({
                        hasJob: false,
                    });
                    await job.update({
                        jobDate: new Date(),
                        status: constants_1.JOB_STATUS.complete,
                        checkList: checklistValues,
                    });
                    const response = {
                        code: HttpStatus_1.default.OK.code,
                        message: `Successfully created Job Check List`,
                        result: job,
                    };
                    resolve(response);
                }
                catch (e) {
                    return reject(e);
                }
            });
        });
    }
    static async updateJobCheckList(req) {
        const checkListId = req.params.checkListId;
        try {
            const { error, value } = joi_1.default.object({
                sections: joi_1.default.array().items(joi_1.default.any()).required(),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const sections = value.sections;
            const checkList = await dao_1.default.checkListDAOService.findById(+checkListId, { include: [{ all: true }] });
            if (!checkList)
                return Promise.reject(CustomAPIError_1.default.response(`Check List does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            await checkList.update({ sections });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'Added Check List Section Successfully',
                result: checkList,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async checkLists(req) {
        try {
            const checkLists = await dao_1.default.checkListDAOService.findAll({
                include: [{ all: true }],
            });
            const results = checkLists.map(checkList => {
                const result = checkList.toJSON();
                if (result.sections)
                    result.sections = result.sections.map(section => JSON.parse(section));
                else
                    result.sections = JSON.parse(JSON.stringify([constants_1.INITIAL_CHECK_LIST_VALUES]));
                return result;
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async checkList(req) {
        const checkListId = req.params.checkListId;
        try {
            const checkList = await dao_1.default.checkListDAOService.findById(+checkListId, {
                include: [{ all: true }],
            });
            if (!checkList)
                return Promise.reject(CustomAPIError_1.default.response(`Check List not found`, HttpStatus_1.default.NOT_FOUND.code));
            const result = checkList.toJSON();
            if (result.sections)
                result.sections = result.sections.map(section => JSON.parse(section));
            else
                result.sections = JSON.parse(JSON.stringify([constants_1.INITIAL_CHECK_LIST_VALUES]));
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                result,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
exports.default = CheckListController;
