const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/companyModel');

dotenv.config({ path: '../.env' })
const DB = process.env.DB_URL;

mongoose
    .connect(DB)
    .then(() => console.log("db connect succes"))
    .catch((err) => console.log(err))

const banks = [
    "Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)",
    "Ngân hàng TMCP Á Châu (ACB)",
    "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
    "Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)",
    "Ngân hàng TMCP Tiên Phong (TPBank)",
    "Ngân hàng TMCP Quân Đội (MB Bank)",
    "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
    "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
    "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh (HDBank)",
    "Ngân hàng TMCP Phương Đông (OCB)",
    "Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)",
    "Ngân hàng TMCP Quốc tế Việt Nam (VIB)",
    "Ngân hàng TMCP Sài Gòn (SCB)",
    "Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam (Eximbank)",
    "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)",
    "Ngân hàng TMCP Bưu điện Liên Việt (LienVietPostBank)",
    "Ngân hàng TMCP Kiên Long (KienlongBank)",
    "Ngân hàng TMCP Xăng dầu Petrolimex (PG Bank)",
    "Ngân hàng TMCP Nam Á (NamABank)",
    "Ngân hàng TMCP An Bình (ABBank)",
    "Ngân hàng TMCP Bản Việt (Viet Capital Bank)",
    "Ngân hàng TMCP Sài Gòn Công Thương (Saigonbank)",
    "Ngân hàng TMCP Quốc Dân (NCB)",
]

const addCompanies = async () => {
    try {
        await Company.deleteMany();
        const formatted = banks.map((name) => ({
            name: name.trim(),
            totalReviews: 0,
            positiveCount: 0,
            negativeCount: 0,
            nutralCount: 0,
            reviews: [],
        }))
        await Company.insertMany(formatted)
        console.log('companies added successfully');
        process.exit()
    } catch (err) {
        console.log("error adding companies", err);
        process.exit(1);
    }
}

const deleteCompanies = async () => {
    try {
        await Company.deleteMany();
        console.log('companies delete success');
        process.exit()

    } catch (err) {
        console.log('err delete companies', err);
        process.exit(1)
    }
}

const run = async () => {
    const arg = process.argv[2]
    if (arg === '--add') {
        await addCompanies()
    } else if (arg === '--delete') {
        await deleteCompanies()
    } else {
        console.log('Use --add to add company or --delete to delete company');
        process.exit(0);
    }
}

run();