"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const axiosClient_1 = __importDefault(require("../api/axiosClient"));
const Generic_1 = __importDefault(require("../../utils/Generic"));
const constants_1 = require("../../config/constants");
class VINDecoderProviderDAOService {
    vinDecoderProviderRepository;
    vinRepository;
    constructor(vinDecoderProviderRepository, vinRepository) {
        this.vinDecoderProviderRepository = vinDecoderProviderRepository;
        this.vinRepository = vinRepository;
    }
    create(values, options) {
        return this.vinDecoderProviderRepository.save(values, options);
    }
    update(vinDecoderProvider, values, options) {
        return this.vinDecoderProviderRepository.updateOne(vinDecoderProvider, values, options);
    }
    findById(id, options) {
        return this.vinDecoderProviderRepository.findById(id, options);
    }
    deleteById(id, options) {
        return this.vinDecoderProviderRepository.deleteById(id, options);
    }
    findByAny(options) {
        return this.vinDecoderProviderRepository.findOne(options);
    }
    findAll(options) {
        return this.vinDecoderProviderRepository.findAll(options);
    }
    async decodeVIN(vin, provider) {
        let apiSecret, apiKey, apiPrefix, url, response, result = [];
        //Search and return VIN of it exist in local database
        const findVIN = await this.vinRepository.findOne({ where: { vin } });
        if (findVIN) {
            const vinToJSON = findVIN.toJSON();
            Object.keys(vinToJSON).forEach(key => {
                result.push({
                    label: Generic_1.default.convertTextToCamelcase(key),
                    //@ts-ignore
                    value: vinToJSON[key],
                });
            });
            result = result.filter((detail) => constants_1.VIN_FILTER_CONSTRAINTS.includes(detail.label));
            return result;
        }
        if (provider.default) {
            apiSecret = provider.apiSecret;
            apiKey = provider.apiKey;
            apiPrefix = provider.apiPrefix;
            url = `${apiPrefix}/?id=${apiSecret}&key=${apiKey}&vin=${vin}`;
            response = await axiosClient_1.default.get(url);
            if (response.data === 'Error')
                return this.getOtherProvider(vin);
            const results = response.data.Results;
            Object.keys(results[0]).forEach(key => {
                result.push({
                    label: Generic_1.default.convertTextToCamelcase(key),
                    //@ts-ignore
                    value: results[0][key],
                });
            });
            result = result.filter((detail) => constants_1.VIN_FILTER_CONSTRAINTS.includes(detail.label));
            let temp = [...result];
            temp = temp.filter(value => value.label !== 'vin');
            const emptyResult = temp.every(item => !item.value.length);
            if (emptyResult)
                return this.getOtherProvider(vin);
        }
        else {
            const apiSecret = provider.apiSecret;
            const apiKey = provider.apiKey;
            const apiPrefix = provider.apiPrefix;
            const id = 'decode';
            const hash = crypto_1.default.createHash('sha1').update(`${vin}|${id}|${apiKey}|${apiSecret}`).digest('hex');
            const controlSum = hash.substring(0, 10);
            url = `${apiPrefix}/${apiKey}/${controlSum}/decode/${vin}.json`;
            response = await axiosClient_1.default.get(url);
            result = response.data.decode
                .map((detail) => {
                return {
                    label: Generic_1.default.convertTextToCamelcase(detail.label),
                    value: detail.value,
                };
            })
                .filter((detail) => {
                return constants_1.VIN_FILTER_CONSTRAINTS.includes(detail.label);
            });
        }
        const data = {};
        result.forEach(detail => {
            //@ts-ignore
            data[detail.label] = detail.value;
        });
        //Create new VIN in local database
        await this.vinRepository.save(data);
        return result;
    }
    async getOtherProvider(vin) {
        const otherProvider = await this.vinDecoderProviderRepository.findOne({
            where: { default: false },
        });
        if (!otherProvider)
            throw new Error('Provider does not exist');
        return this.decodeVIN(vin, otherProvider);
    }
}
exports.default = VINDecoderProviderDAOService;
