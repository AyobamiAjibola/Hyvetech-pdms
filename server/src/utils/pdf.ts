import { INITIAL_LABOURS_VALUE, INITIAL_PARTS_VALUE, INVOICE_STATUS } from '../config/constants';
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
import path from 'path';
// import fs from 'fs';
import Invoice from '../models/Invoice';
import { invoicePdfTemplate } from './invoicePdf';
import DraftInvoice from '../models/DraftInvoice';
import Transaction from '../models/Transaction';
import { receiptPdfTemplate } from './receiptPdf';

const fs = require('fs/promises');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-creator-node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HTML5ToPDF = require('html5-to-pdf');

export const generateEstimateHtml = async (id: any) => {
  const estimate: Estimate | null = await dataSources.estimateDAOService.findById(id, {
    include: [
      Vehicle,
      { model: Customer, include: [BillingInformation, Contact], paranoid: false },
      RideShareDriver,
      { model: Partner, include: [Contact] },
    ],
  });

  if (!estimate) return null;

  const parts = estimate.parts;
  const labours = estimate.labours;

  estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
  estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

  const partnerAccount = await dataSources.partnerAccountDaoService.findByAny({
    where: {
      partnerId: estimate.partnerId,
    },
  });

  return estimatePdfTemplate(estimate, partnerAccount);
};

export const generateInvoiceHtml = async (id: any, partnerId: any) => {
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
    ],
  });

  if (!invoice) return null;

  const partner = await dataSources.partnerDAOService.findById(partnerId);

  if (!partner) return null;

  const partnerAccount = await dataSources.partnerAccountDaoService.findByAny({
    where: {
      partnerId: partner.id,
    },
  });

  const preference = await partner.$get('preference');

  const parts = invoice.estimate.parts;
  const labours = invoice.estimate.labours;

  // console.log((invoice.getDataValue("code")))

  // const parts = invoice.parts;
  // const labours = invoice.labours;

  invoice.estimate.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
  invoice.estimate.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];

  try {
    const parts = invoice?.draftInvoice?.parts || [];
    const labours = invoice?.draftInvoice?.labours || [];

    invoice.draftInvoice.parts = parts.length ? parts.map(part => JSON.parse(part)) : [INITIAL_PARTS_VALUE];
    invoice.draftInvoice.labours = labours.length ? labours.map(labour => JSON.parse(labour)) : [INITIAL_LABOURS_VALUE];
  } catch (e) {
    console.log(e);
  }

  // console.log((invoice.draftInvoice.parts), invoice.draftInvoice.labours)

  // exit(0);

  return invoicePdfTemplate(invoice, preference?.termsAndCondition || '', partnerAccount);
};

export const generateReceiptHtml = async (id: any, partnerId: any, rName: any) => {
  const receipt: any | null = await dataSources.transactionDAOService.findById(id, {
    include: [
      {
        model: Customer,
        include: [Contact],
      },
      {
        model: Invoice,
        include: [
          {
            model: Estimate,
            where: { partnerId: partnerId },
            include: [
              { model: Customer, include: [BillingInformation], paranoid: false },
              Vehicle,
              {
                model: Partner,
                include: [Contact],
              },
            ],
          },
          Transaction,
          DraftInvoice,
        ],
      },
    ],
  });

  if (!receipt) return null;

  return receiptPdfTemplate(receipt, rName);
};

export const generatePdf = async (html: string | null, rName?: string) => {
  rName = rName || Math.ceil(Math.random() * 999 + 1100) + '.pdf';
  await fs.mkdir(path.join(__dirname, '../../uploads/', 'pdf'), { recursive: true }, (e: any) => {
    console.log(e);
  });

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
    outputPath: path.join(__dirname, '../../uploads/', 'pdf', rName),
    browser: 'chromium',
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
    },
  });

  await html5ToPDF.start();
  await html5ToPDF.build();
  await html5ToPDF.close();

  return rName;

  // console.log(pdfGenerated)
};

// export const generatePdf = async (html: string | null, rName?: string) => {
//   rName = rName || `${Math.ceil(Math.random() * 999 + 1100)}.pdf`;
//   const outputDir = path.join(__dirname, '../../uploads/pdf');
//   const outputFile = path.join(outputDir, rName);

//   try {
//     await fs.mkdir(outputDir, { recursive: true });
//     const browser = await puppeteer.launch({ 
//       // args: ['--no-sandbox'],
//       headless: 'new'
//     });
//     const page = await browser.newPage();

//     await page.setContent(html);
//     await page.pdf({ path: outputFile, format: 'A4', printBackground: true });

//     await browser.close();
//     return rName;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };




