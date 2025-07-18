import dotenv from "dotenv";
dotenv.config();

const config = {
    JWT_USER_PASSWORD: process.env.JWT_PASSWORD || deepseekai
};
 
export default config;

