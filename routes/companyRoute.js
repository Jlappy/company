const express = require('express')
const { getAllCompanies, getAllCompaniesTotalStats, getAllCompaniesAllStats, getCompanyByID } = require('../controllers/companyController')

const router = express.Router();

router.get('/all', getAllCompanies);
router.get('/total-stats', getAllCompaniesTotalStats);
router.get('/stats', getAllCompaniesAllStats);
router.get('/:id', getCompanyByID);

module.exports = router;