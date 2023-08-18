export default function ResetPasswordTokenEmail({
  firstName,
  code,
}: {
  firstName: string;
  code: string;
}) {
  return `
    
            Hello ${firstName},

Somebody requested a new password on your account.

No changes have been made to your account yet.

You can use this code below to reset your password

<b>${code}</b>

If you did not request a new password, please let us know immediately by replying to this email.

Yours,

    `;
}
