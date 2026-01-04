
interface SendEmailProps {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    sender?: { email: string; name: string };
    apiKey: string;
}

export const sendEmail = async ({
    to,
    subject,
    htmlContent,
    sender = { email: 'contact@perfectmodels.ga', name: 'Perfect Models Management' }, // Default sender
    apiKey
}: SendEmailProps): Promise<boolean> => {
    if (!apiKey || apiKey === 'VOTRE_CLÉ_API_BREVO_ICI') {
        console.warn('Brevo API Key is missing or default. Email not sent.');
        return false;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender,
                to,
                subject,
                htmlContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API Error:', errorData);
            throw new Error(`Email sending failed: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
