/**
 * This helper Class, executes commands in form of methods,we want to run at runtime.
 */
import { Op } from "sequelize";

import RoleRepository from "../repositories/RoleRepository";
import PermissionRepository from "../repositories/PermissionRepository";
import SubscriptionRepository from "../repositories/SubscriptionRepository";
import PlanRepository from "../repositories/PlanRepository";
import settings from "../config/settings";
import PaymentGatewayRepository from "../repositories/PaymentGatewayRepository";
import DistrictRepository from "../repositories/DistrictRepository";
import ScheduleRepository from "../repositories/ScheduleRepository";
import TimeSlotRepository from "../repositories/TimeSlotRepository";
import VINDecoderProviderRepository from "../repositories/VINDecoderProviderRepository";
import { appModelTypes } from "../@types/app-model";
import ServiceRepository from "../repositories/ServiceRepository";
import PaymentPlanRepository from "../repositories/PaymentPlanRepository";
import CategoryRepository from "../repositories/CategoryRepository";
import PaymentTermRepository from "../repositories/PaymentTermRepository";
import {
  CATEGORIES,
  DRIVE_IN_CATEGORY,
  DRIVE_IN_FAF_PAYMENT_PLAN,
  DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN,
  DRIVE_IN_ONE_TIME_PAYMENT_PLAN,
  FAF_DRIVE_IN_PLAN,
  FAF_HYBRID_PLAN,
  FAF_MOBILE_PLAN,
  FAF_SUBSCRIPTION,
  HOUSE_HOLD_DRIVE_IN_PLAN,
  HOUSE_HOLD_HYBRID_PLAN,
  HOUSE_HOLD_MOBILE_PLAN,
  HOUSE_HOLD_SUBSCRIPTION,
  HYBRID_CATEGORY,
  HYBRID_FAF_PAYMENT_PLAN,
  HYBRID_HOUSE_HOLD_PAYMENT_PLAN,
  MOBILE_CATEGORY,
  MOBILE_FAF_PAYMENT_PLAN,
  MOBILE_HOUSE_HOLD_PAYMENT_PLAN,
  MOBILE_ONE_TIME_PAYMENT_PLAN,
  ONE_TIME_DRIVE_IN_PLAN,
  ONE_TIME_MOBILE_PLAN,
  ONE_TIME_SUBSCRIPTION,
  PAYMENT_PLANS,
  PAYMENT_TERMS,
  PLANS,
  SERVICES,
  SUBSCRIPTIONS,
} from "../config/constants";
import Category from "../models/Category";
import PaymentPlan from "../models/PaymentPlan";
import Plan from "../models/Plan";
import EmailConfigRepository from "../repositories/EmailConfigRepository";
import DiscountRepository from "../repositories/DiscountRepository";
import StateRepository from "../repositories/StateRepository";
import TagRepository from "../repositories/TagRepository";

import statesAndDistrictsJson from "../resources/data/states_and_districts.json";
import adminJson from "../resources/data/admin.json";
import UserRepository from "../repositories/UserRepository";
import PasswordEncoder from "../utils/PasswordEncoder";
import AbstractCrudRepository = appModelTypes.AbstractCrudRepository;

export default class CommandLineRunner {
  private roleRepository: AbstractCrudRepository;
  private permissionRepository: AbstractCrudRepository;
  private subscriptionRepository: AbstractCrudRepository;
  private planRepository: AbstractCrudRepository;
  public paymentGatewayRepository: AbstractCrudRepository;
  public districtRepository: AbstractCrudRepository;
  public scheduleRepository: AbstractCrudRepository;
  public timeSlotRepository: AbstractCrudRepository;
  public vinDecoderProviderRepository: AbstractCrudRepository;
  private serviceRepository: AbstractCrudRepository;
  private paymentPlanRepository: AbstractCrudRepository;
  private categoryRepository: AbstractCrudRepository;
  private paymentTermRepository: AbstractCrudRepository;
  private emailConfigRepository: AbstractCrudRepository;
  private discountRepository: AbstractCrudRepository;
  private stateRepository: AbstractCrudRepository;
  private tagRepository: AbstractCrudRepository;
  private userRepository: AbstractCrudRepository;

  public static singleton: CommandLineRunner = new CommandLineRunner();

  constructor() {
    this.roleRepository = new RoleRepository();
    this.permissionRepository = new PermissionRepository();
    this.subscriptionRepository = new SubscriptionRepository();
    this.planRepository = new PlanRepository();
    this.paymentGatewayRepository = new PaymentGatewayRepository();
    this.districtRepository = new DistrictRepository();
    this.scheduleRepository = new ScheduleRepository();
    this.timeSlotRepository = new TimeSlotRepository();
    this.vinDecoderProviderRepository = new VINDecoderProviderRepository();
    this.serviceRepository = new ServiceRepository();
    this.paymentPlanRepository = new PaymentPlanRepository();
    this.categoryRepository = new CategoryRepository();
    this.paymentTermRepository = new PaymentTermRepository();
    this.emailConfigRepository = new EmailConfigRepository();
    this.discountRepository = new DiscountRepository();
    this.stateRepository = new StateRepository();
    this.tagRepository = new TagRepository();
    this.userRepository = new UserRepository();
  }

