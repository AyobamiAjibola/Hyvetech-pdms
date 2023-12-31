import CustomerRepository from "../../repositories/CustomerRepository";
import ContactRepository from "../../repositories/ContactRepository";
import RoleRepository from "../../repositories/RoleRepository";
import VehicleRepository from "../../repositories/VehicleRepository";
import ScheduleRepository from "../../repositories/ScheduleRepository";
import AppointmentRepository from "../../repositories/AppointmentRepository";
import VehicleFaultRepository from "../../repositories/VehicleFaultRepository";
import TransactionRepository from "../../repositories/TransactionRepository";
import DistrictRepository from "../../repositories/DistrictRepository";
import VINDecoderProviderRepository from "../../repositories/VINDecoderProviderRepository";

import AppointmentDAOService from "./AppointmentDAOService";
import VehicleDAOService from "./VehicleDAOService";
import VehicleFaultDAOService from "./VehicleFaultDAOService";
import CustomerDAOService from "./CustomerDAOService";
import DistrictDAOService from "./DistrictDAOService";
import ScheduleDAOService from "./ScheduleDAOService";
import TransactionDAOService from "./TransactionDAOService";
import VINDecoderProviderDAOService from "./VINDecoderProviderDAOService";
import SubscriptionRepository from "../../repositories/SubscriptionRepository";
import SubscriptionDAOService from "./SubscriptionDAOService";
import PaymentTermRepository from "../../repositories/PaymentTermRepository";
import PaymentTermDAOService from "./PaymentDAOService";
import PaymentGatewayRepository from "../../repositories/PaymentGatewayRepository";
import PaymentGatewayDAOService from "./PaymentGatewayDAOService";
import PlanRepository from "../../repositories/PlanRepository";
import PlanDAOService from "./PlanDAOService";
import ContactDAOService from "./ContactDAOService";
import TimeSlotRepository from "../../repositories/TimeSlotRepository";
import TimeSlotDAOService from "./TimeSlotDAOService";
import DiscountRepository from "../../repositories/DiscountRepository";
import DiscountDAOService from "./DiscountDAOService";
import StateRepository from "../../repositories/StateRepository";
import StateDAOService from "./StateDAOService";
import PasswordEncoder from "../../utils/PasswordEncoder";
import CustomerSubscriptionRepository from "../../repositories/CustomerSubscriptionRepository";
import CustomerSubscriptionDAOService from "./CustomerSubscriptionDAOService";
import BankRepository from "../../repositories/BankRepository";
import BankDAOService from "./BankDAOService";
import TagRepository from "../../repositories/TagRepository";
import TagDAOService from "./TagDAOService";
import VINRepository from "../../repositories/VINRepository";
import UserRepository from "../../repositories/UserRepository";
import UserDAOService from "./UserDAOService";
import PermissionRepository from "../../repositories/PermissionRepository";
import RoleDAOService from "./RoleDAOService";
import PermissionDAOService from "./PermissionDAOService";
import PartnerRepository from "../../repositories/PartnerRepository";
import PartnerDAOService from "./PartnerDAOService";
import CategoryRepository from "../../repositories/CategoryRepository";
import CategoryDAOService from "./CategoryDAOService";
import PaymentPlanRepository from "../../repositories/PaymentPlanRepository";
import PaymentPlanDAOService from "./PaymentPlanDAOService";
import RideShareDriverRepository from "../../repositories/RideShareDriverRepository";
import RideShareDriverDAOService from "./RideShareDriverDAOService";
import RideShareDriverSubscriptionRepository from "../../repositories/RideShareDriverSubscriptionRepository";
import RideShareDriverSubscriptionDAOService from "./RideShareDriverSubscriptionDAOService";
import TechnicianRepository from "../../repositories/TechnicianRepository";
import TechnicianDAOService from "./TechnicianDAOService";
import JobRepository from "../../repositories/JobRepository";
import JobDAOService from "./JobDAOService";
import CheckListRepository from "../../repositories/CheckListRepository";
import CheckListDAOService from "./CheckListDAOService";
import EstimateRepository from "../../repositories/EstimateRepository";
import EstimateDAOService from "./EstimateDAOService";
import BillingInformationRepository from "../../repositories/BillingInformationRepository";
import BillingInformationDAOService from "./BillingInformationDAOService";
import InvoiceRepository from "../../repositories/InvoiceRepository";
import InvoiceDAOService from "./InvoiceDAOService";
import VINDAOService from "./VINDAOService";
import CustomerWorkShopRepository from "../../repositories/CustomerWorkShopRepository";
import CustomerWorkShopDAOService from "./CustomerWorkShopDAOService";
import SettingRepository from "../../repositories/SettingRepository";
import SettingDAOService from "./SettingDAOService";
import BeneficiaryDAOService from "./BeneficiaryDAOService";
import BeneficiaryRepository from "../../repositories/BeneficiaryRepository";
import ExpenseTypeRepository from "../../repositories/ExpenseTypeRepository";
import ExpenseCategoryRepository from "../../repositories/ExpenseCategoryRepository";
import ExpenseTypeDAOService from "./ExpenseTypeDAOService";
import ExpenseCategoryDAOService from "./ExpenseCategoryDAOService";
import ExpenseRepository from "../../repositories/ExpenseRepository";
import ExpenseDAOService from "./ExpenseDAOService";
import PreferenceRepository from "../../repositories/preferenceRepository";
import PreferenceDAOService from "./PreferenceDAOService";
import ItemStockDAOService from "./ItemStockDAOService";
import ItemStockRepository from "../../repositories/ItemStockRepository";
import ServiceReminderDAOService from "./ServiceReminderDAOService";
import ServiceReminderRepository from "../../repositories/ServiceReminder";
import ReminderTypeRepository from "../../repositories/ReminderType";
import ReminderTypeDAOService from "./ReminderTypeDAOService";
import CBAService from "../CBAService";
import KudaService from "../KudaService";
import PartAccountRepository from "../../repositories/PartnerAccountRepository";
import { PartnerAccountDAOService } from "./PartnerAccountDAOService";
import AccountActivationRequestDAOService from "./AccountActivationRequestDAOService";
import AccountActivationRequestRepository from "../../repositories/AccountActivationRequestRepository";
import SendGridMailService from "../SendGrid";
import TermiiService from "../TermiiService";

