import { INITIAL_LABOURS_VALUE, INITIAL_PARTS_VALUE } from '../config/constants';
import BillingInformation from '../models/BillingInformation';
import Contact from '../models/Contact';
import Customer from '../models/Customer';
import Estimate from '../models/Estimate';
import Partner from '../models/Partner';
import RideShareDriver from '../models/RideShareDriver';
import Vehicle from '../models/Vehicle';
import dataSources from '../services/dao';
import { estimatePdfTemplate } from './estimatePdf';
// import pdf from 'pdf-node'
import path from 'path'
import fs from 'fs'
import Invoice from '../models/Invoice';
import { invoicePdfTemplate } from './invoicePdf';
import DraftInvoice from '../models/DraftInvoice';
import Transaction from '../models/Transaction';

const pdf = require("pdf-creator-node");
const HTML5ToPDF = require("html5-to-pdf")

export const generateEstimateHtml = async (id: any)=>{

    const estimate: Estimate | null = await dataSources.estimateDAOService.findById(id, {
        include: [
          Vehicle,
          { model: Customer, include: [BillingInformation, Contact], paranoid: false },
          RideShareDriver,
          { model: Partner, include: [Contact] },
        ]
    });

    if(!estimate) return null;

    const parts = estimate.parts;
    const labours = estimate.labours;

    estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
    estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

    return estimatePdfTemplate(estimate)

}

export const generateInvoiceHtml = async (id: any, partnerId: any)=>{

    const invoice: Invoice | null = await dataSources.invoiceDAOService.findById(id, {
        include: [
          {
            model: Estimate,
            where: { partnerId: partnerId },
            include: [
              { model: Customer, include: [BillingInformation, Contact], paranoid: false },
              Vehicle,
              {
                model: Partner,
                include: [Contact],
              },
            ],
          },
          Transaction,
          DraftInvoice,
        ]
    });

    if(!invoice) return null;

    const parts = invoice.estimate.parts;
    const labours = invoice.estimate.labours;

    invoice.estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
    invoice.estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

    return invoicePdfTemplate(invoice)

}

export const generatePdf = async (html: string|null, rName?: string)=>{
    rName = rName || (Math.ceil( ((Math.random() * 999) + 1100) ))+'.pdf';
    await fs.mkdir(path.join(__dirname, "../../uploads/", "pdf"), { recursive: true }, (e)=>{console.log(e)});

    await fs.writeFileSync(path.join(__dirname, "../../uploads/", "pdf", '000.html'), `${html}`);

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
        outputPath: path.join(__dirname, "../../uploads/", "pdf", rName),
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
      })
     
      await html5ToPDF.start()
      await html5ToPDF.build()
      await html5ToPDF.close()

      return rName;

    // console.log(pdfGenerated)
}