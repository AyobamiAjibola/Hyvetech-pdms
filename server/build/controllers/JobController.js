"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const dao_1 = __importDefault(require("../services/dao"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const RideShareDriverSubscription_1 = __importDefault(require("../models/RideShareDriverSubscription"));
const CustomerSubscription_1 = __importDefault(require("../models/CustomerSubscription"));
const Technician_1 = __importDefault(require("../models/Technician"));
const RideShareDriver_1 = __importDefault(require("../models/RideShareDriver"));
const Customer_1 = __importDefault(require("../models/Customer"));
const constants_1 = require("../config/constants");
const Generic_1 = __importDefault(require("../utils/Generic"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const Partner_1 = __importDefault(require("../models/Partner"));
const Contact_1 = __importDefault(require("../models/Contact"));
const formidable_1 = __importDefault(require("formidable"));
const AppEventEmitter_1 = require("../services/AppEventEmitter");
const promises_1 = __importDefault(require("fs/promises"));
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
const SUBSCRIPTION_ID = 'Subscription Id';
const TECHNICIAN_ID = 'Technician Id';
const PARTNER_ID = 'Partner Id';
const CHECKLIST_ID = 'Check List Id';
class JobController {
    static async jobs(partnerId) {
        let jobs = [];
        try {
            if (partnerId) {
                const partner = await dao_1.default.partnerDAOService.findById(partnerId);
                if (!partner)
                    return Promise.reject(CustomAPIError_1.default.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                jobs = await partner.$get('jobs', {
                    include: [RideShareDriverSubscription_1.default, CustomerSubscription_1.default, Technician_1.default],
                });
            }
            jobs = await dao_1.default.jobDAOService.findAll({
                include: [RideShareDriverSubscription_1.default, CustomerSubscription_1.default, Technician_1.default],
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: HttpStatus_1.default.OK.value,
                results: jobs,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async job(req) {
        const jobId = req.params.jobId;
        let result = null;
        try {
            const job = await dao_1.default.jobDAOService.findById(+jobId, {
                include: [
                    RideShareDriverSubscription_1.default,
                    CustomerSubscription_1.default,
                    Technician_1.default,
                    Vehicle_1.default,
                    { model: Partner_1.default, include: [Contact_1.default] },
                ],
            });
            if (job && typeof job.checkList !== 'object') {
                const checkList = JSON.parse(job.checkList);
                if (checkList.sections) {
                    checkList.sections = checkList.sections.map((section) => {
                        if (typeof section !== 'string')
                            return section;
                        else
                            return JSON.parse(section);
                    });
                }
                else
                    checkList.sections = JSON.parse(JSON.stringify([constants_1.INITIAL_CHECK_LIST_VALUES]));
                result = Object.assign({}, {
                    ...job.toJSON(),
                    checkList,
                });
            }
            else
                result = job;
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
    static async assignJob(req) {
        try {
            const { value, error } = joi_1.default.object({
                subscriptionId: joi_1.default.any().required().label(SUBSCRIPTION_ID),
                techId: joi_1.default.number().required().label(TECHNICIAN_ID),
                partnerId: joi_1.default.number().required().label(PARTNER_ID),
                checkListId: joi_1.default.number().required().label(CHECKLIST_ID),
                jobId: joi_1.default.number().allow().label('Job Id'),
                client: joi_1.default.string().allow('').label('Client'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            if (value.client === 'Driver')
                return this.assignDriverJob(req);
            if (value.client === 'Customer')
                return this.assignCustomerJob(req);
            return Promise.reject({
                code: HttpStatus_1.default.BAD_REQUEST.code,
                message: HttpStatus_1.default.BAD_REQUEST.value,
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async assignDriverJob(req) {
        const partnerId = req.params.partnerId;
        const value = req.body;
        const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const checkList = await dao_1.default.checkListDAOService.findById(value.checkListId);
        if (!checkList)
            return Promise.reject(CustomAPIError_1.default.response(`Check List does not exist. You need a check list to carry out inspection`, HttpStatus_1.default.NOT_FOUND.code));
        const technician = await dao_1.default.technicianDAOService.findById(+value.techId);
        if (!technician)
            return Promise.reject(CustomAPIError_1.default.response(`Technician does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const jobValues = {
            status: constants_1.JOB_STATUS.pending,
            hasJob: true,
        };
        const rideShareSub = await dao_1.default.rideShareDriverSubscriptionDAOService.findById(+value.subscriptionId);
        if (!rideShareSub)
            return Promise.reject(CustomAPIError_1.default.response(`Subscription does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const vehicle = await rideShareSub.$get('vehicles', {
            include: [RideShareDriver_1.default],
        });
        if (!vehicle.length)
            return Promise.reject(CustomAPIError_1.default.response(`Vehicle not subscribed to plan`, HttpStatus_1.default.NOT_FOUND.code));
        const planLabel = Generic_1.default.generateSlug(`${rideShareSub.planType}`);
        const plan = await dao_1.default.planDAOService.findByAny({
            where: {
                label: planLabel,
            },
        });
        if (!plan)
            return Promise.reject(CustomAPIError_1.default.response(`Plan: ${planLabel} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const owner = vehicle[0].rideShareDriver;
        Object.assign(jobValues, {
            type: rideShareSub.programme,
            name: `${rideShareSub.planType} Job`,
            vehicleOwner: `${owner.firstName} ${owner.lastName}`,
        });
        const job = await dao_1.default.jobDAOService.create(jobValues);
        //associate job with vehicle
        await vehicle[0].$add('jobs', [job]);
        //associate job with subscription
        await rideShareSub.$add('jobs', [job]);
        //create job check list
        await job.update({ checkList: JSON.stringify(checkList.toJSON()) });
        //associate partner with job
        await partner.$add('jobs', [job]);
        //associate technician with jobs
        await technician.$add('jobs', [job]);
        //update technician job status
        await technician.update({ hasJob: true });
        //update vehicle job status
        if (rideShareSub.programme.match(new RegExp('inspection', 'i'))?.input)
            await vehicle[0].update({ onInspection: true });
        if (rideShareSub.programme.match(new RegExp('maintenance', 'i'))?.input)
            await vehicle[0].update({ onMaintenance: true });
        //increment mode of service count
        await this.incrementServiceModeCount(plan, rideShareSub);
        const jobs = await partner.$get('jobs');
        AppEventEmitter_1.appEventEmitter.emit(constants_1.ASSIGN_DRIVER_JOB, {
            techId: +value.techId,
            partner,
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Assigned Job Successfully.`,
            results: jobs,
        };
        return Promise.resolve(response);
    }
    static async assignCustomerJob(req) {
        const partnerId = req.params.partnerId;
        const value = req.body;
        const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const checkList = await dao_1.default.checkListDAOService.findById(value.checkListId);
        if (!checkList)
            return Promise.reject(CustomAPIError_1.default.response(`Check List does not exist. You need a check list to carry out inspection`, HttpStatus_1.default.NOT_FOUND.code));
        const technician = await dao_1.default.technicianDAOService.findById(+value.techId);
        if (!technician)
            return Promise.reject(CustomAPIError_1.default.response(`Technician does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const jobValues = {
            status: constants_1.JOB_STATUS.pending,
        };
        const customerSub = await dao_1.default.customerSubscriptionDAOService.findById(+value.subscriptionId);
        if (!customerSub)
            return Promise.reject(CustomAPIError_1.default.response(`Subscription does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const vehicle = await customerSub.$get('vehicles', {
            include: [Customer_1.default],
        });
        if (!vehicle.length)
            return Promise.reject(CustomAPIError_1.default.response(`Vehicle not subscribed to plan`, HttpStatus_1.default.NOT_FOUND.code));
        const planLabel = Generic_1.default.generateSlug(`${customerSub.planType}`);
        const plan = await dao_1.default.planDAOService.findByAny({
            where: {
                label: planLabel,
            },
        });
        const owner = vehicle[0].customer;
        Object.assign(jobValues, {
            type: customerSub.programme,
            name: `${customerSub.planType} Job`,
            vehicleOwner: `${owner.firstName} ${owner.lastName}`,
        });
        const job = await dao_1.default.jobDAOService.create(jobValues);
        //associate job with vehicle
        await vehicle[0].$add('jobs', [job]);
        //associate job with subscription
        await customerSub.$add('jobs', [job]);
        //associate job with check list
        await job.update({ checkList: JSON.stringify(checkList.toJSON()) });
        //associate partner with job
        await partner.$add('jobs', [job]);
        //associate technician with jobs
        await technician.$add('jobs', [job]);
        //update technician job status
        await technician.update({ hasJob: true });
        //update vehicle job status
        if (customerSub.programme.match(new RegExp('inspection', 'i'))?.input)
            await vehicle[0].update({ onInspection: true });
        if (customerSub.programme.match(new RegExp('maintenance', 'i'))?.input)
            await vehicle[0].update({ onMaintenance: true });
        const jobs = await partner.$get('jobs');
        if (!plan) {
            if (planLabel.search(/estimate/i) !== -1) {
                const response = {
                    code: HttpStatus_1.default.OK.code,
                    message: `Assigned Job Successfully.`,
                    results: jobs,
                };
                return Promise.resolve(response);
            }
            else
                return Promise.reject(CustomAPIError_1.default.response(`Plan: ${planLabel} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        }
        else
            await this.incrementServiceModeCount(plan, customerSub);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Assigned Job Successfully.`,
            results: jobs,
        };
        return Promise.resolve(response);
    }
    static async reassignJob(req) {
        try {
            const { error } = joi_1.default.object({
                jobId: joi_1.default.number().required().label('Job Id'),
                client: joi_1.default.string().required().label('Client'),
                subscriptionId: joi_1.default.number().required().label(SUBSCRIPTION_ID),
                techId: joi_1.default.number().required().label(TECHNICIAN_ID),
                partnerId: joi_1.default.number().required().label(PARTNER_ID),
                checkListId: joi_1.default.number().required().label(CHECKLIST_ID),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            //reassign job
            return this.doReassignJob(req);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async cancelJob(req) {
        try {
            const { error } = joi_1.default.object({
                jobId: joi_1.default.number().required().label('Job Id'),
                client: joi_1.default.string().required().label('Client'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            //cancel job
            await this.doCancelJob(req);
            return Promise.resolve({
                code: HttpStatus_1.default.OK.code,
                message: 'Job canceled successfully.',
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async approveJobCheckList(req) {
        const jobId = req.params.jobId;
        try {
            const { error, value } = joi_1.default.object({
                jobId: joi_1.default.number().required().label('Job Id'),
                approved: joi_1.default.boolean().required().label('Approved'),
            }).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const job = await dao_1.default.jobDAOService.findById(+jobId, {
                include: [
                    RideShareDriverSubscription_1.default,
                    CustomerSubscription_1.default,
                    Technician_1.default,
                    Vehicle_1.default,
                    { model: Partner_1.default, include: [Contact_1.default] },
                ],
            });
            if (!job)
                return Promise.reject(CustomAPIError_1.default.response(`Job does not exist`, HttpStatus_1.default.NOT_FOUND.code));
            const checkList = job.checkList;
            if (!checkList.length)
                return Promise.reject(CustomAPIError_1.default.response(`Can not approve job, checklist does not available.`, HttpStatus_1.default.NOT_FOUND.code));
            const iCheckList = JSON.parse(checkList);
            let message;
            if (value.approved)
                message = 'Approved';
            else
                message = 'Not approved';
            iCheckList.approvedByGarageAdmin = value.approved;
            await job.update({
                checkList: JSON.stringify(iCheckList),
            });
            const list = JSON.parse(job.checkList);
            const result = {
                ...job.toJSON(),
                checkList: list,
            };
            AppEventEmitter_1.appEventEmitter.emit(constants_1.APPROVE_JOB, { job: result });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message,
                result,
            };
            return Promise.resolve(response);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    static async updateJobVehicle(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                try {
                    const { error, value } = joi_1.default.object({
                        vehicleInfo: joi_1.default.string().required().label('Vehicle Info'),
                    }).validate(fields);
                    if (error)
                        return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                    const jobId = req.params.jobId;
                    const job = await dao_1.default.jobDAOService.findById(+jobId);
                    if (!job)
                        return reject(CustomAPIError_1.default.response(`Job does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const vehicle = await job.$get('vehicle');
                    if (!vehicle)
                        return reject(CustomAPIError_1.default.response(`Vehicle does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    const vehicleInfo = JSON.parse(value.vehicleInfo);
                    const basePath = `${constants_1.UPLOAD_BASE_PATH}/vehicles`;
                    const vehicleUpdateData = {
                        make: vehicleInfo.make,
                        model: vehicleInfo.model,
                        modelYear: vehicleInfo.modelYear,
                        plateNumber: vehicleInfo.plateNumber,
                        vin: vehicleInfo.vin,
                        frontTireSpec: vehicleInfo.frontTireSpec,
                        rearTireSpec: vehicleInfo.rearTireSpec,
                    };
                    const jobUpdateData = {
                        mileageUnit: vehicleInfo.mileageUnit,
                        mileageValue: vehicleInfo.mileageValue,
                    };
                    for (const jobKey in job.toJSON()) {
                        if (await Generic_1.default.fileExist(jobKey))
                            await promises_1.default.rm(jobKey);
                    }
                    for (const file of Object.keys(files)) {
                        const { originalFilename, filepath } = files[file];
                        Object.assign(jobUpdateData, {
                            [file]: await Generic_1.default.getImagePath({
                                basePath,
                                tempPath: filepath,
                                filename: originalFilename,
                            }),
                        });
                    }
                    await job.update(jobUpdateData);
                    const result = await vehicle.update(vehicleUpdateData);
                    const response = {
                        code: HttpStatus_1.default.OK.code,
                        message: HttpStatus_1.default.OK.value,
                        result: result,
                    };
                    resolve(response);
                }
                catch (e) {
                    return reject(e);
                }
            });
        });
    }
    static async uploadJobReport(req) {
        const jobId = req.params.jobId;
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                try {
                    if (err)
                        return reject(CustomAPIError_1.default.response(err, HttpStatus_1.default.BAD_REQUEST.code));
                    const job = await dao_1.default.jobDAOService.findById(+jobId);
                    if (!job)
                        return reject(CustomAPIError_1.default.response(`Job does not exist`, HttpStatus_1.default.NOT_FOUND.code));
                    if (!job.reportFileUrl) {
                        const basePath = `${constants_1.UPLOAD_BASE_PATH}/reports`;
                        const jobUpdateData = {};
                        for (const file of Object.keys(files)) {
                            const { originalFilename, filepath } = files[file];
                            Object.assign(jobUpdateData, {
                                [file]: await Generic_1.default.getImagePath({
                                    basePath,
                                    tempPath: filepath,
                                    filename: originalFilename,
                                }),
                            });
                        }
                        await job.update(jobUpdateData);
                    }
                    return resolve({
                        code: HttpStatus_1.default.OK.code,
                        message: HttpStatus_1.default.OK.value,
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    static async doReassignJob(req) {
        const partnerId = req.params.partnerId;
        const value = req.body;
        const partner = await dao_1.default.partnerDAOService.findById(+partnerId);
        if (!partner)
            return Promise.reject(CustomAPIError_1.default.response(`Partner with Id: ${partnerId} does not exist`, HttpStatus_1.default.NOT_FOUND.code));
        const job = await dao_1.default.jobDAOService.findById(value.jobId);
        if (!job)
            throw new Error(`Job does not exist`);
        let driverSub = null;
        let customerSub = null;
        let vehicle = null;
        const prevTechnician = await job.$get('technician');
        if (!prevTechnician)
            throw new Error(`Assigned Technician does not exist`);
        await prevTechnician.$remove('jobs', [job]);
        await prevTechnician.update({ hasJob: false });
        const technician = await dao_1.default.technicianDAOService.findById(value.techId);
        if (!technician)
            throw new Error(`Reassigned Technician does not exist`);
        if (value.client === 'Driver')
            driverSub = await job.$get('rideShareDriverSubscription');
        if (value.client === 'Customer')
            customerSub = await job.$get('customerSubscription');
        if (driverSub) {
            vehicle = await driverSub.$get('vehicles');
            //associate job with subscription
            await driverSub.$add('jobs', [job]);
        }
        if (customerSub) {
            vehicle = await customerSub.$get('vehicles');
            await customerSub.$add('jobs', [job]);
        }
        if (!vehicle)
            throw new Error(`Vehicle does not exist`);
        //associate job with vehicle
        await vehicle[0].$add('jobs', [job]);
        //associate technician with jobs
        await technician.$add('jobs', [job]);
        //update technician job status
        await technician.update({ hasJob: true });
        const jobs = await partner.$get('jobs');
        AppEventEmitter_1.appEventEmitter.emit(constants_1.ASSIGN_DRIVER_JOB, {
            techId: +value.techId,
            partner,
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Reassigned Job Successfully.`,
            results: jobs,
        };
        return Promise.resolve(response);
    }
    static async doCancelJob(req) {
        const value = req.body;
        const job = await dao_1.default.jobDAOService.findById(value.jobId);
        if (!job)
            throw new Error(`Job does not exist`);
        let driverSub = null;
        let customerSub = null;
        const technician = await job.$get('technician');
        const vehicle = await job.$get('vehicle');
        if (!technician)
            throw new Error(`Technician does not exist`);
        if (!vehicle)
            throw new Error(`Vehicle does not exist`);
        if (value.client === 'Driver')
            driverSub = await job.$get('rideShareDriverSubscription');
        if (value.client === 'Customer')
            customerSub = await job.$get('customerSubscription');
        if (driverSub) {
            await driverSub.$remove('jobs', [job]);
            await driverSub.update({
                driveInCount: --driverSub.driveInCount,
                mobileCount: --driverSub.mobileCount,
            });
            //update vehicle job status
            if (driverSub.programme.match(new RegExp('inspection', 'i'))?.input)
                await vehicle.update({ onInspection: false });
            if (driverSub.programme.match(new RegExp('maintenance', 'i'))?.input)
                await vehicle.update({ onMaintenance: false });
        }
        if (customerSub) {
            await customerSub.$remove('jobs', [job]);
            await customerSub.update({
                driveInCount: --customerSub.driveInCount,
                mobileCount: --customerSub.mobileCount,
            });
            //update vehicle job status
            if (customerSub.programme.match(new RegExp('inspection', 'i'))?.input)
                await vehicle.update({ onInspection: false });
            if (customerSub.programme.match(new RegExp('maintenance', 'i'))?.input)
                await vehicle.update({ onMaintenance: false });
        }
        await technician.update({
            hasJob: false,
        });
        await technician.$remove('jobs', [job]);
        await vehicle.$remove('jobs', [job]);
        await job.update({
            status: constants_1.JOB_STATUS.canceled,
        });
    }
    static async incrementServiceModeCount(plan, subscription) {
        const defaultMobileInspections = plan.mobile;
        const defaultDriveInInspections = plan.driveIn;
        let mobileCount = subscription.mobileCount;
        let driveInCount = subscription.driveInCount;
        if (subscription.planCategory === constants_1.HYBRID_CATEGORY) {
            //Hybrid mobile
            if (subscription.modeOfService !== constants_1.MOBILE_CATEGORY && mobileCount < defaultMobileInspections)
                mobileCount++;
            else
                return this.getInspectionsCountError(subscription.planType, constants_1.MOBILE_CATEGORY);
            //Hybrid drive-in
            if (subscription.modeOfService !== constants_1.DRIVE_IN_CATEGORY && driveInCount < defaultDriveInInspections)
                driveInCount++;
            else
                return this.getInspectionsCountError(subscription.planType, constants_1.DRIVE_IN_CATEGORY);
        }
        if (subscription.planCategory === constants_1.MOBILE_CATEGORY && mobileCount === defaultMobileInspections)
            return this.getInspectionsCountError(subscription.planType, constants_1.MOBILE_CATEGORY);
        else
            mobileCount++; //Increment count for mobile drive-in inspection
        if (subscription.planCategory === constants_1.DRIVE_IN_CATEGORY && driveInCount === defaultDriveInInspections)
            return this.getInspectionsCountError(subscription.planType, constants_1.DRIVE_IN_CATEGORY);
        else
            driveInCount++; //Increment count for normal drive-in inspection
        await subscription.update({
            mobileCount,
            driveInCount,
            inspections: mobileCount + driveInCount,
        });
    }
    static getInspectionsCountError(subscriptionName, category) {
        return Promise.reject(CustomAPIError_1.default.response(`Maximum number of ${category} inspections reached for plan ${subscriptionName}`, HttpStatus_1.default.BAD_REQUEST.code));
    }
}
exports.default = JobController;