const customerRepository = new CustomerRepository();
const contactRepository = new ContactRepository();
const roleRepository = new RoleRepository();
const vehicleRepository = new VehicleRepository();
const scheduleRepository = new ScheduleRepository();
const appointmentRepository = new AppointmentRepository();
const vehicleFaultRepository = new VehicleFaultRepository();
const paymentTermRepository = new PaymentTermRepository();
const transactionRepository = new TransactionRepository();
const districtRepository = new DistrictRepository();
const paymentGatewayRepository = new PaymentGatewayRepository();
const subscriptionRepository = new SubscriptionRepository();
const vinDecoderProviderRepository = new VINDecoderProviderRepository();
const planRepository = new PlanRepository();
const timeSlotRepository = new TimeSlotRepository();
const discountRepository = new DiscountRepository();
const stateRepository = new StateRepository();
const passwordEncoder = new PasswordEncoder();
const customerSubscriptionRepository = new CustomerSubscriptionRepository();
const bankRepository = new BankRepository();
const tagRepository = new TagRepository();
const vinRepository = new VINRepository();
const userRepository = new UserRepository();
const permissionRepository = new PermissionRepository();
const partnerRepository = new PartnerRepository();
const categoryRepository = new CategoryRepository();
const paymentPlanRepository = new PaymentPlanRepository();
const rideShareDriverRepository = new RideShareDriverRepository();
const rideShareDriverSubscriptionRepository =
  new RideShareDriverSubscriptionRepository();
const technicianRepository = new TechnicianRepository();
const jobRepository = new JobRepository();
const checkListRepository = new CheckListRepository();
const estimateRepository = new EstimateRepository();
const billingInformationRepository = new BillingInformationRepository();
const invoiceRepository = new InvoiceRepository();
const customerWorkShopRepository = new CustomerWorkShopRepository();
const settingRepository = new SettingRepository();
const preferenceRepository = new PreferenceRepository();

