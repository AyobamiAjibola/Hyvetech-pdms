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
const Invoice_1 = __importDefault(require("./Invoice"));
let DraftInvoice = class DraftInvoice extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'draft_invoice_id', allowNull: false }),
    __metadata("design:type", Object)
], DraftInvoice.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "purpose", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "grandTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "depositAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "paidAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "dueAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "additionalDeposit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DraftInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.JSONB)),
    __metadata("design:type", Array)
], DraftInvoice.prototype, "parts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.JSONB)),
    __metadata("design:type", Array)
], DraftInvoice.prototype, "labours", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "partsTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "laboursTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "refundable", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "updateStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "tax", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "taxPart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "jobDurationValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "jobDurationUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "addressType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "expiresIn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], DraftInvoice.prototype, "edited", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DraftInvoice.prototype, "discount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DraftInvoice.prototype, "discountType", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Invoice_1.default),
    __metadata("design:type", Object)
], DraftInvoice.prototype, "invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Invoice_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], DraftInvoice.prototype, "invoiceId", void 0);
DraftInvoice = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'draft_invoices', timestamps: true, paranoid: true })
], DraftInvoice);
exports.default = DraftInvoice;
