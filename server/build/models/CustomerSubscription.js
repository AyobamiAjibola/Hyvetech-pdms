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
const sequelize_typescript_1 = require("sequelize-typescript");
const Customer_1 = __importDefault(require("./Customer"));
const Vehicle_1 = __importDefault(require("./Vehicle"));
const CustomerPlanSubscription_1 = __importDefault(require("./CustomerPlanSubscription"));
const Job_1 = __importDefault(require("./Job"));
const Transaction_1 = __importDefault(require("./Transaction"));
let CustomerSubscription = class CustomerSubscription extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'customer_subscription_id',
    }),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "planType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "planCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "modeOfService", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "paymentPlan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "maxVehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "vehicleCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "minVehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], CustomerSubscription.prototype, "isHybrid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.SMALLINT, defaultValue: 0 }),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "mobileCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "maxMobile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.SMALLINT, defaultValue: 0 }),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "driveInCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "maxDriveIn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], CustomerSubscription.prototype, "inspections", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "subscriber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "programme", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CustomerSubscription.prototype, "planCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], CustomerSubscription.prototype, "subscriptionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], CustomerSubscription.prototype, "nextPaymentDate", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Customer_1.default, () => CustomerPlanSubscription_1.default),
    __metadata("design:type", Object)
], CustomerSubscription.prototype, "customers", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Vehicle_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], CustomerSubscription.prototype, "vehicles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Transaction_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], CustomerSubscription.prototype, "transaction", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Job_1.default),
    __metadata("design:type", Object)
], CustomerSubscription.prototype, "jobs", void 0);
CustomerSubscription = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'customer_subscriptions',
    })
], CustomerSubscription);
exports.default = CustomerSubscription;
