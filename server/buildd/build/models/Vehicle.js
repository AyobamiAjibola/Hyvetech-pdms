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
exports.$vinSchema = exports.$vehicleSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Customer_1 = __importDefault(require("./Customer"));
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../config/constants");
const Appointment_1 = __importDefault(require("./Appointment"));
const VehicleTag_1 = __importDefault(require("./VehicleTag"));
const Tag_1 = __importDefault(require("./Tag"));
const CustomerSubscription_1 = __importDefault(require("./CustomerSubscription"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
const RideShareDriverSubscription_1 = __importDefault(require("./RideShareDriverSubscription"));
const Job_1 = __importDefault(require("./Job"));
const Estimate_1 = __importDefault(require("./Estimate"));
exports.$vehicleSchema = {
    model: joi_1.default.string().required().label('Car Model'),
    make: joi_1.default.string().required().label('Car Make'),
    vin: joi_1.default.string().pattern(constants_1.VIN_PATTERN).allow('').label('Vehicle Identification Number'),
    engineCylinders: joi_1.default.string().allow('').label('Engine Type'),
    engineModel: joi_1.default.string().allow('').label('Engine Model'),
    modelYear: joi_1.default.string().allow('').label('Car Model Year'),
};
exports.$vinSchema = {
    vin: joi_1.default.string()
        .pattern(constants_1.VIN_PATTERN)
        .required()
        .messages({
        'string.pattern.base': 'Invalid VIN. Please provide valid VIN like: KL1JH526XXX11864',
    })
        .label('Vehicle Identification Number'),
};
let Vehicle = class Vehicle extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'vehicle_id' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "vin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "engineCylinders", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "modelYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "engineModel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "imageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "roadWorthinessFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "proofOfOwnershipFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "registrationNumberFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "motorReceiptFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleInspectionFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "thirdPartyInsuranceFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "hackneyFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "frontImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "rearImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "rightSideImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "leftSideImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "engineBayImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "instrumentClusterImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "nickname", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "mileageUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "mileageValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "frontTireSpec", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "rearTireSpec", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "plateNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Vehicle.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "isBooked", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "isOwner", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "onInspection", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "onMaintenance", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Customer_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Customer_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Vehicle.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Appointment_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "appointment", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Appointment_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Vehicle.prototype, "appointmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CustomerSubscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "subscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => CustomerSubscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Vehicle.prototype, "customerSubscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriver_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "rideShareDriver", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriver_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Vehicle.prototype, "rideShareDriverId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriverSubscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "rideShareDriverSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriverSubscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Vehicle.prototype, "rideShareDriverSubscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Job_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "jobs", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Estimate_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Vehicle.prototype, "estimates", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Tag_1.default, () => VehicleTag_1.default),
    __metadata("design:type", Object)
], Vehicle.prototype, "tags", void 0);
Vehicle = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'vehicles',
    })
], Vehicle);
exports.default = Vehicle;