  public static async run() {
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
  }

  async loadDefaultAdmin() {
    const exist = await this.userRepository.findOne({
      where: {
        username: "admin",
      },
    });

    if (exist) return;

    const passwordEncoder = new PasswordEncoder();

    Object.assign(adminJson, {
      password: await passwordEncoder.encode(adminJson.password),
    });

    const user = await this.userRepository.save(adminJson);

    const role = await this.roleRepository.findOne({
      where: { slug: settings.roles[0] },
    });

    if (role) {
      await user.$add("roles", [role]);
    }
  }

  async loadDefaultTags() {
    const tags = await this.tagRepository.findAll();

    if (tags.length) return;

    await this.tagRepository.bulkCreate(settings.tags);
  }

  async loadDefaultStateDistricts() {
    const states = await this.stateRepository.findAll();

    if (states.length) return;
    // await this.stateRepository.deleteAll({ force: true });
    // await this.districtRepository.deleteAll({ force: true });

    for (let i = 0; i < statesAndDistrictsJson.length; i++) {
      //create state
      const state = await this.stateRepository.save({
        name: statesAndDistrictsJson[i].name,
        alias: statesAndDistrictsJson[i].alias,
      });

      for (let j = 0; j < statesAndDistrictsJson[i].districts.length; j++) {
        //create district
        const district = await this.districtRepository.save({
          name: statesAndDistrictsJson[i].districts[j].name,
        });

        //associate state with its district
        await state.$add("districts", [district]);
      }
    }
  }

  async loadDefaultDiscounts() {
    const discounts = await this.discountRepository.findAll();

    if (discounts.length) return;

    await this.discountRepository.bulkCreate(settings.discounts);
  }

  async loadDefaultEmailConfig() {
    await this.emailConfigRepository.deleteAll({ force: true });

    await this.emailConfigRepository.save({
      name: settings.email.name,
      default: settings.email.default,
      from: settings.email.from,
      host: settings.email.host,
      username: settings.email.auth.user,
      password: settings.email.auth.pass,
      secure: settings.email.secure,
      port: +(<string>settings.email.port),
    });
  }

