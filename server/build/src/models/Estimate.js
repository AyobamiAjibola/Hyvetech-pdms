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
exports.$updateEstimateSchema = exports.$saveEstimateSchema = exports.$createEstimateSchema = exports.estimateFields = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const joi_1 = __importDefault(require("joi"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
const Vehicle_1 = __importDefault(require("./Vehicle"));
const Customer_1 = __importDefault(require("./Customer"));
const Partner_1 = __importDefault(require("./Partner"));
const Invoice_1 = __importDefault(require("./Invoice"));
exports.estimateFields = {
    firstName: {
        name: 'firstName',
        label: 'First Name',
        error: {
            invalid: 'First Name is invalid',
            required: 'First Name is required',
        },
    },
    lastName: {
        name: 'lastName',
        label: 'Last Name',
        error: {
            invalid: 'Last Name is invalid',
            required: 'Last Name is required',
        },
    },
    email: {
        name: 'email',
        label: 'Email',
        error: {
            invalid: 'Email is invalid',
            required: 'Email is required',
        },
    },
    state: {
        name: 'state',
        label: 'State',
        error: {
            invalid: 'State is invalid',
            required: 'State is required',
        },
    },
    phone: {
        name: 'phone',
        label: 'Phone Number',
        error: {
            invalid: 'Phone Number is invalid',
            required: 'Phone Number is required',
        },
    },
    parts: {
        name: 'parts',
        label: 'Parts',
        error: {
            invalid: 'Part is invalid',
            required: 'Part is required',
        },
    },
    labours: {
        name: 'labours',
        label: 'Labour',
        error: {
            invalid: 'Labour is invalid',
            required: 'Labour is required',
        },
    },
    tax: {
        name: 'tax',
        label: 'Tax',
        error: {
            invalid: 'Tax is invalid',
            required: 'Tax is required',
        },
    },
    taxPart: {
        name: 'tax',
        label: 'Tax',
        error: {
            invalid: 'Tax is invalid',
            required: 'Tax is required',
        },
    },
    discount: {
        name: 'discount',
        label: 'Discount (%)',
        error: {
            invalid: 'Discount is invalid',
            required: 'Discount is required',
        },
    },
    address: {
        name: 'address',
        label: 'Address',
        error: {
            invalid: 'Address is invalid',
            required: 'Address is required',
        },
    },
    addressType: {
        name: 'addressType',
        label: 'Type',
        error: {
            invalid: 'Address Type is invalid',
            required: 'Address Type is required',
        },
    },
    vin: {
        name: 'vin',
        label: 'VIN',
        error: {
            invalid: 'VIN is invalid',
            required: 'VIN is required',
        },
    },
    make: {
        name: 'make',
        label: 'Make',
        error: {
            invalid: 'Make is invalid',
            required: 'Make is required',
        },
    },
    model: {
        name: 'model',
        label: 'Model',
        error: {
            invalid: 'Model is invalid',
            required: 'Model is required',
        },
    },
    modelYear: {
        name: 'modelYear',
        label: 'Model Year',
        error: {
            invalid: 'Model Year is invalid',
            required: 'Model Year is required',
        },
    },
    mileageValue: {
        name: 'mileage',
        label: 'Mileage Value',
        error: {
            invalid: 'Mileage Value is invalid',
            required: 'Mileage Value is required',
        },
    },
    mileageUnit: {
        name: 'mileage',
        label: 'Mileage Unit',
        error: {
            invalid: 'Mileage Unit is invalid',
            required: 'Mileage Unit is required',
        },
    },
    partsTotal: {
        name: 'mileage',
        label: 'Parts Total',
        error: {
            invalid: 'Parts Total is invalid',
            required: 'Parts Total is required',
        },
    },
    laboursTotal: {
        name: 'mileage',
        label: 'Labours Total',
        error: {
            invalid: 'Labours Total is invalid',
            required: 'Labours Total is required',
        },
    },
    grandTotal: {
        name: 'mileage',
        label: 'Grand Total',
        error: {
            invalid: 'Grand Total is invalid',
            required: 'Grand Total is required',
        },
    },
    plateNumber: {
        name: 'plateNumber',
        label: 'Plate Number',
        error: {
            invalid: 'Plate Number is invalid',
            required: 'Plate Number is required',
        },
    },
    depositAmount: {
        name: 'depositAmount',
        label: 'Deposit Amount',
        error: {
            invalid: 'Deposit Amount is invalid',
            required: 'Deposit Amount is required',
        },
    },
    paidAmount: {
        name: 'paidAmount',
        label: 'Paid Amount',
        error: {
            invalid: 'Paid Amount is invalid',
            required: 'Paid Amount is required',
        },
    },
    additionalDeposit: {
        name: 'additionalDeposit',
        label: 'Additional Amount',
        error: {
            invalid: 'Additional Amount is invalid',
            required: 'Additional Amount is required',
        },
    },
    jobDuration: {
        name: 'jobDuration',
        label: 'Job Duration',
        error: {
            invalid: 'Job Duration is invalid',
            required: 'Job Duration is required',
        },
    },
    jobDurationValue: {
        name: 'mileage',
        label: 'Job Duration Value',
        error: {
            invalid: 'Job Duration Value is invalid',
            required: 'Job Duration Value is required',
        },
    },
    jobDurationUnit: {
        name: 'mileage',
        label: 'Job Duration Unit',
        error: {
            invalid: 'Job Duration Unit is invalid',
            required: 'Job Duration Unit is required',
        },
    },
};
exports.$createEstimateSchema = {
    id: joi_1.default.number().required().label('Partner Id'),
    firstName: joi_1.default.string().required().label(exports.estimateFields.firstName.label),
    lastName: joi_1.default.string().required().label(exports.estimateFields.lastName.label),
    email: joi_1.default.string().optional().label(exports.estimateFields.email.label),
    // @ts-ignore
    state: joi_1.default.string().optional().label(exports.estimateFields.state.label),
    phone: joi_1.default.string().required().label(exports.estimateFields.phone.label),
    addressType: joi_1.default.string().required().label(exports.estimateFields.addressType.label),
    address: joi_1.default.string().required().label(exports.estimateFields.address.label),
    vin: joi_1.default.string().required().label(exports.estimateFields.vin.label),
    model: joi_1.default.string().required().label(exports.estimateFields.model.label),
    modelYear: joi_1.default.any().required().label(exports.estimateFields.modelYear.label),
    make: joi_1.default.string().required().label(exports.estimateFields.make.label),
    plateNumber: joi_1.default.string().required().label(exports.estimateFields.plateNumber.label),
    mileageValue: joi_1.default.string().required().label(exports.estimateFields.mileageValue.label),
    mileageUnit: joi_1.default.string().required().label(exports.estimateFields.mileageUnit.label),
    parts: joi_1.default.array().required().label(exports.estimateFields.parts.label),
    partsTotal: joi_1.default.number().required().label(exports.estimateFields.partsTotal.label),
    labours: joi_1.default.array().required().label(exports.estimateFields.labours.label),
    tax: joi_1.default.string().optional().label(exports.estimateFields.tax.label),
    taxPart: joi_1.default.string().optional().label(exports.estimateFields.taxPart.label),
    laboursTotal: joi_1.default.number().required().label(exports.estimateFields.laboursTotal.label),
    grandTotal: joi_1.default.number().required().label(exports.estimateFields.firstName.label),
    depositAmount: joi_1.default.any().required().label(exports.estimateFields.depositAmount.label),
    jobDurationValue: joi_1.default.any().required().label(exports.estimateFields.jobDurationValue.label),
    jobDurationUnit: joi_1.default.string().required().label(exports.estimateFields.jobDurationUnit.label),
};
exports.$saveEstimateSchema = {
    id: joi_1.default.number().required().label('Partner Id'),
    firstName: joi_1.default.string().allow('').label(exports.estimateFields.firstName.label),
    lastName: joi_1.default.string().allow('').label(exports.estimateFields.lastName.label),
    email: joi_1.default.string().optional().label(exports.estimateFields.email.label),
    // @ts-ignore
    state: joi_1.default.string().optional().label(exports.estimateFields.state.label),
    phone: joi_1.default.string().allow('').label(exports.estimateFields.phone.label),
    addressType: joi_1.default.string().allow('').label(exports.estimateFields.addressType.label),
    address: joi_1.default.string().allow('').label(exports.estimateFields.address.label),
    vin: joi_1.default.string().allow('').label(exports.estimateFields.vin.label),
    model: joi_1.default.string().allow('').label(exports.estimateFields.model.label),
    modelYear: joi_1.default.any().allow().label(exports.estimateFields.modelYear.label),
    make: joi_1.default.string().allow('').label(exports.estimateFields.make.label),
    plateNumber: joi_1.default.string().allow('').label(exports.estimateFields.plateNumber.label),
    mileageValue: joi_1.default.string().allow('').label(exports.estimateFields.mileageValue.label),
    mileageUnit: joi_1.default.string().allow('').label(exports.estimateFields.mileageUnit.label),
    parts: joi_1.default.array().allow().label(exports.estimateFields.parts.label),
    partsTotal: joi_1.default.number().allow().label(exports.estimateFields.partsTotal.label),
    labours: joi_1.default.array().allow().label(exports.estimateFields.labours.label),
    tax: joi_1.default.string().allow('').label(exports.estimateFields.tax.label),
    taxPart: joi_1.default.string().optional().label(exports.estimateFields.taxPart.label),
    laboursTotal: joi_1.default.number().allow().label(exports.estimateFields.laboursTotal.label),
    grandTotal: joi_1.default.number().allow().label(exports.estimateFields.firstName.label),
    depositAmount: joi_1.default.any().allow('').label(exports.estimateFields.depositAmount.label),
    jobDurationValue: joi_1.default.any().allow('').label(exports.estimateFields.jobDurationValue.label),
    jobDurationUnit: joi_1.default.string().allow('').label(exports.estimateFields.jobDurationUnit.label),
};
exports.$updateEstimateSchema = {
    ...exports.$saveEstimateSchema,
    id: joi_1.default.number().required().label('Estimate Id'),
};
let Estimate = class Estimate extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'estimate_id', allowNull: false }),
    __metadata("design:type", Object)
], Estimate.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.JSONB)),
    __metadata("design:type", Array)
], Estimate.prototype, "parts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.JSONB)),
    __metadata("design:type", Array)
], Estimate.prototype, "labours", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Estimate.prototype, "partsTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Estimate.prototype, "laboursTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Estimate.prototype, "grandTotal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DOUBLE),
    __metadata("design:type", Number)
], Estimate.prototype, "depositAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "tax", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "taxPart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Estimate.prototype, "jobDurationValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "jobDurationUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "addressType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Estimate.prototype, "expiresIn", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Estimate.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Invoice_1.default),
    __metadata("design:type", Object)
], Estimate.prototype, "invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Customer_1.default, { onDelete: 'CASCADE' }),
    __metadata("design:type", Object)
], Estimate.prototype, "customer", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Customer_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Estimate.prototype, "customerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RideShareDriver_1.default, { onDelete: 'CASCADE' }),
    __metadata("design:type", Object)
], Estimate.prototype, "rideShareDriver", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RideShareDriver_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Estimate.prototype, "rideShareDriverId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Vehicle_1.default),
    __metadata("design:type", Object)
], Estimate.prototype, "vehicle", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Vehicle_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Estimate.prototype, "vehicleId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.default, { onDelete: 'CASCADE' }),
    __metadata("design:type", Object)
], Estimate.prototype, "partner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Estimate.prototype, "partnerId", void 0);
Estimate = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'estimates',
        paranoid: true,
    })
], Estimate);
exports.default = Estimate;
