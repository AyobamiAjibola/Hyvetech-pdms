import email_header from './email_header';
import email_footer from './email_footer';

export default function email_layout(content: any) {
  return `
  ${email_header()}
    <center class="wrapper" style="width:100%;table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#fafafa;">
    ${content}
    </center>
  ${email_footer()}
  `;
}
