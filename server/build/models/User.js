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
exports.$loginSchema = exports.$userSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const joi_1 = __importDefault(require("joi"));
const Role_1 = __importDefault(require("./Role"));
const UserRole_1 = __importDefault(require("./UserRole"));
const Contact_1 = __importDefault(require("./Contact"));
const constants_1 = require("../config/constants");
const Partner_1 = __importDefault(require("./Partner"));
exports.$userSchema = {
    companyName: joi_1.default.string().required().label('Company Name'),
    firstName: joi_1.default.string().required().label('First Name'),
    lastName: joi_1.default.string().required().label('Last Name'),
    email: joi_1.default.string().email().required().label('Email'),
    role: joi_1.default.string().required().label('User Role'),
    phone: joi_1.default.string().max(11).allow('').label('Phone Number'),
};
exports.$loginSchema = {
    username: joi_1.default.string().required().label('Username'),
    password: joi_1.default.string().pattern(new RegExp(constants_1.PASSWORD_PATTERN)).required().label('Password'),
};
let User = class User extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'user_id' }),
    __metadata("design:type", Object)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], User.prototype, "uniqueId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], User.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], User.prototype, "designation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "rawPassword", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], User.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], User.prototype, "profileImageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Object)
], User.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3000)),
    __metadata("design:type", Object)
], User.prototype, "loginToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Object)
], User.prototype, "loginDate", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Contact_1.default, { onDelete: 'SET NULL' }),
    __metadata("design:type", Object)
], User.prototype, "contacts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Role_1.default, () => UserRole_1.default),
    __metadata("design:type", Object)
], User.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Partner_1.default),
    __metadata("design:type", Object)
], User.prototype, "partner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Partner_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], User.prototype, "partnerId", void 0);
User = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'users',
    })
], User);
exports.default = User;
