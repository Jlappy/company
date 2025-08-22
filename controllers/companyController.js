const catchAsync = require('../utils/catchAsync')
const Company = require("../models/companyModel")
const AppError = require('../utils/appError')

exports.getAllCompanies = catchAsync(async (req, res, next) => {
    const companies = await Company.find().sort({ name: 1 })

    res.status(200).json({
        status: 'success',
        result: companies.length,
        data: {
            companies
        }
    })
})

exports.getAllCompaniesTotalStats = catchAsync(async (req, res, next) => {
    const companies = await Company.find()

    const totalCompanies = companies.length;

    const totalReviews = companies.reduce((acc, c) => acc + (c.totalReviews || 0), 0);

    const totalComplaints = companies.reduce((acc, c) => acc + (c.negativeCount || 0), 0);

    const averageComlaintRate = totalReviews === 0 ? 0 : ((totalComplaints / totalReviews) * 100).toFixed(2);

    const stats = {
        totalCompanies,
        totalReviews,
        averageComlaintRate: Number(averageComlaintRate),
    }

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        }
    })
})

exports.getAllCompaniesAllStats = catchAsync(async (req, res, next) => {
    const { sort, page = 1, limit = 10, search = '' } = req.query;

    // calculate company rate
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // feath all company
    let allCompanies = await Company.find({
        name: { $regex: search, $options: 'i' }
    }).lean()

    // calculate company rate manually
    allCompanies = allCompanies.map((company) => {
        const { negativeCount, totalReviews } = company;
        const complaintRate = totalReviews === 0 ? 0 : parseFloat(((negativeCount / totalReviews) * 100).toFixed(2));
        return {
            ...company,
            complaintRate,
        }
    })

    switch (sort) {
        case "review_asc":
            allCompanies.sort((a, b) => a.totalReviews - b.totalReviews)
            break;
        case "review_desc":
            allCompanies.sort((a, b) => b.totalReviews - a.totalReviews)
            break;
        case "complaint_asc":
            allCompanies.sort((a, b) => a.complaintRate - b.complaintRate)
            break;
        case "complaitn_desc":
            allCompanies.sort((a, b) => b.complaintRate - a.complaintRate)
            break;
        default:
            ((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            break;
    }

    const totalCompanies = allCompanies.length;
    const totalPages = Math.ceil(totalCompanies / limitNumber)

    const paginatedCompanies = allCompanies.slice(skip, skip + limitNumber);

    res.status(200).json({
        status: 'success',
        totalCompanies,
        totalPages,
        currentPage: pageNumber,
        count: paginatedCompanies.length,
        data: {
            companies: paginatedCompanies,
        }
    })
})

exports.getCompanyByID = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const company = await Company.findById(id)
        .populate({
            path: "reivews"
        })
        .lean()

    if (!company) return next(new AppError('no company with found', 404))

    const { totalReviews, negativeCount } = company;

    const complainRate = totalReviews === 0 ? 0 : parseFloat(((negativeCount / totalReviews) * 100).toFixed(2));

    const companyWithStats = {
        ...company,
        complainRate
    };

    res.status(200).json({
        status: 'success',
        message: "Company details",
        data: {
            companies: companyWithStats,
        }
    })
})