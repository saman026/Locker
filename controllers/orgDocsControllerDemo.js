const OrgDocs = require("../models/orgDocsModel");
const OrgDocsParam = require("../models/orgdocsparamModel");
const sha256 = require("sha256");
const request = require("request");
const axios = require('axios');
const AppError = require("../utils/appError");


exports.fetchIssuers = async (req, res, next) => {

   

    const { secretKey, clientid, ts } = req.body;
    
    // const clientid = req.body.clientid;
    // const ts = req.body.ts;
    const hm = sha256(`${secretKey}${clientid}${ts}`);


    const options1 = {
        url: 'https://api.digitallocker.gov.in/public/oauth2/1/pull/issuers',
        form: {
            clientid,
            ts,
            hmac: hm,
        },
    }

    await request.post(options1, async (err, res, body) => {
        if (err)
            return console.log(err);
        const issuers = JSON.parse(body);

        console.log(issuers.issuers.length, "hi");

        issuers.issuers.map(async (issuer, key) => {
            

            const hmac = sha256(`${secretKey}${clientid}${issuer.orgid}${ts}`)

            const options = {
        url: `https://api.digitallocker.gov.in/public/oauth2/1/pull/doctype?orgid=${issuer.orgid}`,
        form: {
            clientid,
            orgid: issuer.orgid,
            ts,
            hmac,
    
        },
    }

            
        await request.post(options, async (err, res, body) => {
        if (err)
                return console.log(err);
            
            
            const issuersdoc = JSON.parse(body);
            
            // const category = ['Central Government', 'State Government','Education', 'Insurance']

            const name = issuer.name.trim();
            const n = name.lastIndexOf(" ");
            var state = name.substring(n);

            // const categories = ['Central Government', 'State Government', 'Education', 'Insurance'];

            // let fetched_category = [];
            // categories.map((category, key) => {
            //     console.log(category)
            //     fetched_category = categories[category];
            // })

            // console.log(fetched_category, "hii");

            const user = new OrgDocs({
                orgid: issuer.orgid,
                issuerid: issuer.issuerid,
                name: issuer.name,
                category: issuer.categories,
                description: issuer.description,
                state,
                documents: issuersdoc.documents,
                createddate: Date.now(),

            })

            // const result = await user.save();
            
            // console.log("saved");
    })


        })

        // res.write("done");
       
        // var unixTime = Math.floor((new Date()).getTime() / 1000);
        // console.log(unixTime);           
            
    })
    
}

exports.fetchDocs = async (req, res) => {

    const { secretKey, clientid, orgid, doctype, ts } = req.body
    const hmac = sha256(`${secretKey}${clientid}${orgid}${doctype}${ts}`);
    const options1 = {
        url: 'https://api.digitallocker.gov.in/public/oauth2/1/pull/parameters',
        form: {
            clientid,
            orgid,
            doctype,
            ts,
            hmac,
        },
    }

    await request.post(options1, async (err, res, body) => {
        if (err)
            return console.log(err);
        const documents = JSON.parse(body);
        console.log(documents, "hi");

        const result = await OrgDocs.find();
        result.map((issuer, key1) => {
            if (issuer.orgid === orgid) {
                    issuer.documents.map((doc, key2) => {
                            if (doc.doctype === doctype) {                            
                                description = doc.description
                    }
                })
            
}})

        const doc = new OrgDocsParam({
            orgid,
            doctype,
            description,
            params: documents,
            createddate: Date.now(),
        })

        const result1 = await doc.save();
        console.log("saved");

    })
    
}

exports.getUsers = async (req, res, next) => {

    await OrgDocs.find().then((response) => {
        res.status(200).json(response);
    }).catch((err)=>console.log(err))
    
};

exports.getDocs = async (req, res, next) => {

    await OrgDocsParam.find().then((response) => {
        res.status(200).json(response);
    }).catch((err)=>console.log(err))
    
};
    

    