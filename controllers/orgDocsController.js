const orgDocs = require("../models/orgDocsModel");
const axios = require("axios");
const dotenv = require("dotenv");
const AppError = require("../utils/appError");
dotenv.config({ path: './config.env' });
const sha256 = require("sha256");

const URL = process.env.URL;
const secretKey = process.env.secretKey;
const clientid = process.env.clientid;

console.log("url", URL);

exports.fetchIssuers = async (req, res, next) => {

    // const { secretKey, clientid, ts } = req.body;
    
    const hm = sha256(`${secretKey}${clientid}${ts}`);

    
    await axios.post(`${URL}/issuers`, new URLSearchParams({
        clientid,
            ts,
            hmac: hm,
     })).then((res) => {
         console.log(res.data, "ress");
         const issuers = res.data;
         return res.json({msg: "done"})
     }).catch((err) => {
         return next(new AppError("Something went wrong!", 500));
    })

}


















exports.getUsers = () => {
    // await axios.post('https://api.digitallocker.gov.in/public/oauth2/1/pull/issuers', new URLSearchParams({
    //     clientid,
    //         ts,
    //         hmac: hm,
    //  })).then((res) => {
    //      console.log(res.data, "ress");
    //      const issuers = res.data;
    //      return res.json({msg: "done"})
    //  }).catch((err) => {
    //      return next(new AppError("Something went wrong!", 500));
    // })

}