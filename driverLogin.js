const bcrypt = require("bcrypt");
const client = require("../config/database");
const jwt = require("jsonwebtoken");

//Login Function
exports.driverLogin = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const data = await client.query(`SELECT * FROM kuser WHERE phoneNumber= $1;`, [phoneNumber]) //Verifying if the user exists in the database
        const driver = data.rows;
        if (driver.length === 0) {
            res.status(401).json({
                error: "Driver is not registered, Sign Up first",
            });
        }
        else {
            bcrypt.compare(password, driver[0].password, (err, result) => { //Comparing the hashed password
                if (err) {
                    res.status(500).json({
                        error: "Server error",
                    });
                } else if (result === true) { //Checking if credentials match
                    const token = jwt.sign(
                        {
                            phoneNumber: phoneNumber ,
                        },
                        process.env.SECRET_KEY
                    );
                    res.status(200).json({
                        // id : Driver[0].id,
                        // name : Driver[0].name,
                        message: "Driver signed in!",
                        token: token,
                    });
                }
                else {
                    //Declaring the errors
                    if (result != true)
                        res.status(400).json({
                            error: "Enter correct password!",
                        });
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error occurred while signing in!", //Database connection error
        });
    };
};