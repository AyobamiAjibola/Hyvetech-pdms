"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = exports.generateInvoiceHtml = exports.generateEstimateHtml = void 0;
const constants_1 = require("../config/constants");
const BillingInformation_1 = __importDefault(require("../models/BillingInformation"));
const Contact_1 = __importDefault(require("../models/Contact"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Estimate_1 = __importDefault(require("../models/Estimate"));
const Partner_1 = __importDefault(require("../models/Partner"));
const RideShareDriver_1 = __importDefault(require("../models/RideShareDriver"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const dao_1 = __importDefault(require("../services/dao"));
const estimatePdf_1 = require("./estimatePdf");
// import pdf from 'pdf-node'
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const invoicePdf_1 = require("./invoicePdf");
const DraftInvoice_1 = __importDefault(require("../models/DraftInvoice"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const pdf = require("pdf-creator-node");
const HTML5ToPDF = require("html5-to-pdf");
const generateEstimateHtml = async (id) => {
    const estimate = await dao_1.default.estimateDAOService.findById(id, {
        include: [
            Vehicle_1.default,
            { model: Customer_1.default, include: [BillingInformation_1.default, Contact_1.default], paranoid: false },
            RideShareDriver_1.default,
            { model: Partner_1.default, include: [Contact_1.default] },
        ]
    });
    if (!estimate)
        return null;
    const parts = estimate.parts;
    const labours = estimate.labours;
    estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [constants_1.INITIAL_PARTS_VALUE];
    estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [constants_1.INITIAL_LABOURS_VALUE];
    return (0, estimatePdf_1.estimatePdfTemplate)(estimate);
};
exports.generateEstimateHtml = generateEstimateHtml;
const generateInvoiceHtml = async (id, partnerId) => {
    const invoice = await dao_1.default.invoiceDAOService.findById(id, {
        include: [
            {
                model: Estimate_1.default,
                where: { partnerId: partnerId },
                include: [
                    { model: Customer_1.default, include: [BillingInformation_1.default, Contact_1.default], paranoid: false },
                    Vehicle_1.default,
                    {
                        model: Partner_1.default,
                        include: [Contact_1.default],
                    },
                ],
            },
            Transaction_1.default,
            DraftInvoice_1.default,
        ]
    });
    if (!invoice)
        return null;
    const parts = invoice.estimate.parts;
    const labours = invoice.estimate.labours;
    invoice.estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [constants_1.INITIAL_PARTS_VALUE];
    invoice.estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [constants_1.INITIAL_LABOURS_VALUE];
    return (0, invoicePdf_1.invoicePdfTemplate)(invoice);
};
exports.generateInvoiceHtml = generateInvoiceHtml;
const generatePdf = async (html, rName) => {
    rName = rName || (Math.ceil(((Math.random() * 999) + 1100))) + '.pdf';
    await fs_1.default.mkdir(path_1.default.join(__dirname, "../../uploads/", "pdf"), { recursive: true }, (e) => { console.log(e); });
    // await fs.writeFileSync(path.join(__dirname, "../../uploads/", "pdf", '000.html'), `${html}`);
    // const options = {
    //     format: "Tabloid",
    //     orientation: "portrait",
    //     // border: "10mm",
    // };
    // const document = {
    //     html,
    //     data: {
    //     //   users: users,
    //     },
    //     path: path.join(__dirname, "../../uploads/", "pdf", '000'+rName),
    //     type: "pdf",
    // };
    // const pdfGenerated = await pdf.create(document);
    const html5ToPDF = new HTML5ToPDF({
        inputBody: html,
        outputPath: path_1.default.join(__dirname, "../../uploads/", "pdf", rName),
        // templatePath: path.join(__dirname, "templates", "basic"),
        include: [
        //   path.join(__dirname, "../assets/pdf/pdf"),
        //   path.join(__dirname, "assets", "custom-margin.css"),
        ],
        renderDelay: 4000,
        launchOptions: {
            args: ['--no-sandbox'],
            headless: true,
        },
        options: {
            printBackground: true,
        }
    });
    await html5ToPDF.start();
    await html5ToPDF.build();
    await html5ToPDF.close();
    return rName;
    // console.log(pdfGenerated)
};
exports.generatePdf = generatePdf;
