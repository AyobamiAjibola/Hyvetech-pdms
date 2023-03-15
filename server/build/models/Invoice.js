"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$saveInvoiceSchema = exports.$sendInvoiceSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Estimate_1 = __importStar(require("./Estimate"));
const Transaction_1 = __importDefault(require("./Transaction"));
const joi_1 = __importDefault(require("joi"));
const DraftInvoice_1 = __importDefault(require("./DraftInvoice"));
exports.$sendInvoiceSchema = {
    id: joi_1.default.number().required().label('Invoice Id'),
    address: joi_1.default.string().required().label(Estimate_1.estimateFields.address.label),
    addressType: joi_1.default.string().required().label(Estimate_1.estimateFields.addressType.label),
    parts: joi_1.default.array().required().label(Estimate_1.estimateFields.parts.label),
    partsTotal: joi_1.default.number().required().label(Estimate_1.estimateFields.partsTotal.label),
    labours: joi_1.default.array().required().label(Estimate_1.estimateFields.labours.label),
    tax: joi_1.default.any().optional().label(Estimate_1.estimateFields.tax.label),
    taxPart: joi_1.default.any().optional().label(Estimate_1.estimateFields.tax.label),
    laboursTotal: joi_1.default.number().required().label(Estimate_1.estimateFields.laboursTotal.label),
    grandTotal: joi_1.default.number().required().label(Estimate_1.estimateFields.firstName.label),
    depositAmount: joi_1.default.string().required().label(Estimate_1.estimateFields.depositAmount.label),
    paidAmount: joi_1.default.string().allow('').label(Estimate_1.estimateFields.paidAmount.label),
    additionalDeposit: joi_1.default.string().allow('').label(Estimate_1.estimateFields.additionalDeposit.label),
    refundable: joi_1.default.number().allow().label('Funds to Refund'),
    jobDurationValue: joi_1.default.string().required().label(Estimate_1.estimateFields.jobDurationValue.label),
    jobDurationUnit: joi_1.default.string().required().label(Estimate_1.estimateFields.jobDurationUnit.label),
    dueAmount: joi_1.default.number().allow().label('Due Amount'),
};
exports.$saveInvoiceSchema = {
    id: joi_1.default.number().required().label('Invoice Id'),
    address: joi_1.default.string().allow('').label(Estimate_1.estimateFields.address.label),
    addressType: joi_1.default.string().allow('').label(Estimate_1.estimateFields.addressType.label),
    parts: joi_1.default.array().allow().label(Estimate_1.estimateFields.parts.label),
    partsTotal: joi_1.default.number().allow().label(Estimate_1.estimateFields.partsTotal.label),
    labours: joi_1.default.array().allow().label(Estimate_1.estimateFields.labours.label),
    tax: joi_1.default.any().allow('').optional().label(Estimate_1.estimateFields.tax.label),
    taxPart: joi_1.default.any().allow('').optional().label(Estimate_1.estimateFields.taxPart.label),
    laboursTotal: joi_1.default.number().allow().label(Estimate_1.estimateFields.laboursTotal.label),
    grandTotal: joi_1.default.number().allow().label(Estimate_1.estimateFields.firstName.label),
    depositAmount: joi_1.default.string().allow('').label(Estimate_1.estimateFields.depositAmount.label),
    paidAmount: joi_1.default.string().allow('').label(Estimate_1.estimateFields.paidAmount.label),
    additionalDeposit: joi_1.default.string().allow('').label(Estimate_1.estimateFields.additionalDeposit.label),
    refundable: joi_1.default.number().allow().label('Refund'),
    jobDurationValue: joi_1.default.string().allow('').label(Estimate_1.estimateFields.jobDurationValue.label),
    jobDurationUnit: joi_1.default.string().allow('').label(Estimate_1.estimateFields.jobDurationUnit.label),
    dueAmount: joi_1.default.number().allow().label('Due Amount'),
    discount: joi_1.default.number().label('discount'),
    discountType: joi_1.default.string().label('discountType'),
};
let Invoice = class Invoice extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'invoice_id', allowNull: false }),
    __metadata("design:type", Object)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "purpose", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "grandTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "depositAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "paidAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "dueAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "additionalDeposit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.JSONB)),
    __metadata("design:type", Array)
], Invoice.prototype, "parts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.JSONB)),
    __metadata("design:type", Array)
], Invoice.prototype, "labours", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "partsTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "laboursTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Invoice.prototype, "refundable", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "updateStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "tax", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "taxPart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Invoice.prototype, "jobDurationValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "jobDurationUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Invoice.prototype, "discount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "discountType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "addressType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Invoice.prototype, "expiresIn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invoice.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Invoice.prototype, "edited", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_1.default),
    __metadata("design:type", Object)
], Invoice.prototype, "transactions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => DraftInvoice_1.default),
    __metadata("design:type", Object)
], Invoice.prototype, "draftInvoice", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Estimate_1.default, { onDelete: 'CASCADE' }),
    __metadata("design:type", Object)
], Invoice.prototype, "estimate", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Estimate_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Invoice.prototype, "estimateId", void 0);
Invoice = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'invoices', timestamps: true, paranoid: true })
], Invoice);
exports.default = Invoice;
