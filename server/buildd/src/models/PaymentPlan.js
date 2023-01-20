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
exports.$paymentPlanSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Plan_1 = __importDefault(require("./Plan"));
const Category_1 = __importDefault(require("./Category"));
const PaymentPlanCategory_1 = __importDefault(require("./PaymentPlanCategory"));
const joi_1 = __importDefault(require("joi"));
exports.$paymentPlanSchema = {
    name: joi_1.default.string().required().label('Payment Plans Name'),
    discount: joi_1.default.string().allow('').label('Discount'),
    plan: joi_1.default.string().required().label('Plans Name'),
    coverage: joi_1.default.string().required().label('Coverage'),
    descriptions: joi_1.default.array().allow().label('Payment Plans Description'),
    parameters: joi_1.default.array().allow().label('Payment Plans Coverage'),
    pricing: joi_1.default.array().allow().label('Payment Plans Pricing'),
};
let PaymentPlan = class PaymentPlan extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'payment_plan_id',
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Object)
], PaymentPlan.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PaymentPlan.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PaymentPlan.prototype, "label", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PaymentPlan.prototype, "coverage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], PaymentPlan.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], PaymentPlan.prototype, "hasPromo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], PaymentPlan.prototype, "discount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)),
    __metadata("design:type", Array)
], PaymentPlan.prototype, "descriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)),
    __metadata("design:type", Array)
], PaymentPlan.prototype, "parameters", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING)),
    __metadata("design:type", Array)
], PaymentPlan.prototype, "pricing", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Plan_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], PaymentPlan.prototype, "plan", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Plan_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], PaymentPlan.prototype, "planId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Category_1.default, () => PaymentPlanCategory_1.default),
    __metadata("design:type", Object)
], PaymentPlan.prototype, "categories", void 0);
PaymentPlan = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'payment_plans',
        timestamps: true,
    })
], PaymentPlan);
exports.default = PaymentPlan;
