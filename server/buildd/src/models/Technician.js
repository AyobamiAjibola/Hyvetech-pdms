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
exports.$technicianSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const joi_1 = __importDefault(require("joi"));
const Role_1 = __importDefault(require("./Role"));
const Contact_1 = __importDefault(require("./Contact"));
const Job_1 = __importDefault(require("./Job"));
const TechnicianRole_1 = __importDefault(require("./TechnicianRole"));
const PartnerTechnician_1 = __importDefault(require("./PartnerTechnician"));
const Partner_1 = __importDefault(require("./Partner"));
exports.$technicianSchema = {
    firstName: joi_1.default.string().required().label('First Name'),
    lastName: joi_1.default.string().required().label('Last Name'),
    email: joi_1.default.string().email().required().label('Email'),
    phone: joi_1.default.string().max(11).required().label('Phone Number'),
    state: joi_1.default.string().required().label('State'),
    district: joi_1.default.string().required().label('District'),
};
let Technician = class Technician extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'technician_id' }),
    __metadata("design:type", Object)
], Technician.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "designation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "rawPassword", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "profileImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Technician.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Technician.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Technician.prototype, "hasJob", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", String)
], Technician.prototype, "loginToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "gatewayId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Technician.prototype, "eventId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Technician.prototype, "loginDate", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Contact_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Technician.prototype, "contacts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Job_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Technician.prototype, "jobs", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Role_1.default, () => TechnicianRole_1.default),
    __metadata("design:type", Object)
], Technician.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Partner_1.default, () => PartnerTechnician_1.default),
    __metadata("design:type", Object)
], Technician.prototype, "partners", void 0);
Technician = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'technicians',
    })
], Technician);
exports.default = Technician;
