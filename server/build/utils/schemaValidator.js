"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
function schemaValidator(schema) {
    return (model) => {
        return joi_1.default.object(schema).validate(model);
    };
}
exports.default = schemaValidator;
