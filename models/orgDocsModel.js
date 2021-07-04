const mongoose = require("mongoose");

const orgDocsSchema = new mongoose.Schema({
    orgid: {
        type: String,
        unique: true,
        required: [true, "OrgId required"]
    },
    issuerid: {
        type: String,
        required: [true, "IssuerId is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    category: {
        type: String,
        // enum: ['Central Government', 'State Government', 'Education', 'Insurance']
    },
    description: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        // required: true
    },

    documents: [
        {
            doctype: String,
            description: String,
            _id: false,
        }
    ],

    createddate: {
        type: Date,
        default: Date.now(),
        select: false
    },
    updateddate: {
        type: Date,
        select: false
    },
    available: {
        type: String,
        defualt: 'N'
    }
});

module.exports = OrgDocs = mongoose.model("orgdocs", orgDocsSchema);