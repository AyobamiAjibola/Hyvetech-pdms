"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class CrudRepository {
    sequelize;
    repository;
    constructor(modelClass) {
        this._model = modelClass.name;
        this.sequelize = database_1.default.sequelize;
        this.repository = this.sequelize.getRepository(modelClass);
    }
    get model() {
        return this._model;
    }
    bulkCreate(records, options) {
        return this.sequelize.transaction(async () => {
            return this.repository.bulkCreate(records, options);
        });
    }
    deleteAll(options) {
        return this.sequelize.transaction(async () => {
            await this.repository.sync(options);
        });
    }
    deleteById(id, options) {
        return this.sequelize.transaction(async () => {
            const model = await this.repository.findByPk(id);
            await model?.destroy(options);
        });
    }
    deleteOne(t, options) {
        return this.sequelize.transaction(async () => {
            await t.destroy(options);
        });
    }
    exist(t, options) {
        return this.sequelize.transaction(async () => {
            const models = await this.repository.findAll(options);
            return models.includes(t);
        });
    }
    findAll(options) {
        return this.sequelize.transaction(async () => {
            return this.repository.findAll(options);
        });
    }
    findById(id, options) {
        return this.sequelize.transaction(async () => {
            return this.repository.findByPk(id, options);
        });
    }
    findOne(options) {
        return this.sequelize.transaction(async () => {
            return this.repository.findOne({ ...options });
        });
    }
    save(values, options) {
        return this.sequelize.transaction(async () => {
            return this.repository.create(values, options);
        });
    }
    updateOne(t, values, options) {
        return this.sequelize.transaction(async () => {
            return t.update(values, options);
        });
    }
    deleteByAny(filter) {
        return this.sequelize.transaction(async () => {
            await this.repository.destroy(filter);
        });
    }
    updateByAny(update, options) {
        return this.sequelize.transaction(async () => {
            const model = await this.repository.findOne(options);
            await model?.update(update);
            return model;
        });
    }
}
exports.default = CrudRepository;
