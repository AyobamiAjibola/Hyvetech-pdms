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
exports.$roleSchema = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Permission_1 = __importDefault(require("./Permission"));
const RolePermission_1 = __importDefault(require("./RolePermission"));
const joi_1 = __importDefault(require("joi"));
const Customer_1 = __importDefault(require("./Customer"));
const CustomerRole_1 = __importDefault(require("./CustomerRole"));
const UserRole_1 = __importDefault(require("./UserRole"));
const User_1 = __importDefault(require("./User"));
const RideShareDriverRole_1 = __importDefault(require("./RideShareDriverRole"));
const RideShareDriver_1 = __importDefault(require("./RideShareDriver"));
exports.$roleSchema = {
    name: joi_1.default.string().required().label('Role Name'),
};
let Role = class Role extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, field: 'role_id', allowNull: false }),
    __metadata("design:type", Object)
], Role.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Role.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Permission_1.default, () => RolePermission_1.default),
    __metadata("design:type", Object)
], Role.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Customer_1.default, () => CustomerRole_1.default),
    __metadata("design:type", Object)
], Role.prototype, "customers", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User_1.default, () => UserRole_1.default),
    __metadata("design:type", Object)
], Role.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => RideShareDriver_1.default, () => RideShareDriverRole_1.default),
    __metadata("design:type", Object)
], Role.prototype, "rideShareDrivers", void 0);
Role = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: 'roles',
    })
], Role);
exports.default = Role;
