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
const Customer_1 = __importDefault(require("./Customer"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
const CustomerSubscription_1 = __importDefault(require("./CustomerSubscription"));
const RideShareDriverSubscription_1 = __importDefault(require("./RideShareDriverSubscription"));
const Invoice_1 = __importDefault(require("./Invoice"));
const Partner_1 = __importDefault(require("./Partner"));
let Transaction = class Transaction extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'transaction_id', allowNull: false }),
    __metadata("design:type", Object)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "reference", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, defaultValue: 'unprocessed' }),
    __metadata("design:type", String)
], Transaction.prototype, "serviceStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "authorizationUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Transaction.prototype, "isRequestForInspection", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "purpose", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "last4", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "expMonth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "expYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "channel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "cardType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "bank", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "countryCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "brand", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "currency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transaction.prototype, "planCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Transaction.prototype, "paidAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CustomerSubscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Transaction.prototype, "customerSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => CustomerSubscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Transaction.prototype, "customerSubscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriverSubscription_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Transaction.prototype, "rideShareDriverSubscription", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriverSubscription_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Transaction.prototype, "rideShareDriverSubscriptionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Customer_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Transaction.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Customer_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Transaction.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriver_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Transaction.prototype, "rideShareDriver", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriver_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Transaction.prototype, "rideShareDriverId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Invoice_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Transaction.prototype, "invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Invoice_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Transaction.prototype, "invoiceId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], Transaction.prototype, "partner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Transaction.prototype, "partnerId", void 0);
Transaction = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'transactions',
    })
], Transaction);
exports.default = Transaction;
