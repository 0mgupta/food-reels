
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    try {
        console.log("Request Body:", req.body);

        // Accept both correct and incorrect field names
        const fullName = req.body.fullName || req.body.fullname;
        const email = req.body.email;
        const password = req.body.password || req.body.passward;

        console.log("Extracted Data:", {
            fullName,
            email,
            password
        });

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "fullName, email and password are required",
                receivedData: req.body
            });
        }

        const isUserAlreadyExists = await userModel.findOne({
            email
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set true in production with HTTPS
            sameSite: "lax"
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function loginUser(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password || req.body.passward;

        console.log("Request Body:", req.body);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("User Found:", user);
        console.log("Password Received:", password);
        console.log("Password In DB:", user.password);

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}
  
async function registerFoodPartner(req, res) {
    try {
        console.log("Request Body:", req.body);

        const {
            name,
            email,
            password,
            phone,
            address,
            contactName
        } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
                receivedBody: req.body
            });
        }

        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email
        });

        if (isAccountAlreadyExists) {
            return res.status(400).json({
                message: "Food partner account already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        });

        const token = jwt.sign(
            {
                id: foodPartner._id
            },
            process.env.JWT_SECRET
        );

        res.cookie("token", token);

        return res.status(201).json({
            message: "Food partner registered successfully",
            foodPartner: {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                address: foodPartner.address,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone
            }
        });

    } catch (error) {
        console.error("Register Food Partner Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
}




async function loginFoodPartner(req, res) {

    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}

module.exports = {
    registerUser,
     loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}