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
exports.$planSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Subscription_1 = __importDefault(require("./Subscription"));
const PaymentPlan_1 = __importDefault(require("./PaymentPlan"));
const Category_1 = __importDefault(require("./Category"));
const PlanCategory_1 = __importDefault(require("./PlanCategory"));
const joi_1 = __importDefault(require("joi"));
const Partner_1 = __importDefault(require("./Partner"));
const uuid_1 = require("uuid");
exports.$planSchema = {
    label: joi_1.default.string().required().label('Plans Name'),
    minVehicles: joi_1.default.number().required().label('Minimum Vehicle'),
    maxVehicles: joi_1.default.number().required().label('Maximum Vehicle'),
    validity: joi_1.default.string().required().label('Plans Validity'),
    mobile: joi_1.default.number().required().label('No of Mobile Service'),
    driveIn: joi_1.default.number().required().label('No of Drive-in Service'),
    inspections: joi_1.default.number().required().label('Total Inspections'),
    programme: joi_1.default.string().required().label('Programme'),
    serviceMode: joi_1.default.string().required().label('Service Mode'),
};
let Plan = class Plan extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'plan_id',
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Object)
], Plan.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: (0, uuid_1.v4)() }),
    __metadata("design:type", String)
], Plan.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "label", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], Plan.prototype, "minVehicles", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], Plan.prototype, "maxVehicles", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "inspections", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "mobile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "driveIn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "validity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Plan.prototype, "serviceMode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Subscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Subscription_1.default)
], Plan.prototype, "subscriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Subscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "subscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Partner_1.default)
], Plan.prototype, "partner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Plan.prototype, "partnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => PaymentPlan_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Array)
], Plan.prototype, "paymentPlans", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Category_1.default, () => PlanCategory_1.default),
    __metadata("design:type", Object)
], Plan.prototype, "categories", void 0);
Plan = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'plans',
        timestamps: true,
    })
], Plan);
exports.default = Plan;
