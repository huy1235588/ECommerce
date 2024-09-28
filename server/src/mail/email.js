const { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplates");
const { mailtrapClient, mailtrapSender } = require("./mailtrapConfig");

const sendEmailVerification = async (userName, email, verificationToken) => {
    const recipient = [{ email }];

    const htmlTemplate = VERIFICATION_EMAIL_TEMPLATE
        .replace("{verificationCode}", verificationToken)
        .replace("{userName}", userName);

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipient,
            subject: "Verify your email",
            html: htmlTemplate,
            category: "Email Verification",
        });

        console.log("Email sent successfully", response);
        return response.message_ids[0];

    } catch (error) {
        console.log(`Error sending verification email: ${error}`);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

const sendEmailWelcome = async (userName, email) => {
    const recipient = [{ email }];

    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace("{userName}", userName);

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipient,
            subject: "Welcome to Ha",
            html: htmlTemplate,
            category: "Email Welcome",
        });

        console.log("Welcome email sent successfully", response);

    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
};

const sendEmailResetPassword = async (userName, email, resetPasswordURL) => {
    const recipient = [{ email }];

    const htmlTemplate = PASSWORD_RESET_REQUEST_TEMPLATE
        .replace("{userName}", userName)
        .replace("{resetPasswordURL}", resetPasswordURL)

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipient,
            subject: "Password reset request",
            html: htmlTemplate,
            category: "Reset password",
        });

        console.log("Reset password email sent successfully", response);

    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

const sendEmailResetSuccess = async (userName, email) => {
    const recipient = [{ email }];

    const htmlTemplate = PASSWORD_RESET_SUCCESS_TEMPLATE
        .replace("{userName}", userName)

    try {
        const response = await mailtrapClient.send({
            from: mailtrapSender,
            to: recipient,
            subject: "Password reset successfully",
            html: htmlTemplate,
            category: "Reset password",
        });

        console.log("Reset password email sent successfully", response);

    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

module.exports = {
    sendEmailVerification,
    sendEmailWelcome,
    sendEmailResetPassword,
    sendEmailResetSuccess,
};