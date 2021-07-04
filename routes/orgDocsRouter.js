const express = require("express");
const router = express.Router();

const orgDocsController = require("../controllers/orgDocsController");


router.get("/get/issuers", orgDocsController.getIssuers);
router.get("/get/params", orgDocsController.getParams);

router.post("/pull/issuers", orgDocsController.fetchIssuers);
router.post("/pull/doctype", orgDocsController.fetchDocuments);
router.post("/pull/params",  orgDocsController.fetchParams);


module.exports = router;