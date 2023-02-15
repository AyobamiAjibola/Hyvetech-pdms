"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
const PaymentPlan_1 = __importDefault(require("../models/PaymentPlan"));
class PaymentPlanRepository extends CrudRepository_1.default {
    constructor() {
        super(PaymentPlan_1.default);
    }
}
exports.default = PaymentPlanRepository;
