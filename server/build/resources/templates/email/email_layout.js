"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_header_1 = __importDefault(require("./email_header"));
const email_footer_1 = __importDefault(require("./email_footer"));
function email_layout(content) {
    return `
  ${(0, email_header_1.default)()}
    <center class="wrapper" style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#fafafa;">
    ${content}
    </center>
  ${(0, email_footer_1.default)()}
  `;
}
exports.default = email_layout;
