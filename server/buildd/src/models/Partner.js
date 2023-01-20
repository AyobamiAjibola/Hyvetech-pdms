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
const User_1 = __importDefault(require("./User"));
const PartnerCategory_1 = __importDefault(require("./PartnerCategory"));
const Category_1 = __importDefault(require("./Category"));
const Plan_1 = __importDefault(require("./Plan"));
const PartnerRideShareDriver_1 = __importDefault(require("./PartnerRideShareDriver"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
const Job_1 = __importDefault(require("./Job"));
const Technician_1 = __importDefault(require("./Technician"));
const PartnerTechnician_1 = __importDefault(require("./PartnerTechnician"));
const CheckList_1 = __importDefault(require("./CheckList"));
const PartnerCheckList_1 = __importDefault(require("./PartnerCheckList"));
const Estimate_1 = __importDefault(require("./Estimate"));
const Transaction_1 = __importDefault(require("./Transaction"));
let Partner = class Partner extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'partner_id', allowNull: false }),
    __metadata("design:type", Object)
], Partner.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "logo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "googleMap", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "bankName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "accountName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "accountNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Partner.prototype, "totalStaff", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Partner.prototype, "totalTechnicians", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)),
    __metadata("design:type", Array)
], Partner.prototype, "brands", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)),
    __metadata("design:type", Array)
], Partner.prototype, "images", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Partner.prototype, "yearOfIncorporation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "cac", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "vatNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "nameOfDirector", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Partner.prototype, "nameOfManager", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)),
    __metadata("design:type", Array)
], Partner.prototype, "workingHours", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Contact_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Partner.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Plan_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Partner.prototype, "plans", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Job_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Partner.prototype, "jobs", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => User_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Estimate_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "estimates", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => CheckList_1.default, () => PartnerCheckList_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "checkLists", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => RideShareDriver_1.default, () => PartnerRideShareDriver_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "rideShareDrivers", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Technician_1.default, () => PartnerTechnician_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "technicians", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Category_1.default, () => PartnerCategory_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "categories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_1.default),
    __metadata("design:type", Object)
], Partner.prototype, "transactions", void 0);
Partner = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'partners',
    })
], Partner);
exports.default = Partner;
