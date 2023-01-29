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
const Discount_1 = __importDefault(require("./Discount"));
const DistrictDiscount_1 = __importDefault(require("./DistrictDiscount"));
const State_1 = __importDefault(require("./State"));
let District = class District extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'district_id', allowNull: false }),
    __metadata("design:type", Object)
], District.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Discount_1.default, () => DistrictDiscount_1.default),
    __metadata("design:type", Object)
], District.prototype, "discounts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => State_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], District.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => State_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], District.prototype, "stateId", void 0);
District = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'districts',
    })
], District);
exports.default = District;
