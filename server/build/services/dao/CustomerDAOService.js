"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("../../models/Role"));
const Generic_1 = __importDefault(require("../../utils/Generic"));
const settings_1 = __importDefault(require("../../config/settings"));
const moment_1 = __importDefault(require("moment/moment"));
class CustomerDAOService {
    customerRepository;
    roleRepository;
    passwordEncoder;
    constructor(customerRepository, roleRepository, passwordEncoder) {
        this.startDate = (0, moment_1.default)({ hours: 0, minutes: 0, seconds: 0 }).toDate();
        this.endDate = (0, moment_1.default)({ hours: 23, minutes: 59, seconds: 59 }).toDate();
        this.year = (0, moment_1.default)().year();
        this.customerRepository = customerRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }
    update(customer, values, options) {
        return this.customerRepository.updateOne(customer, values, options);
    }
    findById(id, options) {
        return this.customerRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.customerRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.customerRepository.findOne(options);
    }
    findAll(options) {
        return this.customerRepository.findAll(options);
    }
    async create(values, options) {
        let rawPassword;
        if (!values.password && !values.rawPassword) {
            rawPassword = values.phone || Generic_1.default.generateRandomString(8);
            values.password = await this.passwordEncoder.encode(rawPassword);
            values.rawPassword = rawPassword;
        }
        //get customer role
        // Role.findOne
        const role = await Role_1.default.findOne({
            where: {
                // name: settings?.roles[1] || "CUSTOMER_ROLE"
                id: 2
            },
        });
        if (!role) {
            console.log(settings_1.default?.roles[1] || "CUSTOMER_ROLE");
            throw new Error('Role does not exist');
        }
        //create customer
        const customer = await this.customerRepository.save(values, options);
        //associate customer with role
        await customer.$add('roles', role);
        return customer;
    }
    async getTotalDailyCustomers() {
        return Generic_1.default.getDailyData(this.customerRepository);
    }
    async getTotalMonthlyCustomers() {
        return Generic_1.default.getMonthlyData(this.customerRepository);
    }
}
exports.default = CustomerDAOService;
