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
const Vehicle_1 = __importDefault(require("./Vehicle"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
const RideShareDriverPlanSubscription_1 = __importDefault(require("./RideShareDriverPlanSubscription"));
const Job_1 = __importDefault(require("./Job"));
const Transaction_1 = __importDefault(require("./Transaction"));
let RideShareDriverSubscription = class RideShareDriverSubscription extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'ride_share_driver_subscription_id',
    }),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "planType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "planCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "modeOfService", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "paymentPlan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "maxVehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "vehicleCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "minVehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], RideShareDriverSubscription.prototype, "isHybrid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.SMALLINT, defaultValue: 0 }),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "mobileCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "maxMobile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.SMALLINT, defaultValue: 0 }),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "driveInCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "maxDriveIn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.SMALLINT),
    __metadata("design:type", Number)
], RideShareDriverSubscription.prototype, "inspections", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "subscriber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "programme", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriverSubscription.prototype, "planCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RideShareDriverSubscription.prototype, "subscriptionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RideShareDriverSubscription.prototype, "nextPaymentDate", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => RideShareDriver_1.default, () => RideShareDriverPlanSubscription_1.default),
    __metadata("design:type", Object)
], RideShareDriverSubscription.prototype, "rideShareDrivers", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Job_1.default),
    __metadata("design:type", Object)
], RideShareDriverSubscription.prototype, "jobs", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Vehicle_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriverSubscription.prototype, "vehicles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Transaction_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriverSubscription.prototype, "transaction", void 0);
RideShareDriverSubscription = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'ride_share_driver_subscriptions',
    })
], RideShareDriverSubscription);
exports.default = RideShareDriverSubscription;
