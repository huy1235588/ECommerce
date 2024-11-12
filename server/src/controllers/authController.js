const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');
const { sendEmailVerification, sendEmailWelcome, sendEmailResetPassword, sendEmailResetSuccess } = require('../mail/email');
const generateRandomClientId = require('../utils/generateRandomClientId');

const checkUserName = async (req, res) => {
    const { userName } = req.body;
    try {
        const userNameAlreadyExists = await User.findOne({
            userName: userName,
        });

        if (userNameAlreadyExists) {
            return res.status(201).json({
                success: false,
                message: "UserName already exists",
            });
        }

        res.status(200).json({
            success: true,
            message: "",
        });


    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const signup = async (req, res) => {
    const { email, password, country, firstName, lastName, userName } = req.body;

    try {

        // Kiểm tra có giá trị hay không
        if (
            !email ||
            !country ||
            !firstName ||
            !lastName ||
            !userName ||
            !password
        ) {
            throw new Error("All field are required");
        }

        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(409).json({
                success: false,
                message: "This email is already in use by another account."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa mật khẩu
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            country,
            firstName,
            lastName,
            userName,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h   
        });
        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user.id);

        // Gửi email xác minh
        // await sendEmailVerification(user.userName, user.email, verificationToken);

        // Tạo ngẫu nhiên chuỗi clientId
        const clientId = generateRandomClientId();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            clientId,
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.log(error);
    }
};

const resendEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        // await sendEmailVerification(user.userName, user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "Resend email successfully",
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email: email,
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }, // $gt: greater than
        });

        if (!user) {
            console.log("Invalid or expired verification code");
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        // await sendEmailWelcome(user.userName, user.email);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            // user: {
            //     ...user._doc,
            //     password: undefined,
            // }
        });

    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            // ^$ $ Chính các từ đầu đến cuối
            // 'i' Không phân biệt chữ hoa
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        });
        // Kiểm tra có tồn tại email
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        // So sánh mật khẩu
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user.id);

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token", {
        domain: process.env.CLIENT_DOMAIN,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: true, message: "User not found" });
        }

        // Khởi tạo reset token
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // // Gửi email
        // await sendEmailResetPassword(
        //     user.userName,
        //     user.email,
        //     resetToken,
        //     `${process.env.SERVER_URL}`
        //     // `${process.env.SERVER_URL}/reset-password/${resetToken}`
        // );

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });

    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const forgotPasswordVerify = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({
            email: email,
            resetPasswordToken: code,
            resetPasswordExpiresAt: { $gt: Date.now() }, // $gt: greater than
        });

        if (!user) {
            console.log("Invalid or expired verification code");
            return res.status(404).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email,
        });

        // Cập nhật password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await user.save();

        // await sendEmailResetSuccess(user.userName, user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true, 
            user
        });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const ha = async (req, res) => {
    console.log(req.body);
    return res.status(200).json({ success: true, message: "Successfully" });
};

module.exports = {
    checkUserName,
    signup,
    login,
    logout,
    resendEmail,
    verifyEmail,
    forgotPassword,
    forgotPasswordVerify,
    resetPassword,
    checkAuth,
    ha,
};