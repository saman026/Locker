const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const orgDocsController = require("../controllers/orgDocsControllerDemo");
const orgDocsController1 = require("../controllers/orgDocsController");


router.get("/get/issuer", orgDocsController.getUsers);
router.get("/get/doc", orgDocsController.getDocs);

router.post("/pull/doc", [
    check("clientid", "ClientId is required").not().isEmpty(),
    check("orgid", "orgid is required").not().isEmpty(),
    check("doctype", "doctype is required").not().isEmpty(),
    check("ts", "Timestamp is required").not().isEmpty(),
], orgDocsController.fetchDocs);

router.post("/pull/issuer", [
    check("clientid", "ClientId is required").not().isEmpty(),
    check("ts", "Timestamp is required").not().isEmpty(),
], orgDocsController.fetchIssuers);

module.exports = router;