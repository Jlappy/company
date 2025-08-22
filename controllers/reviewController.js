const catchAsync = require('../utils/catchAsync')
const Story = require("../models/reviewModel")

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const {
        companyName = '',
        vibe = "",
        search = "",
        sort = "newest",
        page = 1,
        limit = 6
    } = req.query

    const filter = {};

    if (companyName) {
        filter.companyName = { $regex: companyName, $options: 'i' }
    }

    if (vibe) {
        filter.vibe = vibe
    }
    if (search) {
        filter.title = { $regex: search, $options: 'i' }
    }

    const sortOption = sort === "oldest" ? "createAt" : "-createAt"

    const skip = (page - 1) + limit;

    const [reivews, total] = await Promise.all([
        Story.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
        Story.countDocuments(filter),
    ])

    res.status(200).json({
        status: 'success',
        results: reviewModel.length,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        data: { reivews }
    })
})