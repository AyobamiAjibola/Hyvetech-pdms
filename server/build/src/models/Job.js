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
const Technician_1 = __importDefault(require("./Technician"));
const Partner_1 = __importDefault(require("./Partner"));
const RideShareDriverSubscription_1 = __importDefault(require("./RideShareDriverSubscription"));
const CustomerSubscription_1 = __importDefault(require("./CustomerSubscription"));
let Job = class Job extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'job_id', allowNull: false }),
    __metadata("design:type", Object)
], Job.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "vehicleOwner", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "mileageUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "mileageValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "frontImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "rearImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "rightSideImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "leftSideImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "engineBayImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "instrumentClusterImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Job.prototype, "jobDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50000)),
    __metadata("design:type", String)
], Job.prototype, "checkList", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Job.prototype, "reportFileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Technician_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Job.prototype, "technician", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Technician_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Job.prototype, "technicianId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Job.prototype, "partner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Job.prototype, "partnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriverSubscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Job.prototype, "rideShareDriverSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriverSubscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Job.prototype, "rideShareDriverSubscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CustomerSubscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Job.prototype, "customerSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => CustomerSubscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Job.prototype, "customerSubscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Vehicle_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Job.prototype, "vehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Vehicle_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Job.prototype, "vehicleId", void 0);
Job = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'jobs', timestamps: true })
], Job);
exports.default = Job;
