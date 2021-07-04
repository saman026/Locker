const axios = require("axios");
const dotenv = require("dotenv");
const AppError = require("../utils/appError");
const { unixTime, HMAC } = require("../utils/generate");
const OrgDocs = require("../models/orgDocsModel");
const OrgDocsParam = require("../models/orgdocsparamModel");
dotenv.config({ path: './config.env' });


const URL = process.env.URL;
const secretKey = process.env.secretKey;
const clientid = process.env.clientid;
const ts = unixTime();


exports.fetchIssuers = async (req, res, next) => {
    
    try {
        const hmac = HMAC(`${secretKey}${clientid}${ts}`);
        
        await axios.post(`${URL}/issuers`, new URLSearchParams({
        
            clientid,
            ts,
            hmac,
        })).then(async (res) => {
            await OrgDocs.insertMany(res.data.issuers).then((res) => {
                console.log("done");
            });
        });
    } catch (err){
        return next(new AppError("Something went wrong", 500));
    };

};

let lim = 0;
exports.fetchDocuments = async (req, res, next) => {

    try {
        
        await OrgDocs.find().limit(100).skip(lim).then((issuers) => {
            console.log(issuers.length, "result");
            {
                issuers && issuers.map(async (issuer, key) => {

                    const name = issuer.name.trim();
                    const n = name.lastIndexOf(" ");
                    var state = name.substring(n);

                    const hmac = HMAC(`${secretKey}${clientid}${issuer.orgid}${ts}`)

                    await axios.post(`${URL}/doctype?orgid=${issuer.orgid}`, new URLSearchParams({
                        clientid,
                        orgid: issuer.orgid,
                        ts,
                        hmac,
                    })).then(async (res) => {
                        console.log(res.data.documents.length, "re");
                        await OrgDocs.findByIdAndUpdate({ _id: issuer._id }, {
                            documents: res.data.documents,
                            state,
                        }).then(() => {
                            console.log("done");
                        }).catch((err) => console.log(err));
                    }).catch((err) => console.log(err));
                });
            };
        });
    } catch (err) {
        return next(new AppError("Something went wrong", 500));
    }
    lim = lim + 100; 
};


lim = 0;
exports.fetchParams = async (req, res, next) => {
   
    await OrgDocs.find().limit(50).skip(lim).then((issuers) => {
        {
            issuers && issuers.map((issuer, key1) => {
                issuer.documents.map((document, key2) => {
                    const hmac = HMAC(`${secretKey}${clientid}${issuer.orgid}${document.doctype}${ts}`);

                    axios.post(`${URL}/parameters`, new URLSearchParams({
                        clientid,
                        orgid: issuer.orgid,
                        doctype: document.doctype,
                        ts,
                        hmac,
                    })).then(async (response) => {
                    
                        const doc_data = new OrgDocsParam({

                            orgid: issuer.orgid,
                            doctype: document.doctype,
                            description: document.description,
                            params: response.data,
                            createddate: Date.now(),
                        });
                        await doc_data.save().then((res) => {
                            console.log("saved");
                        }).catch((err) => {
                            return next(new AppError("Something went wrong", 500));
                        })
                        
                    }).catch(() => {
                         return next(new AppError("Something went wrong", 500));
                    });
                });
            });
        };
    }).catch(() => {
        return next(new AppError("Something went wrong!", 500));
    });
    lim = lim + 50;
};


exports.getIssuers = async (req, res, next) => {

    await OrgDocs.find().then((response) => {
        res.status(200).json({
            "length": response.length,
            "data": response,
        });
    }).catch((err) => console.log(err));
    
};

exports.getParams = async (req, res, next) => {

    await OrgDocsParam.find().then((response) => {
        res.status(200).json({
            "length": response.length,
            "data": response,
        });
    }).catch((err) => console.log(err));
    
};
    

    








