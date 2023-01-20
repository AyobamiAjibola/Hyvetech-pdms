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
const Contact_1 = __importDefault(require("./Contact"));
const PaymentDetail_1 = __importDefault(require("./PaymentDetail"));
const Vehicle_1 = __importDefault(require("./Vehicle"));
const Transaction_1 = __importDefault(require("./Transaction"));
const Appointment_1 = __importDefault(require("./Appointment"));
const Role_1 = __importDefault(require("./Role"));
const RideShareDriverRole_1 = __importDefault(require("./RideShareDriverRole"));
const RideShareDriverSubscription_1 = __importDefault(require("./RideShareDriverSubscription"));
const RideShareDriverPlanSubscription_1 = __importDefault(require("./RideShareDriverPlanSubscription"));
const PartnerRideShareDriver_1 = __importDefault(require("./PartnerRideShareDriver"));
const Partner_1 = __importDefault(require("./Partner"));
const Estimate_1 = __importDefault(require("./Estimate"));
let RideShareDriver = class RideShareDriver extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'ride_share_driver_id',
        allowNull: false,
    }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "designation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "rawPassword", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "profileImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "frontLicenseImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "rearLicenseImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], RideShareDriver.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], RideShareDriver.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", String)
], RideShareDriver.prototype, "loginToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "gatewayId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "eventId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", String)
], RideShareDriver.prototype, "pushToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", String)
], RideShareDriver.prototype, "expoSlug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], RideShareDriver.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RideShareDriver.prototype, "loginDate", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Contact_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "contacts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => PaymentDetail_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "paymentDetails", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Vehicle_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "vehicles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "transactions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Estimate_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "estimates", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Appointment_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "appointments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => RideShareDriverSubscription_1.default, () => RideShareDriverPlanSubscription_1.default),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "subscriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Role_1.default, () => RideShareDriverRole_1.default),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Partner_1.default, () => PartnerRideShareDriver_1.default),
    __metadata("design:type", Object)
], RideShareDriver.prototype, "partners", void 0);
RideShareDriver = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'ride_share_drivers',
    })
], RideShareDriver);
exports.default = RideShareDriver;