const vehicleDAOService = new VehicleDAOService(vehicleRepository);
const contactDAOService = new ContactDAOService(contactRepository);
const scheduleDAOService = new ScheduleDAOService(scheduleRepository);
const vehicleFaultDAOService = new VehicleFaultDAOService(
  vehicleFaultRepository
);
const appointmentDAOService = new AppointmentDAOService(appointmentRepository);
const transactionDAOService = new TransactionDAOService(transactionRepository);
const districtDAOService = new DistrictDAOService(districtRepository);
const customerDAOService = new CustomerDAOService(
  customerRepository,
  roleRepository,
  passwordEncoder
);
const paymentTermDAOService = new PaymentTermDAOService(paymentTermRepository);
const paymentGatewayDAOService = new PaymentGatewayDAOService(
  paymentGatewayRepository
);
const subscriptionDAOService = new SubscriptionDAOService(
  subscriptionRepository
);
const vinDecoderProviderDAOService = new VINDecoderProviderDAOService(
  vinDecoderProviderRepository,
  vinRepository
);
const planDAOService = new PlanDAOService(planRepository);
const timeSlotDAOService = new TimeSlotDAOService(timeSlotRepository);
const discountDAOService = new DiscountDAOService(discountRepository);
const stateDAOService = new StateDAOService(stateRepository);
const vinDAOService = new VINDAOService(vinRepository);
const customerSubscriptionDAOService = new CustomerSubscriptionDAOService(
  customerSubscriptionRepository
);
const bankDAOService = new BankDAOService(bankRepository);
const tagDAOService = new TagDAOService(tagRepository);
const userDAOService = new UserDAOService(userRepository);
const roleDAOService = new RoleDAOService(roleRepository);
const permissionDAOService = new PermissionDAOService(permissionRepository);
const partnerDAOService = new PartnerDAOService(partnerRepository);
const categoryDAOService = new CategoryDAOService(categoryRepository);
const paymentPlanDAOService = new PaymentPlanDAOService(paymentPlanRepository);
const rideShareDriverDAOService = new RideShareDriverDAOService(
  rideShareDriverRepository
);
const rideShareDriverSubscriptionDAOService =
  new RideShareDriverSubscriptionDAOService(
    rideShareDriverSubscriptionRepository
  );
const technicianDAOService = new TechnicianDAOService(technicianRepository);
const jobDAOService = new JobDAOService(jobRepository);
const checkListDAOService = new CheckListDAOService(checkListRepository);
const estimateDAOService = new EstimateDAOService(estimateRepository);
const billingInformationDAOService = new BillingInformationDAOService(
  billingInformationRepository
);
const invoiceDAOService = new InvoiceDAOService(invoiceRepository);
const customerWorkShopDAOService = new CustomerWorkShopDAOService(
  customerWorkShopRepository
);
const settingDAOService = new SettingDAOService(settingRepository);

const beneficiaryRepository = new BeneficiaryRepository();
const expenseTypeRepository = new ExpenseTypeRepository();
const expenseCategoryRepository = new ExpenseCategoryRepository();
const expenseRespository = new ExpenseRepository();
const itemStockRepository = new ItemStockRepository();
const serviceReminderRepository = new ServiceReminderRepository();
const reminderTypeRepository = new ReminderTypeRepository();

const beneficiaryDAOService = new BeneficiaryDAOService(beneficiaryRepository);
const expenseTypeDAOService = new ExpenseTypeDAOService(expenseTypeRepository);
const expenseCategoryDAOService = new ExpenseCategoryDAOService(
  expenseCategoryRepository
);
const expenseDAOService = new ExpenseDAOService(expenseRespository);
const preferenceDAOService = new PreferenceDAOService(preferenceRepository);
const itemStockDAOService = new ItemStockDAOService(itemStockRepository);
const serviceReminderDAOService = new ServiceReminderDAOService(
  serviceReminderRepository
);
const reminderTypeDAOService = new ReminderTypeDAOService(
  reminderTypeRepository
);

const kudaService = new KudaService();
const cbaService = new CBAService(kudaService);

const mailService = new SendGridMailService();

const termiiService = new TermiiService();

const parterAccountRepository = new PartAccountRepository();

const partnerAccountDaoService = new PartnerAccountDAOService(
  parterAccountRepository,
  kudaService
);

const accountActivationDAOService = new AccountActivationRequestDAOService(
  new AccountActivationRequestRepository()
);

export default {
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
  beneficiaryDAOService,
  expenseCategoryDAOService,
  expenseTypeDAOService,
  expenseDAOService,
  preferenceDAOService,
  itemStockDAOService,
  serviceReminderDAOService,
  reminderTypeDAOService,
  cbaService,
  partnerAccountDaoService,
  kudaService,
  accountActivationDAOService,
  mailService,
  termiiService,
};
