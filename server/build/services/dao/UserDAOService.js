"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PasswordEncoder_1 = __importDefault(require("../../utils/PasswordEncoder"));
class UserDAOService {
    userRepository;
    passwordEncoder;
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new PasswordEncoder_1.default();
    }
    update(user, values, options) {
        return this.userRepository.updateOne(user, values, options);
    }
    findById(id, options) {
        return this.userRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.userRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.userRepository.findOne(options);
    }
    findByUsername(username, options) {
        return this.userRepository.findOne({ where: { username }, ...options });
    }
    findAll(options) {
        return this.userRepository.findAll(options);
    }
    async create(values, options) {
        if (values.password) {
            values.password = await this.passwordEncoder.encode(values.password);
        }
        return this.userRepository.save(values, options);
    }
}
exports.default = UserDAOService;
