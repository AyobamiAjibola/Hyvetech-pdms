"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomerRepository_1 = __importDefault(require("../../repositories/CustomerRepository"));
const ContactRepository_1 = __importDefault(require("../../repositories/ContactRepository"));
const RoleRepository_1 = __importDefault(require("../../repositories/RoleRepository"));
const VehicleRepository_1 = __importDefault(require("../../repositories/VehicleRepository"));
const ScheduleRepository_1 = __importDefault(require("../../repositories/ScheduleRepository"));
const AppointmentRepository_1 = __importDefault(require("../../repositories/AppointmentRepository"));
const VehicleFaultRepository_1 = __importDefault(require("../../repositories/VehicleFaultRepository"));
const TransactionRepository_1 = __importDefault(require("../../repositories/TransactionRepository"));
const DistrictRepository_1 = __importDefault(require("../../repositories/DistrictRepository"));
const VINDecoderProviderRepository_1 = __importDefault(require("../../repositories/VINDecoderProviderRepository"));
const AppointmentDAOService_1 = __importDefault(require("./AppointmentDAOService"));
const VehicleDAOService_1 = __importDefault(require("./VehicleDAOService"));
const VehicleFaultDAOService_1 = __importDefault(require("./VehicleFaultDAOService"));
const CustomerDAOService_1 = __importDefault(require("./CustomerDAOService"));
const DistrictDAOService_1 = __importDefault(require("./DistrictDAOService"));
const ScheduleDAOService_1 = __importDefault(require("./ScheduleDAOService"));
const TransactionDAOService_1 = __importDefault(require("./TransactionDAOService"));
const VINDecoderProviderDAOService_1 = __importDefault(require("./VINDecoderProviderDAOService"));
const SubscriptionRepository_1 = __importDefault(require("../../repositories/SubscriptionRepository"));
const SubscriptionDAOService_1 = __importDefault(require("./SubscriptionDAOService"));
const PaymentTermRepository_1 = __importDefault(require("../../repositories/PaymentTermRepository"));
const PaymentDAOService_1 = __importDefault(require("./PaymentDAOService"));
const PaymentGatewayRepository_1 = __importDefault(require("../../repositories/PaymentGatewayRepository"));
const PaymentGatewayDAOService_1 = __importDefault(require("./PaymentGatewayDAOService"));
const PlanRepository_1 = __importDefault(require("../../repositories/PlanRepository"));
const PlanDAOService_1 = __importDefault(require("./PlanDAOService"));
const ContactDAOService_1 = __importDefault(require("./ContactDAOService"));
const TimeSlotRepository_1 = __importDefault(require("../../repositories/TimeSlotRepository"));
const TimeSlotDAOService_1 = __importDefault(require("./TimeSlotDAOService"));
const DiscountRepository_1 = __importDefault(require("../../repositories/DiscountRepository"));
const DiscountDAOService_1 = __importDefault(require("./DiscountDAOService"));
const StateRepository_1 = __importDefault(require("../../repositories/StateRepository"));
const StateDAOService_1 = __importDefault(require("./StateDAOService"));
const PasswordEncoder_1 = __importDefault(require("../../utils/PasswordEncoder"));
const CustomerSubscriptionRepository_1 = __importDefault(require("../../repositories/CustomerSubscriptionRepository"));
const CustomerSubscriptionDAOService_1 = __importDefault(require("./CustomerSubscriptionDAOService"));
const BankRepository_1 = __importDefault(require("../../repositories/BankRepository"));
const BankDAOService_1 = __importDefault(require("./BankDAOService"));
const TagRepository_1 = __importDefault(require("../../repositories/TagRepository"));
const TagDAOService_1 = __importDefault(require("./TagDAOService"));
const VINRepository_1 = __importDefault(require("../../repositories/VINRepository"));
const UserRepository_1 = __importDefault(require("../../repositories/UserRepository"));
const UserDAOService_1 = __importDefault(require("./UserDAOService"));
const PermissionRepository_1 = __importDefault(require("../../repositories/PermissionRepository"));
const RoleDAOService_1 = __importDefault(require("./RoleDAOService"));
const PermissionDAOService_1 = __importDefault(require("./PermissionDAOService"));
const PartnerRepository_1 = __importDefault(require("../../repositories/PartnerRepository"));
const PartnerDAOService_1 = __importDefault(require("./PartnerDAOService"));
const CategoryRepository_1 = __importDefault(require("../../repositories/CategoryRepository"));
const CategoryDAOService_1 = __importDefault(require("./CategoryDAOService"));
const PaymentPlanRepository_1 = __importDefault(require("../../repositories/PaymentPlanRepository"));
const PaymentPlanDAOService_1 = __importDefault(require("./PaymentPlanDAOService"));
const RideShareDriverRepository_1 = __importDefault(require("../../repositories/RideShareDriverRepository"));
const RideShareDriverDAOService_1 = __importDefault(require("./RideShareDriverDAOService"));
const RideShareDriverSubscriptionRepository_1 = __importDefault(require("../../repositories/RideShareDriverSubscriptionRepository"));
const RideShareDriverSubscriptionDAOService_1 = __importDefault(require("./RideShareDriverSubscriptionDAOService"));
const TechnicianRepository_1 = __importDefault(require("../../repositories/TechnicianRepository"));
const TechnicianDAOService_1 = __importDefault(require("./TechnicianDAOService"));
const JobRepository_1 = __importDefault(require("../../repositories/JobRepository"));
const JobDAOService_1 = __importDefault(require("./JobDAOService"));
const CheckListRepository_1 = __importDefault(require("../../repositories/CheckListRepository"));
const CheckListDAOService_1 = __importDefault(require("./CheckListDAOService"));
const EstimateRepository_1 = __importDefault(require("../../repositories/EstimateRepository"));
const EstimateDAOService_1 = __importDefault(require("./EstimateDAOService"));
const BillingInformationRepository_1 = __importDefault(require("../../repositories/BillingInformationRepository"));
const BillingInformationDAOService_1 = __importDefault(require("./BillingInformationDAOService"));
const InvoiceRepository_1 = __importDefault(require("../../repositories/InvoiceRepository"));
const InvoiceDAOService_1 = __importDefault(require("./InvoiceDAOService"));
const VINDAOService_1 = __importDefault(require("./VINDAOService"));
const CustomerWorkShopRepository_1 = __importDefault(require("../../repositories/CustomerWorkShopRepository"));
const CustomerWorkShopDAOService_1 = __importDefault(require("./CustomerWorkShopDAOService"));
const SettingRepository_1 = __importDefault(require("../../repositories/SettingRepository"));
const SettingDAOService_1 = __importDefault(require("./SettingDAOService"));
const customerRepository = new CustomerRepository_1.default();
const contactRepository = new ContactRepository_1.default();
const roleRepository = new RoleRepository_1.default();
const vehicleRepository = new VehicleRepository_1.default();
const scheduleRepository = new ScheduleRepository_1.default();
const appointmentRepository = new AppointmentRepository_1.default();
const vehicleFaultRepository = new VehicleFaultRepository_1.default();
const paymentTermRepository = new PaymentTermRepository_1.default();
const transactionRepository = new TransactionRepository_1.default();
const districtRepository = new DistrictRepository_1.default();
const paymentGatewayRepository = new PaymentGatewayRepository_1.default();
const subscriptionRepository = new SubscriptionRepository_1.default();
const vinDecoderProviderRepository = new VINDecoderProviderRepository_1.default();
const planRepository = new PlanRepository_1.default();
const timeSlotRepository = new TimeSlotRepository_1.default();
const discountRepository = new DiscountRepository_1.default();
const stateRepository = new StateRepository_1.default();
const passwordEncoder = new PasswordEncoder_1.default();
const customerSubscriptionRepository = new CustomerSubscriptionRepository_1.default();
const bankRepository = new BankRepository_1.default();
const tagRepository = new TagRepository_1.default();
const vinRepository = new VINRepository_1.default();
const userRepository = new UserRepository_1.default();
const permissionRepository = new PermissionRepository_1.default();
const partnerRepository = new PartnerRepository_1.default();
const categoryRepository = new CategoryRepository_1.default();
const paymentPlanRepository = new PaymentPlanRepository_1.default();
const rideShareDriverRepository = new RideShareDriverRepository_1.default();
const rideShareDriverSubscriptionRepository = new RideShareDriverSubscriptionRepository_1.default();
const technicianRepository = new TechnicianRepository_1.default();
const jobRepository = new JobRepository_1.default();
const checkListRepository = new CheckListRepository_1.default();
const estimateRepository = new EstimateRepository_1.default();
const billingInformationRepository = new BillingInformationRepository_1.default();
const invoiceRepository = new InvoiceRepository_1.default();
const customerWorkShopRepository = new CustomerWorkShopRepository_1.default();
const settingRepository = new SettingRepository_1.default();
const vehicleDAOService = new VehicleDAOService_1.default(vehicleRepository);
const contactDAOService = new ContactDAOService_1.default(contactRepository);
const scheduleDAOService = new ScheduleDAOService_1.default(scheduleRepository);
const vehicleFaultDAOService = new VehicleFaultDAOService_1.default(vehicleFaultRepository);
const appointmentDAOService = new AppointmentDAOService_1.default(appointmentRepository);
const transactionDAOService = new TransactionDAOService_1.default(transactionRepository);
const districtDAOService = new DistrictDAOService_1.default(districtRepository);
const customerDAOService = new CustomerDAOService_1.default(customerRepository, roleRepository, passwordEncoder);
const paymentTermDAOService = new PaymentDAOService_1.default(paymentTermRepository);
const paymentGatewayDAOService = new PaymentGatewayDAOService_1.default(paymentGatewayRepository);
const subscriptionDAOService = new SubscriptionDAOService_1.default(subscriptionRepository);
const vinDecoderProviderDAOService = new VINDecoderProviderDAOService_1.default(vinDecoderProviderRepository, vinRepository);
const planDAOService = new PlanDAOService_1.default(planRepository);
const timeSlotDAOService = new TimeSlotDAOService_1.default(timeSlotRepository);
const discountDAOService = new DiscountDAOService_1.default(discountRepository);
const stateDAOService = new StateDAOService_1.default(stateRepository);
const vinDAOService = new VINDAOService_1.default(vinRepository);
const customerSubscriptionDAOService = new CustomerSubscriptionDAOService_1.default(customerSubscriptionRepository);
const bankDAOService = new BankDAOService_1.default(bankRepository);
const tagDAOService = new TagDAOService_1.default(tagRepository);
const userDAOService = new UserDAOService_1.default(userRepository);
const roleDAOService = new RoleDAOService_1.default(roleRepository);
const permissionDAOService = new PermissionDAOService_1.default(permissionRepository);
const partnerDAOService = new PartnerDAOService_1.default(partnerRepository);
const categoryDAOService = new CategoryDAOService_1.default(categoryRepository);
const paymentPlanDAOService = new PaymentPlanDAOService_1.default(paymentPlanRepository);
const rideShareDriverDAOService = new RideShareDriverDAOService_1.default(rideShareDriverRepository);
const rideShareDriverSubscriptionDAOService = new RideShareDriverSubscriptionDAOService_1.default(rideShareDriverSubscriptionRepository);
const technicianDAOService = new TechnicianDAOService_1.default(technicianRepository);
const jobDAOService = new JobDAOService_1.default(jobRepository);
const checkListDAOService = new CheckListDAOService_1.default(checkListRepository);
const estimateDAOService = new EstimateDAOService_1.default(estimateRepository);
const billingInformationDAOService = new BillingInformationDAOService_1.default(billingInformationRepository);
const invoiceDAOService = new InvoiceDAOService_1.default(invoiceRepository);
const customerWorkShopDAOService = new CustomerWorkShopDAOService_1.default(customerWorkShopRepository);
const settingDAOService = new SettingDAOService_1.default(settingRepository);
exports.default = {
    customerDAOService,
    vehicleDAOService,
    scheduleDAOService,
    vehicleFaultDAOService,
    appointmentDAOService,
    paymentTermDAOService,
    transactionDAOService,
    districtDAOService,
    paymentGatewayDAOService,
    subscriptionDAOService,
    vinDecoderProviderDAOService,
    planDAOService,
    contactDAOService,
    timeSlotDAOService,
    discountDAOService,
    stateDAOService,
    customerSubscriptionDAOService,
    bankDAOService,
    tagDAOService,
    userDAOService,
    roleDAOService,
    permissionDAOService,
    partnerDAOService,
    categoryDAOService,
    paymentPlanDAOService,
    rideShareDriverDAOService,
    rideShareDriverSubscriptionDAOService,
    technicianDAOService,
    jobDAOService,
    checkListDAOService,
    estimateDAOService,
    billingInformationDAOService,
    invoiceDAOService,
    vinDAOService,
    customerWorkShopDAOService,
    settingDAOService,
};
