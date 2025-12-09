import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendEmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail( { from, to, subject, html }: SendEmailOptions ) {
    try {
        await resend.emails.send({
            from,
            to,
            subject,
            html,
        });
        console.log("Email sent to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
    }