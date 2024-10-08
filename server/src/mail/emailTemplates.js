const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="background-color: #242424;color: #fff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #fff">
                    Hello,
                    <span style="color: #4CAF50">{userName}</span>
            </h2>
            <p style="color: #fff">Thank you for signing up! Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;"><span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span></div>
            <p style="color: #fff">Enter this code on the verification page to complete your registration.</p>
            <p style="color: #fff">This code will expire in 15 minutes for security reasons.</p>
            <p style="color: #fff">If you didn't create an account with us, please ignore this email.</p>
            <p style="color: #fff; border-left: #4CAF50 5px solid; padding: 8px">Best regards,<br>The Ha Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body>
    <div
        style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
            <a href="">
                <img style="width: 100px;" src="src/public/logo1.png" alt="">
            </a>
            <h1 style="color: white; margin: 0;">Welcome to Ha</h1>
        </div>
        <div
            style="background-color: #242424;color: #fff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #fff">
                Hello,
                <span style="color: #4CAF50">{userName}</span>
            </h2>
            <p style="color: #fff">Thank you for signing up!</p>
            <p style="color: #fff; border-left: #4CAF50 5px solid; padding: 8px">Best regards,<br>The Ha Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
</head>

<body>
    <div
        style="font-family: Arial, sans-serif; line-height: 1.6; color: #FFF; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
        </div>
        <div
            style="background-color: #242424; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2>Hello,<span style="color: #4CAF50"> {userName}</span></h2>
            <p>We're writing to confirm that your password has been successfully reset.</p>
            <div style="text-align: center; margin: 30px 0;">
                <div
                    style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
                    ✓
                </div>
            </div>
            <p>If you did not initiate this password reset, please contact our support team immediately.</p>
            <p>For security reasons, we recommend that you:</p>
            <ul>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
                <li>Avoid using the same password across multiple sites</li>
            </ul>
            <p>Thank you for helping us keep your account secure.</p>
            <p style="border-left: #4CAF50 5px solid; padding: 8px">Best regards,<br>The Ha Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>

<body>
    <div
        style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div
            style="background-color: #242424; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2>Hello,<span style="color: #4CAF50">{userName}</span></h2>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.
            </p>
            <p>To reset your password, enter this code on the verification page:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">
                    {resetPasswordToken}
                </span>
            </div>
            <p>
                If you didn’t make this request,
                <a href="{resetPasswordURL}" style="color:rgb(98, 136, 202); font-weight: bold;">
                    please change your password
                </a>
            </p>
            <p>This code will expire in 15 minutes for security reasons.</p>
            <p style="border-left: #4CAF50 5px solid; padding: 8px">Best regards,<br>The Ha Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>

</html>
`;

module.exports = {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
};