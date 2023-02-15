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
exports.$contactSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Customer_1 = __importDefault(require("./Customer"));
const joi_1 = __importDefault(require("joi"));
const User_1 = __importDefault(require("./User"));
const Partner_1 = __importDefault(require("./Partner"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
const Technician_1 = __importDefault(require("./Technician"));
exports.$contactSchema = {
    address: joi_1.default.string().required().label('Address'),
    city: joi_1.default.string().allow('').label('City'),
    district: joi_1.default.string().allow('').label('District'),
    postalCode: joi_1.default.string().max(15).allow('').label('Postal Code'),
    state: joi_1.default.string().allow('').label('State'),
    country: joi_1.default.string().allow('').label('Country'),
};
let Contact = class Contact extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'contact_id' }),
    __metadata("design:type", Object)
], Contact.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "label", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "district", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Contact.prototype, "mapUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Customer_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Contact.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Customer_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Contact.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Contact.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Contact.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Contact.prototype, "partner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Contact.prototype, "partnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriver_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Contact.prototype, "rideShareDriver", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriver_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Contact.prototype, "rideShareDriverId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Technician_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Contact.prototype, "technician", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Technician_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Contact.prototype, "technicianId", void 0);
Contact = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'contacts',
    })
], Contact);
exports.default = Contact;
