"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvoiceDAOService {
    invoiceRepository;
    constructor(invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    create(values, options) {
        return this.invoiceRepository.save(values, options);
    }
    deleteById(id, options) {
        return this.invoiceRepository.deleteById(id, options);
    }
    findAll(options) {
        return this.invoiceRepository.findAll(options);
    }
    findByAny(options) {
        return this.invoiceRepository.findOne(options);
    }
    findById(id, options) {
        return this.invoiceRepository.findById(id, options);
    }
    update(appointment, values, options) {
        return this.invoiceRepository.updateOne(appointment, values, options);
    }
}
exports.default = InvoiceDAOService;
