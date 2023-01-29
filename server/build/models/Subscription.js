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
exports.$subscriptionSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Plan_1 = __importDefault(require("./Plan"));
const ServiceSubscription_1 = __importDefault(require("./ServiceSubscription"));
const Service_1 = __importDefault(require("./Service"));
const joi_1 = __importDefault(require("joi"));
exports.$subscriptionSchema = {
    name: joi_1.default.string().required().label('Name'),
    planCategory: joi_1.default.string().required().label('Plans Category'),
    paymentPlan: joi_1.default.string().required().label('Payment Plans'),
    price: joi_1.default.string().required().label('Subscription Price'),
};
let Subscription = class Subscription extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        field: 'subscription_id',
    }),
    __metadata("design:type", Object)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Subscription.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Subscription.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Subscription.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Service_1.default, () => ServiceSubscription_1.default),
    __metadata("design:type", Object)
], Subscription.prototype, "services", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Plan_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Subscription.prototype, "plans", void 0);
Subscription = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'subscriptions',
        timestamps: true,
    })
], Subscription);
exports.default = Subscription;
