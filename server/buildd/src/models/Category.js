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
const Plan_1 = __importDefault(require("./Plan"));
const PaymentPlan_1 = __importDefault(require("./PaymentPlan"));
const PlanCategory_1 = __importDefault(require("./PlanCategory"));
const PaymentPlanCategory_1 = __importDefault(require("./PaymentPlanCategory"));
const Partner_1 = __importDefault(require("./Partner"));
const PartnerCategory_1 = __importDefault(require("./PartnerCategory"));
let Category = class Category extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'category_id',
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Object)
], Category.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Plan_1.default, () => PlanCategory_1.default),
    __metadata("design:type", Object)
], Category.prototype, "plans", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Partner_1.default, () => PartnerCategory_1.default),
    __metadata("design:type", Object)
], Category.prototype, "partners", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => PaymentPlan_1.default, () => PaymentPlanCategory_1.default),
    __metadata("design:type", Object)
], Category.prototype, "paymentPlans", void 0);
Category = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'categories',
        timestamps: true,
    })
], Category);
exports.default = Category;
