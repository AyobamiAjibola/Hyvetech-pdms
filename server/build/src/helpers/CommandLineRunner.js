"use strict";
/**
 * This helper Class, executes commands in form of methods,we want to run at runtime.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const sequelize_1 = require("sequelize");
const RoleRepository_1 = __importDefault(require("../repositories/RoleRepository"));
const PermissionRepository_1 = __importDefault(require("../repositories/PermissionRepository"));
const SubscriptionRepository_1 = __importDefault(require("../repositories/SubscriptionRepository"));
const PlanRepository_1 = __importDefault(require("../repositories/PlanRepository"));
const settings_1 = __importDefault(require("../config/settings"));
const PaymentGatewayRepository_1 = __importDefault(require("../repositories/PaymentGatewayRepository"));
const DistrictRepository_1 = __importDefault(require("../repositories/DistrictRepository"));
const ScheduleRepository_1 = __importDefault(require("../repositories/ScheduleRepository"));
const TimeSlotRepository_1 = __importDefault(require("../repositories/TimeSlotRepository"));
const VINDecoderProviderRepository_1 = __importDefault(require("../repositories/VINDecoderProviderRepository"));
const ServiceRepository_1 = __importDefault(require("../repositories/ServiceRepository"));
const PaymentPlanRepository_1 = __importDefault(require("../repositories/PaymentPlanRepository"));
const CategoryRepository_1 = __importDefault(require("../repositories/CategoryRepository"));
const PaymentTermRepository_1 = __importDefault(require("../repositories/PaymentTermRepository"));
const constants_1 = require("../config/constants");
const EmailConfigRepository_1 = __importDefault(require("../repositories/EmailConfigRepository"));
const DiscountRepository_1 = __importDefault(require("../repositories/DiscountRepository"));
const StateRepository_1 = __importDefault(require("../repositories/StateRepository"));
const TagRepository_1 = __importDefault(require("../repositories/TagRepository"));
const states_and_districts_json_1 = __importDefault(require("../resources/data/states_and_districts.json"));
const admin_json_1 = __importDefault(require("../resources/data/admin.json"));
const appSettings_json_1 = __importDefault(require("../resources/data/appSettings.json"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const dataStore_1 = __importDefault(require("../config/dataStore"));
const Role_1 = __importDefault(require("../models/Role"));
const Permission_1 = __importDefault(require("../models/Permission"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const Bank_1 = __importDefault(require("../models/Bank"));
const BankRepository_1 = __importDefault(require("../repositories/BankRepository"));
const SettingRepository_1 = __importDefault(require("../repositories/SettingRepository"));
class CommandLineRunner {
    static singleton = new CommandLineRunner();
    paymentGatewayRepository;
    districtRepository;
    scheduleRepository;
    timeSlotRepository;
    vinDecoderProviderRepository;
    roleRepository;
    permissionRepository;
    subscriptionRepository;
    planRepository;
    serviceRepository;
    paymentPlanRepository;
    categoryRepository;
    paymentTermRepository;
    emailConfigRepository;
    discountRepository;
    stateRepository;
    tagRepository;
    userRepository;
    settingRepository;
    constructor() {
        this.roleRepository = new RoleRepository_1.default();
        this.permissionRepository = new PermissionRepository_1.default();
        this.subscriptionRepository = new SubscriptionRepository_1.default();
        this.planRepository = new PlanRepository_1.default();
        this.paymentGatewayRepository = new PaymentGatewayRepository_1.default();
        this.districtRepository = new DistrictRepository_1.default();
        this.scheduleRepository = new ScheduleRepository_1.default();
        this.timeSlotRepository = new TimeSlotRepository_1.default();
        this.vinDecoderProviderRepository = new VINDecoderProviderRepository_1.default();
        this.serviceRepository = new ServiceRepository_1.default();
        this.paymentPlanRepository = new PaymentPlanRepository_1.default();
        this.categoryRepository = new CategoryRepository_1.default();
        this.paymentTermRepository = new PaymentTermRepository_1.default();
        this.emailConfigRepository = new EmailConfigRepository_1.default();
        this.discountRepository = new DiscountRepository_1.default();
        this.stateRepository = new StateRepository_1.default();
        this.tagRepository = new TagRepository_1.default();
        this.userRepository = new UserRepository_1.default();
        this.settingRepository = new SettingRepository_1.default();
    }
    static async run() {
        await this.singleton.loadDefaultSettings();
        await this.singleton.createUploadDirectory();
        await this.singleton.loadDefaultEmailConfig();
        await this.singleton.loadDefaultRolesAndPermissions();
        await this.singleton.loadDefaultTimeSlotAndSlots();
        await this.singleton.loadDefaultServicesData();
        await this.singleton.loadDefaultDiscounts();
        await this.singleton.loadDefaultStateDistricts();
        await this.singleton.loadDefaultPaymentGateway();
        await this.singleton.loadDefaultVINProvider();
        await this.singleton.loadDefaultTags();
        await this.singleton.loadDefaultAdmin();
        await this.singleton.loadPayStackPlans();
        await this.singleton.loadPayStackBanks();
    }
    async loadDefaultSettings() {
        await this.settingRepository.deleteAll({ force: true });
        await this.settingRepository.bulkCreate(appSettings_json_1.default);
    }
    async createUploadDirectory() {
        const dirExist = await Generic_1.default.fileExist(constants_1.UPLOAD_BASE_PATH);
        if (!dirExist)
            await promises_1.default.mkdir(constants_1.UPLOAD_BASE_PATH);
    }
    async loadPayStackPlans() {
        const paymentGateway = (await this.paymentGatewayRepository.findOne({
            where: { default: true },
        }));
        axiosClient_1.default.defaults.baseURL = `${paymentGateway.baseUrl}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;
        const response = await axiosClient_1.default.get('/plan');
        await dataStore_1.default.setEx(constants_1.PAY_STACK_PLANS, JSON.stringify(response.data.data), {
            PX: constants_1.TWENTY_FOUR_HOUR_EXPIRY,
        });
    }
    async loadPayStackBanks() {
        await Bank_1.default.sync({ force: true });
        const paymentGateway = (await this.paymentGatewayRepository.findOne({
            where: { default: true },
        }));
        axiosClient_1.default.defaults.baseURL = `${paymentGateway.baseUrl}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${paymentGateway.secretKey}`;
        const response = await axiosClient_1.default.get('/bank');
        const banks = response.data.data;
        const bankRepository = new BankRepository_1.default();
        const bankValues = banks.map(bank => ({
            name: bank.name,
            slug: bank.slug,
            code: bank.code,
            longCode: bank.longcode,
            gateway: bank.gateway,
            payWithBank: bank.pay_with_bank,
            active: bank.active,
            country: bank.country,
            currency: bank.currency,
            type: bank.type,
            isDeleted: bank.is_deleted,
        }));
        await bankRepository.bulkCreate(bankValues);
    }
    async loadDefaultAdmin() {
        const exist = await this.userRepository.findOne({
            where: {
                username: 'admin',
            },
        });
        if (exist)
            return;
        const passwordEncoder = new PasswordEncoder_1.default();
        Object.assign(admin_json_1.default, {
            password: await passwordEncoder.encode(process.env.ADMIN_PASS),
        });
        const user = await this.userRepository.save(admin_json_1.default);
        const role = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[0] },
        });
        if (role) {
            await user.$add('roles', [role]);
        }
    }
    async loadDefaultTags() {
        const tags = await this.tagRepository.findAll();
        if (tags.length)
            return;
        await this.tagRepository.bulkCreate(settings_1.default.tags);
    }
    async loadDefaultStateDistricts() {
        const states = await this.stateRepository.findAll();
        if (states.length)
            return;
        // await this.stateRepository.deleteAll({ force: true });
        // await this.districtRepository.deleteAll({ force: true });
        for (let i = 0; i < states_and_districts_json_1.default.length; i++) {
            //create state
            const state = await this.stateRepository.save({
                name: states_and_districts_json_1.default[i].name,
                alias: states_and_districts_json_1.default[i].alias,
            });
            for (let j = 0; j < states_and_districts_json_1.default[i].districts.length; j++) {
                //create district
                const district = await this.districtRepository.save({
                    name: states_and_districts_json_1.default[i].districts[j].name,
                });
                //associate state with its district
                await state.$add('districts', [district]);
            }
        }
    }
    async loadDefaultDiscounts() {
        const discounts = await this.discountRepository.findAll();
        if (discounts.length)
            return;
        await this.discountRepository.bulkCreate(settings_1.default.discounts);
    }
    async loadDefaultEmailConfig() {
        await this.emailConfigRepository.deleteAll({ force: true });
        await this.emailConfigRepository.save({
            name: settings_1.default.email.name,
            default: settings_1.default.email.default,
            from: settings_1.default.email.from,
            host: settings_1.default.email.host,
            username: settings_1.default.email.auth.user,
            password: settings_1.default.email.auth.pass,
            secure: settings_1.default.email.secure,
            port: +settings_1.default.email.port,
        });
    }
    async loadDefaultRolesAndPermissions() {
        const $roles = await this.roleRepository.findAll();
        const $permissions = await this.permissionRepository.findAll();
        if ($roles.length)
            await Role_1.default.sync({ force: true });
        if ($permissions.length)
            await Permission_1.default.sync({ force: true });
        const totalPermissions = settings_1.default.permissions.length;
        //create permissions
        for (const permissionName of settings_1.default.permissions) {
            await this.permissionRepository.save({
                name: permissionName,
                action: permissionName.split('_')[0],
                subject: permissionName.split('_')[1],
                inverted: true,
            });
        }
        //create roles
        for (const roleName of settings_1.default.roles) {
            await this.roleRepository.save({
                slug: roleName,
                name: roleName.replaceAll('_', ' '),
            });
        }
        //guest permissions
        const guestPermissions = await this.permissionRepository.findAll({
            where: {
                name: settings_1.default.permissions[totalPermissions - 1],
            },
        });
        //customer permissions
        const customerPermissions = await this.permissionRepository.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { name: settings_1.default.permissions[1] },
                    { name: settings_1.default.permissions[2] },
                    { name: settings_1.default.permissions[3] },
                    { name: settings_1.default.permissions[10] },
                    { name: settings_1.default.permissions[11] },
                ],
            },
        });
        //garage admin permissions
        const garageAdminPermissions = await this.permissionRepository.findAll({
            where: {
                [sequelize_1.Op.or]: [{ name: settings_1.default.permissions[25] }],
            },
        });
        //garage driver permissions
        const garageTechnicianPermissions = await this.permissionRepository.findAll({
            where: {
                [sequelize_1.Op.or]: [{ name: settings_1.default.permissions[22] }, { name: settings_1.default.permissions[23] }],
            },
        });
        //ride share permissions
        const rideShareAdminPermissions = await this.permissionRepository.findAll({
            where: {
                [sequelize_1.Op.or]: [{ name: settings_1.default.permissions[30] }],
            },
        });
        //ride share permissions
        const rideShareDriverPermissions = await this.permissionRepository.findAll({
            where: {
                [sequelize_1.Op.or]: [{ name: settings_1.default.permissions[27] }, { name: settings_1.default.permissions[28] }],
            },
        });
        //user permissions
        const permissions = settings_1.default.permissions.filter(permission => permission !== 'manage_all' && !permission.startsWith('delete'));
        const userPermissions = [];
        for (let i = 0; i < permissions.length; i++) {
            userPermissions.push(...(await this.permissionRepository.findAll({
                where: {
                    [sequelize_1.Op.or]: [{ name: permissions[i] }],
                },
            })));
        }
        //admin permissions
        const adminPermissions = await this.permissionRepository.findAll({
            where: { name: settings_1.default.permissions[0] },
        });
        //get guest role
        const guestRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[2] },
        });
        //get customer role
        const customerRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[1] },
        });
        //get user role
        const userRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[3] },
        });
        //get admin role
        const adminRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[0] },
        });
        //get garage admin role
        const garageAdminRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[4] },
        });
        //get ride share admin role
        const rideShareAdminRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[6] },
        });
        //get garage technician role
        const garageTechnicianRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[5] },
        });
        //get ride share driver role
        const rideShareDriverRole = await this.roleRepository.findOne({
            where: { slug: settings_1.default.roles[7] },
        });
        //associate roles to their respective permissions
        await guestRole?.$add('permissions', guestPermissions);
        await userRole?.$add('permissions', userPermissions);
        await customerRole?.$add('permissions', customerPermissions);
        await adminRole?.$add('permissions', adminPermissions);
        await garageAdminRole?.$add('permissions', garageAdminPermissions);
        await garageTechnicianRole?.$add('permissions', garageTechnicianPermissions);
        await rideShareAdminRole?.$add('permissions', rideShareAdminPermissions);
        await rideShareDriverRole?.$add('permissions', rideShareDriverPermissions);
    }
    async loadDefaultPaymentGateway() {
        await this.paymentGatewayRepository.deleteAll({ force: true });
        //create payStack gateway
        await this.paymentGatewayRepository.save({
            name: process.env.PAYMENT_GW_NAME,
            baseUrl: process.env.PAYMENT_GW_BASE_URL,
            secretKey: process.env.PAYMENT_GW_SECRET_KEY,
            callBackUrl: process.env.PAYMENT_GW_CB_URL,
            webHook: process.env.PAYMENT_GW_WEB_HOOK,
            default: true,
        });
    }
    async loadDefaultTimeSlotAndSlots() {
        //if time slot exist, do nothing
        const findSchedules = await this.scheduleRepository.findAll();
        if (findSchedules.length)
            return;
        const schedule = await this.scheduleRepository.save(settings_1.default.schedule);
        const timeSlots = await this.timeSlotRepository.bulkCreate(settings_1.default.schedule.timeSlots);
        await schedule.$add('timeSlots', timeSlots);
    }
    async loadDefaultVINProvider() {
        const providers = await this.vinDecoderProviderRepository.findAll();
        //if providers exist, do nothing
        if (providers.length)
            return;
        //create provider
        await this.vinDecoderProviderRepository.bulkCreate(settings_1.default.vinProviders);
    }
    async loadDefaultServicesData() {
        const findServices = await this.serviceRepository.findAll();
        //Initialize services for booking app, if already exist, do nothing
        if (findServices.length)
            return;
        //create services
        await this.serviceRepository.bulkCreate(constants_1.SERVICES);
        //create payment terms
        await this.paymentTermRepository.bulkCreate(constants_1.PAYMENT_TERMS);
        //create categories
        await this.categoryRepository.bulkCreate(constants_1.CATEGORIES);
        //create paymentPlans
        await this.paymentPlanRepository.bulkCreate(constants_1.PAYMENT_PLANS.oneTime);
        await this.paymentPlanRepository.bulkCreate(constants_1.PAYMENT_PLANS.houseHold);
        await this.paymentPlanRepository.bulkCreate(constants_1.PAYMENT_PLANS.faf);
        const inspectionService = await this.serviceRepository.findOne({
            where: {
                name: constants_1.SERVICES[0].name,
            },
        });
        //create subscriptions
        const subscriptions = await this.subscriptionRepository.bulkCreate(constants_1.SUBSCRIPTIONS);
        await inspectionService?.$add('subscriptions', subscriptions);
        //create plans
        for (const plan of constants_1.PLANS) {
            await this.planRepository.bulkCreate(plan);
        }
        await this.createOneTimeSubscription();
        await this.createHouseHoldSubscription();
        await this.createFAFSubscription();
    }
    async createOneTimeSubscription() {
        const mobilePaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.MOBILE_ONE_TIME_PAYMENT_PLAN },
        });
        const driveInPaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.DRIVE_IN_ONE_TIME_PAYMENT_PLAN },
        });
        const mobilePlan = await this.planRepository.findOne({
            where: { label: constants_1.ONE_TIME_MOBILE_PLAN },
        });
        const driveInPlan = await this.planRepository.findOne({
            where: { label: constants_1.ONE_TIME_DRIVE_IN_PLAN },
        });
        const mobileCategory = await this.categoryRepository.findOne({
            where: { name: constants_1.MOBILE_CATEGORY },
        });
        const driveInCategory = await this.categoryRepository.findOne({
            where: { name: constants_1.DRIVE_IN_CATEGORY },
        });
        //link payment plan categories
        await mobilePaymentPlan?.$add('categories', [mobileCategory]);
        await driveInPaymentPlan?.$add('categories', [driveInCategory]);
        //link plan payment plans
        mobilePlan?.$add('paymentPlans', [mobilePaymentPlan]);
        driveInPlan?.$add('paymentPlans', [driveInPaymentPlan]);
        //link plan categories
        mobilePlan?.$add('categories', [mobileCategory]);
        driveInPlan?.$add('categories', [driveInCategory]);
        const subscription = await this.subscriptionRepository.findOne({
            where: { slug: constants_1.ONE_TIME_SUBSCRIPTION },
        });
        await subscription?.$add('plans', [mobilePlan, driveInPlan]);
    }
    async createHouseHoldSubscription() {
        const mobilePaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.MOBILE_HOUSE_HOLD_PAYMENT_PLAN },
        });
        const driveInPaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN },
        });
        const hybridPaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.HYBRID_HOUSE_HOLD_PAYMENT_PLAN },
        });
        const mobilePlan = await this.planRepository.findOne({
            where: { label: constants_1.HOUSE_HOLD_MOBILE_PLAN },
        });
        const driveInPlan = await this.planRepository.findOne({
            where: { label: constants_1.HOUSE_HOLD_DRIVE_IN_PLAN },
        });
        const hybridPlan = await this.planRepository.findOne({
            where: { label: constants_1.HOUSE_HOLD_HYBRID_PLAN },
        });
        const { mobileCategory, driveInCategory, hybridCategory } = await this.getCategories();
        //link payment plan categories
        await mobilePaymentPlan?.$add('categories', [mobileCategory]);
        await driveInPaymentPlan?.$add('categories', [driveInCategory]);
        await hybridPaymentPlan?.$add('categories', [hybridCategory]);
        //link plan payment plans
        mobilePlan?.$add('paymentPlans', [mobilePaymentPlan]);
        driveInPlan?.$add('paymentPlans', [driveInPaymentPlan]);
        hybridPlan?.$add('paymentPlans', [hybridPaymentPlan]);
        //link plan categories
        mobilePlan?.$add('categories', [mobileCategory]);
        driveInPlan?.$add('categories', [driveInCategory]);
        hybridPlan?.$add('categories', [hybridCategory]);
        const subscription = await this.subscriptionRepository.findOne({
            where: { slug: constants_1.HOUSE_HOLD_SUBSCRIPTION },
        });
        await subscription?.$add('plans', [mobilePlan, driveInPlan, hybridPlan]);
    }
    async createFAFSubscription() {
        const mobilePaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.MOBILE_FAF_PAYMENT_PLAN },
        });
        const driveInPaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.DRIVE_IN_FAF_PAYMENT_PLAN },
        });
        const hybridPaymentPlan = await this.paymentPlanRepository.findOne({
            where: { label: constants_1.HYBRID_FAF_PAYMENT_PLAN },
        });
        const mobilePlan = await this.planRepository.findOne({
            where: { label: constants_1.FAF_MOBILE_PLAN },
        });
        const driveInPlan = await this.planRepository.findOne({
            where: { label: constants_1.FAF_DRIVE_IN_PLAN },
        });
        const hybridPlan = await this.planRepository.findOne({
            where: { label: constants_1.FAF_HYBRID_PLAN },
        });
        const { mobileCategory, driveInCategory, hybridCategory } = await this.getCategories();
        //link payment plan categories
        await mobilePaymentPlan?.$add('categories', [mobileCategory]);
        await driveInPaymentPlan?.$add('categories', [driveInCategory]);
        await hybridPaymentPlan?.$add('categories', [hybridCategory]);
        //link plan payment plans
        mobilePlan?.$add('paymentPlans', [mobilePaymentPlan]);
        driveInPlan?.$add('paymentPlans', [driveInPaymentPlan]);
        hybridPlan?.$add('paymentPlans', [hybridPaymentPlan]);
        //link plan categories
        mobilePlan?.$add('categories', [mobileCategory]);
        driveInPlan?.$add('categories', [driveInCategory]);
        hybridPlan?.$add('categories', [hybridCategory]);
        const subscription = await this.subscriptionRepository.findOne({
            where: { slug: constants_1.FAF_SUBSCRIPTION },
        });
        await subscription?.$add('plans', [mobilePlan, driveInPlan, hybridPlan]);
    }
    async getCategories() {
        const mobileCategory = await this.categoryRepository.findOne({
            where: { name: constants_1.MOBILE_CATEGORY },
        });
        const driveInCategory = await this.categoryRepository.findOne({
            where: { name: constants_1.DRIVE_IN_CATEGORY },
        });
        const hybridCategory = await this.categoryRepository.findOne({
            where: { name: constants_1.HYBRID_CATEGORY },
        });
        return { mobileCategory, driveInCategory, hybridCategory };
    }
}
exports.default = CommandLineRunner;
