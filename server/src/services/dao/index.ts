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
};