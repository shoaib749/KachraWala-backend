const bcrypt = require("bcrypt");
const client = require("../config/database");
const jwt = require("jsonwebtoken");
exports.driverRegister = async (req, res) => {
    const {ID, name, phoneNumber, password, location } = req.body;
    console.log("ID", ID);
    console.log("name", name);
    console.log("phoneNumber", phoneNumber);
    console.log("password", password);
    console.log("Location", location);
    try {
        const data = await client.query(`SELECT * FROM kuser WHERE phonenumber= $1;`, [phoneNumber]); //Checking if user already exists
        const arr = data.rows;
        if (arr.length != 0) {
            return res.status(400).json({
                error: "PhoneNumber already there, No need to register again.",
            });
        }
        else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        error: "Server error",
                    });
                }
                const driver = {
                    ID,
                    name,
                    phoneNumber,
                    password: hash,
                    location,
                };
                //Inserting data into the database
                client.query(`INSERT INTO kuser (ID, name, phonenumber,password, location) VALUES ($1,$2,$3,$4,$5);`, [driver.ID, driver.name, driver.phoneNumber, driver.password, driver.location], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            error: "Database error"
                        });
                    }
                    else {
                        res.status(200).send({ message: 'User added to database, not verified' });
                        const token = jwt.sign( //Signing a jwt token
                            {
                                phoneNumber: driver.phoneNumber,
                            },
                            process.env.SECRET_KEY
                        );
                    }
                });
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Database error while registring user!", //Database connection error
        });
    }
}