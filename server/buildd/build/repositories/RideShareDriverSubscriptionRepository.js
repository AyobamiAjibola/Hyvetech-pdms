"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
const RideShareDriverSubscription_1 = __importDefault(require("../models/RideShareDriverSubscription"));
class RideShareDriverSubscriptionRepository extends CrudRepository_1.default {
    constructor() {
        super(RideShareDriverSubscription_1.default);
    }
}
exports.default = RideShareDriverSubscriptionRepository;
