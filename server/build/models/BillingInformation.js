"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$addBillingInfoSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const joi_1 = __importDefault(require("joi"));
const Customer_1 = __importDefault(require("./Customer"));
exports.$addBillingInfoSchema = {
    id: joi_1.default.number().allow().label('Id'),
    title: joi_1.default.string().required().label('Title'),
    firstName: joi_1.default.string().required().label('First Name'),
    lastName: joi_1.default.string().required().label('Last Name'),
    phone: joi_1.default.string().required().label('Phone'),
    state: joi_1.default.string().required().label('State'),
    district: joi_1.default.string().required().label('District'),
    address: joi_1.default.string().required().label('Street & House Number'),
};
let BillingInformation = class BillingInformation extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'billing_info_id', allowNull: false }),
    __metadata("design:type", Object)
], BillingInformation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "district", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], BillingInformation.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Customer_1.default),
    __metadata("design:type", Object)
], BillingInformation.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Customer_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], BillingInformation.prototype, "customerId", void 0);
BillingInformation = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'billing_information', timestamps: true })
], BillingInformation);
exports.default = BillingInformation;
