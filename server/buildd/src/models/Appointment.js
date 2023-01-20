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
exports.$cancelInspectionSchema = exports.$rescheduleInspectionSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const VehicleFault_1 = __importDefault(require("./VehicleFault"));
const Customer_1 = __importDefault(require("./Customer"));
const Vehicle_1 = __importDefault(require("./Vehicle"));
const joi_1 = __importDefault(require("joi"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
exports.$rescheduleInspectionSchema = {
    customerId: joi_1.default.number().required().label('Customer Id'),
    time: joi_1.default.date().iso().required().label('Appointment Date'),
    timeSlot: joi_1.default.string().allow('').label('Time Slot'),
    location: joi_1.default.string().allow('').label('Location'),
    vehicleFault: joi_1.default.string().allow('').label('Vehicle Fault'),
    planCategory: joi_1.default.string().allow('').label('Plans Category'),
    image: joi_1.default.string().allow('').label('Vehicle Fault Image'),
    video: joi_1.default.string().allow('').label('Vehicle Fault Video'),
};
exports.$cancelInspectionSchema = {
    customerId: joi_1.default.number().required().label('Customer Id'),
};
let Appointment = class Appointment extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'appointment_id', allowNull: false }),
    __metadata("design:type", Object)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Appointment.prototype, "appointmentDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "serviceLocation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "timeSlot", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "planCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "modeOfService", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "programme", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "serviceCost", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "inventoryFile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "reportFile", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Appointment.prototype, "estimateFile", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Vehicle_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Appointment.prototype, "vehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => VehicleFault_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Appointment.prototype, "vehicleFault", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Customer_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Appointment.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Customer_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Appointment.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriver_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Appointment.prototype, "rideShareDriver", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriver_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Appointment.prototype, "rideShareDriverId", void 0);
Appointment = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'appointments',
    })
], Appointment);
exports.default = Appointment;
