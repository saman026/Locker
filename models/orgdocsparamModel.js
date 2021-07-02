const mongoose = require("mongoose");

const orgDocsParamSchema = new mongoose.Schema({
    orgid: {
        type: "String",
        required: true,
    },
    doctype: {
        type: "String",
        required: true,
        unique: true,
    },
    description: {
        type: "String",
        trim: true,
    },
    params: [
        {
            label: String,
            paramname: String,
            valuelist: String,
            example: String,
            regex: String,
            Errormessage: String
        }
    ],
    createddate: {
        type: Date,
        default: Date.now(),
    },
    updateddate: {
        type: Date
    },
    available: {
        type: String,
        default: 'N'
    }
})

module.exports = OrgDocsParam = mongoose.model("orgdocsparam", orgDocsParamSchema)