  async loadDefaultRolesAndPermissions() {
    await this.roleRepository.deleteAll({
      force: true,
    });
    await this.permissionRepository.deleteAll({
      force: true,
    });

    const totalPermissions = settings.permissions.length;

    //create permissions
    for (const permissionName of settings.permissions) {
      await this.permissionRepository.save({
        name: permissionName,
        action: permissionName.split("_")[0],
        subject: permissionName.split("_")[1],
        inverted: true,
      });
    }

    //create roles
    for (const roleName of settings.roles) {
      await this.roleRepository.save({
        slug: roleName,
        name: roleName.replaceAll("_", " "),
      });
    }

    //guest permissions
    const guestPermissions = await this.permissionRepository.findAll({
      where: {
        name: settings.permissions[totalPermissions - 1],
      },
    });

    //customer permissions
    const customerPermissions = await this.permissionRepository.findAll({
      where: {
        [Op.or]: [
          { name: settings.permissions[1] },
          { name: settings.permissions[2] },
          { name: settings.permissions[3] },
          { name: settings.permissions[9] },
          { name: settings.permissions[10] },
        ],
      },
    });

    //garage admin permissions
    const garageAdminPermissions = await this.permissionRepository.findAll({
      where: {
        [Op.or]: [
          { name: settings.permissions[21] },
          { name: settings.permissions[22] },
          { name: settings.permissions[23] },
          { name: settings.permissions[24] },
        ],
      },
    });

    //garage driver permissions
    const garageTechnicianPermissions = await this.permissionRepository.findAll(
      {
        where: {
          [Op.or]: [{ name: settings.permissions[22] }],
        },
      }
    );

    //ride share permissions
    const rideShareAdminPermissions = await this.permissionRepository.findAll({
      where: {
        [Op.or]: [
          { name: settings.permissions[25] },
          { name: settings.permissions[26] },
          { name: settings.permissions[27] },
          { name: settings.permissions[28] },
        ],
      },
    });

    //ride share permissions
    const rideShareDriverPermissions = await this.permissionRepository.findAll({
      where: {
        [Op.or]: [{ name: settings.permissions[26] }],
      },
    });

    //user permissions
    const permissions = settings.permissions.filter(
      (permission) =>
        permission !== "manage_all" && !permission.startsWith("delete")
    );

    const userPermissions = [];

    for (let i = 0; i < permissions.length; i++) {
      userPermissions.push(
        ...(await this.permissionRepository.findAll({
          where: {
            [Op.or]: [{ name: permissions[i] }],
          },
        }))
      );
    }

    //admin permissions
    const adminPermissions = await this.permissionRepository.findAll({
      where: { name: settings.permissions[0] },
    });

    //get guest role
    const guestRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[2] },
    });

    //get customer role
    const customerRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[1] },
    });

    //get user role
    const userRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[3] },
    });

    //get admin role
    const adminRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[0] },
    });

    //get garage admin role
    const garageAdminRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[4] },
    });

    //get ride share admin role
    const rideShareAdminRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[6] },
    });

    //get garage technician role
    const garageTechnicianRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[5] },
    });

    //get ride share driver role
    const rideShareDriverRole = await this.roleRepository.findOne({
      where: { slug: settings.roles[7] },
    });

    //associate roles to their respective permissions
    await guestRole?.$add("permissions", guestPermissions);
    await userRole?.$add("permissions", userPermissions);
    await customerRole?.$add("permissions", customerPermissions);
    await adminRole?.$add("permissions", adminPermissions);
    await garageAdminRole?.$add("permissions", garageAdminPermissions);
    await garageTechnicianRole?.$add(
      "permissions",
      garageTechnicianPermissions
    );
    await rideShareAdminRole?.$add("permissions", rideShareAdminPermissions);
    await rideShareDriverRole?.$add("permissions", rideShareDriverPermissions);
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

    if (findSchedules.length) return;

    const schedule = await this.scheduleRepository.save(settings.schedule);

    const timeSlots = await this.timeSlotRepository.bulkCreate(
      settings.schedule.timeSlots
    );

    await schedule.$add("timeSlots", timeSlots);
  }

  async loadDefaultVINProvider() {
    const providers = await this.vinDecoderProviderRepository.findAll();

    //if providers exist, do nothing
    if (providers.length) return;

    //create provider
    await this.vinDecoderProviderRepository.bulkCreate(settings.vinProviders);
  }

  async loadDefaultServicesData() {
    const findServices = await this.serviceRepository.findAll();

    //Initialize services for booking app, if already exist, do nothing
    if (findServices.length) return;

    //create services
    await this.serviceRepository.bulkCreate(SERVICES);

    //create payment terms
    await this.paymentTermRepository.bulkCreate(PAYMENT_TERMS);

    //create categories
    await this.categoryRepository.bulkCreate(CATEGORIES);

    //create paymentPlans
    await this.paymentPlanRepository.bulkCreate(PAYMENT_PLANS.oneTime);

    await this.paymentPlanRepository.bulkCreate(PAYMENT_PLANS.houseHold);

    await this.paymentPlanRepository.bulkCreate(PAYMENT_PLANS.faf);

    const inspectionService = await this.serviceRepository.findOne({
      where: {
        name: SERVICES[0].name,
      },
    });

    //create subscriptions
    const subscriptions = await this.subscriptionRepository.bulkCreate(
      SUBSCRIPTIONS
    );

    await inspectionService?.$add("subscriptions", subscriptions);

    //create plans
    for (const plan of PLANS) {
      await this.planRepository.bulkCreate(plan);
    }

    await this.createOneTimeSubscription();
    await this.createHouseHoldSubscription();
    await this.createFAFSubscription();
  }

  private async createOneTimeSubscription() {
    const mobilePaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: MOBILE_ONE_TIME_PAYMENT_PLAN },
    });

    const driveInPaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: DRIVE_IN_ONE_TIME_PAYMENT_PLAN },
    });

    const mobilePlan = await this.planRepository.findOne({
      where: { label: ONE_TIME_MOBILE_PLAN },
    });

    const driveInPlan = await this.planRepository.findOne({
      where: { label: ONE_TIME_DRIVE_IN_PLAN },
    });

    const mobileCategory = await this.categoryRepository.findOne({
      where: { name: MOBILE_CATEGORY },
    });
    const driveInCategory = await this.categoryRepository.findOne({
      where: { name: DRIVE_IN_CATEGORY },
    });

    //link payment plan categories
    await mobilePaymentPlan?.$add("categories", [<Category>mobileCategory]);
    await driveInPaymentPlan?.$add("categories", [<Category>driveInCategory]);

    //link plan payment plans
    mobilePlan?.$add("paymentPlans", [<PaymentPlan>mobilePaymentPlan]);
    driveInPlan?.$add("paymentPlans", [<PaymentPlan>driveInPaymentPlan]);

    //link plan categories
    mobilePlan?.$add("categories", [<Category>mobileCategory]);
    driveInPlan?.$add("categories", [<Category>driveInCategory]);

    const subscription = await this.subscriptionRepository.findOne({
      where: { slug: ONE_TIME_SUBSCRIPTION },
    });

    await subscription?.$add("plans", [<Plan>mobilePlan, <Plan>driveInPlan]);
  }

  private async createHouseHoldSubscription() {
    const mobilePaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: MOBILE_HOUSE_HOLD_PAYMENT_PLAN },
    });
    const driveInPaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: DRIVE_IN_HOUSE_HOLD_PAYMENT_PLAN },
    });
    const hybridPaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: HYBRID_HOUSE_HOLD_PAYMENT_PLAN },
    });

    const mobilePlan = await this.planRepository.findOne({
      where: { label: HOUSE_HOLD_MOBILE_PLAN },
    });
    const driveInPlan = await this.planRepository.findOne({
      where: { label: HOUSE_HOLD_DRIVE_IN_PLAN },
    });
    const hybridPlan = await this.planRepository.findOne({
      where: { label: HOUSE_HOLD_HYBRID_PLAN },
    });

    const { mobileCategory, driveInCategory, hybridCategory } =
      await this.getCategories();

    //link payment plan categories
    await mobilePaymentPlan?.$add("categories", [<Category>mobileCategory]);
    await driveInPaymentPlan?.$add("categories", [<Category>driveInCategory]);
    await hybridPaymentPlan?.$add("categories", [<Category>hybridCategory]);

    //link plan payment plans
    mobilePlan?.$add("paymentPlans", [<PaymentPlan>mobilePaymentPlan]);
    driveInPlan?.$add("paymentPlans", [<PaymentPlan>driveInPaymentPlan]);
    hybridPlan?.$add("paymentPlans", [<PaymentPlan>hybridPaymentPlan]);

    //link plan categories
    mobilePlan?.$add("categories", [<Category>mobileCategory]);
    driveInPlan?.$add("categories", [<Category>driveInCategory]);
    hybridPlan?.$add("categories", [<Category>hybridCategory]);

    const subscription = await this.subscriptionRepository.findOne({
      where: { slug: HOUSE_HOLD_SUBSCRIPTION },
    });

    await subscription?.$add("plans", [
      <Plan>mobilePlan,
      <Plan>driveInPlan,
      <Plan>hybridPlan,
    ]);
  }

  private async createFAFSubscription() {
    const mobilePaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: MOBILE_FAF_PAYMENT_PLAN },
    });
    const driveInPaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: DRIVE_IN_FAF_PAYMENT_PLAN },
    });
    const hybridPaymentPlan = await this.paymentPlanRepository.findOne({
      where: { label: HYBRID_FAF_PAYMENT_PLAN },
    });

    const mobilePlan = await this.planRepository.findOne({
      where: { label: FAF_MOBILE_PLAN },
    });
    const driveInPlan = await this.planRepository.findOne({
      where: { label: FAF_DRIVE_IN_PLAN },
    });
    const hybridPlan = await this.planRepository.findOne({
      where: { label: FAF_HYBRID_PLAN },
    });
    const { mobileCategory, driveInCategory, hybridCategory } =
      await this.getCategories();

    //link payment plan categories
    await mobilePaymentPlan?.$add("categories", [<Category>mobileCategory]);
    await driveInPaymentPlan?.$add("categories", [<Category>driveInCategory]);
    await hybridPaymentPlan?.$add("categories", [<Category>hybridCategory]);

    //link plan payment plans
    mobilePlan?.$add("paymentPlans", [<PaymentPlan>mobilePaymentPlan]);
    driveInPlan?.$add("paymentPlans", [<PaymentPlan>driveInPaymentPlan]);
    hybridPlan?.$add("paymentPlans", [<PaymentPlan>hybridPaymentPlan]);

    //link plan categories
    mobilePlan?.$add("categories", [<Category>mobileCategory]);
    driveInPlan?.$add("categories", [<Category>driveInCategory]);
    hybridPlan?.$add("categories", [<Category>hybridCategory]);

    const subscription = await this.subscriptionRepository.findOne({
      where: { slug: FAF_SUBSCRIPTION },
    });

    await subscription?.$add("plans", [
      <Plan>mobilePlan,
      <Plan>driveInPlan,
      <Plan>hybridPlan,
    ]);
  }

  private async getCategories() {
    const mobileCategory = await this.categoryRepository.findOne({
      where: { name: MOBILE_CATEGORY },
    });
    const driveInCategory = await this.categoryRepository.findOne({
      where: { name: DRIVE_IN_CATEGORY },
    });
    const hybridCategory = await this.categoryRepository.findOne({
      where: { name: HYBRID_CATEGORY },
    });
    return { mobileCategory, driveInCategory, hybridCategory };
  }
}