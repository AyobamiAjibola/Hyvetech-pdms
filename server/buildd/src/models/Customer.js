"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$addVehicleSchema = exports.$verifyTransactionSchema = exports.$initTransactionSchema = exports.$customerSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const joi_1 = __importDefault(require("joi"));
const Role_1 = __importDefault(require("./Role"));
const CustomerRole_1 = __importDefault(require("./CustomerRole"));
const Contact_1 = __importDefault(require("./Contact"));
const PaymentDetail_1 = __importDefault(require("./PaymentDetail"));
const Appointment_1 = __importDefault(require("./Appointment"));
const Vehicle_1 = __importStar(require("./Vehicle"));
const Transaction_1 = __importDefault(require("./Transaction"));
const CustomerSubscription_1 = __importDefault(require("./CustomerSubscription"));
const CustomerPlanSubscription_1 = __importDefault(require("./CustomerPlanSubscription"));
const Estimate_1 = __importDefault(require("./Estimate"));
const BillingInformation_1 = __importDefault(require("./BillingInformation"));
const CustomerWorkShop_1 = __importDefault(require("./CustomerWorkShop"));
exports.$customerSchema = {
    firstName: joi_1.default.string().required().label('First Name'),
    lastName: joi_1.default.string().required().label('Last Name'),
    email: joi_1.default.string().email().required().label('Email'),
    phone: joi_1.default.string().max(11).required().label('Phone Number'),
    state: joi_1.default.string().required().label('State'),
    district: joi_1.default.string().required().label('District'),
};
exports.$initTransactionSchema = {
    email: exports.$customerSchema.email,
    phone: exports.$customerSchema.phone,
    callbackUrl: joi_1.default.string().allow('Payment CallbackPage URL'),
    subscriptionName: joi_1.default.string().label('Subscription Name'),
    planCategory: joi_1.default.string().label('Plans Category'),
    paymentPlan: joi_1.default.string().label('Payment Plans'),
    amount: joi_1.default.string().label('Amount'),
};
exports.$verifyTransactionSchema = {
    amount: exports.$initTransactionSchema.amount,
    email: exports.$initTransactionSchema.email,
    paymentPlan: exports.$initTransactionSchema.paymentPlan,
    planCategory: exports.$initTransactionSchema.planCategory,
    subscriptionName: exports.$initTransactionSchema.subscriptionName,
    reference: joi_1.default.string().required().label('Payment Reference'),
};
exports.$addVehicleSchema = {
    customerId: joi_1.default.number().required().label('Customer Id'),
    ...Vehicle_1.$vehicleSchema,
};
let Customer = class Customer extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'customer_id' }),
    __metadata("design:type", Object)
], Customer.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "designation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "rawPassword", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "profileImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", String)
], Customer.prototype, "loginToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", String)
], Customer.prototype, "expoSlug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "gatewayId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "eventId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Customer.prototype, "pushToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Customer.prototype, "loginDate", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => BillingInformation_1.default),
    __metadata("design:type", Object)
], Customer.prototype, "billingInformation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => CustomerWorkShop_1.default),
    __metadata("design:type", Object)
], Customer.prototype, "workshops", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Estimate_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Customer.prototype, "estimates", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Contact_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Customer.prototype, "contacts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => PaymentDetail_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Customer.prototype, "paymentDetails", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Vehicle_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Customer.prototype, "vehicles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Customer.prototype, "transactions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Appointment_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Customer.prototype, "appointments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => CustomerSubscription_1.default, () => CustomerPlanSubscription_1.default),
    __metadata("design:type", Object)
], Customer.prototype, "subscriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Role_1.default, () => CustomerRole_1.default),
    __metadata("design:type", Object)
], Customer.prototype, "roles", void 0);
Customer = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'customers',
        paranoid: true,
    })
], Customer);
exports.default = Customer;
