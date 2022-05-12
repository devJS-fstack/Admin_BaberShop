const express = require('express');
const router = express.Router();
const StaffController = require('../app/Controllers/Staff/StaffController')
const { uploadFile, getUrlPublic } = require('../app/Models/UploadModal')
const { sequelize } = require('../util/sequelizedb');
const fs = require('fs');


const multer = require('multer')
const path = require('path');

let fileName = "";
let mineType = ""
var name = "";
var filepath = "";
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './source/public/img')
    },
    filename: (req, file, callback) => {
        // console.log(file)
        filepath = Date.now() + path.extname(file.originalname);
        var fileName = filepath.split('.')
        name = fileName[0]
        mineType = fileName[1];
        callback(null, filepath)
    }
})
const upload = multer({ storage: storage })

router.post('/service/add-service', upload.single('file'), async (req, res) => {
    var filepathNew = path.join(__dirname, `../public/img/${filepath}`)
    uploadFile(filepathNew, mineType, name);
    const body = req.body;
    var price = body.price_service.split('$')[1];
    var arrEmployee = body.arrEmployee.split(',');
    let addService = await sequelize.query(`INSERT INTO [dbo].[Service]
        ([IDService]
        ,[NameService]
        ,[Description]
        ,[PathImg]
        ,[TypeService]
        ,[ListPrice])
    VALUES
        (${body.idServiceNew},
        N'${body.name_service}',
        N'${body.description_service}',
        'http://localhost:3000/img/${filepath}',
        ${body.category_name},
        ${price}
            )`)
    let updateAmount = await sequelize.query(`UPDATE TypeService SET AmountService+=1 WHERE IDTypeS = ${body.category_name}`)
    var sql = '';
    var isDone = false;
    arrEmployee.forEach((employee, index) => {
        if (index == 0) {
            sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${employee}',${body.idServiceNew})`
        }
        else {
            sql += `,('${employee}',${body.idServiceNew})`
        }
        if (index == arrEmployee.length - 1) {
            isDone = true;
        }
    })

    if (isDone) {
        let createStaff_Service = await sequelize.query(sql);
    }
    res.redirect('back');
})
router.post('/service/edit-service-without-img', async (req, res) => {
    const body = req.body;
    var price = body.price_service.split('$')[1];
    var arrEmployee = body.arrEmployee.split(',');
    let updateAmountOld = await sequelize.query(`update TypeService SET AmountService-=1 WHERE IDTypeS = (SELECT TypeService FROM Service WHERE IDService = ${body.idServiceNew})`)
    let editService = await sequelize.query(`UPDATE [dbo].[Service]
        SET 
           [NameService] = N'${body.name_service}'
           ,[Description] = N'${body.description_service}'
           ,[TypeService] = ${body.category_name}
           ,[ListPrice] = ${price}
      WHERE IDService = ${body.idServiceNew}`)
    var sql = '';
    var isDone = false;
    let updateAmountNew = await sequelize.query(`UPDATE TypeService SET AmountService+=1 WHERE IDTypeS = ${body.category_name}`)
    let deleteStaffService_old = await sequelize.query(` delete Staff_Service WHERE IDService = ${body.idServiceNew} `)
    arrEmployee.forEach((employee, index) => {
        if (index == 0) {
            sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${employee}',${body.idServiceNew})`
        }
        else {
            sql += `,('${employee}',${body.idServiceNew})`
        }
        if (index == arrEmployee.length - 1) {
            isDone = true;
        }
    })

    if (isDone) {
        let createStaff_Service = await sequelize.query(sql);
    }
    res.redirect('back');
})
router.post('/service/edit-service', upload.single('file'), async (req, res) => {
    var filepathNew = path.join(__dirname, `../public/img/${filepath}`)
    uploadFile(filepathNew, mineType, name);
    const body = req.body;
    let getPathImg = await sequelize.query(`select PathImg FROM Service WHERE IDService = ${body.idServiceNew} `);
    let fileImgOld = getPathImg[0][0].PathImg.split('/');
    let filePathImgOld = path.join(__dirname, `../public/img/${fileImgOld[4]}`);
    fs.unlink(filePathImgOld, (err) => err);
    var price = body.price_service.split('$')[1];
    var arrEmployee = body.arrEmployee.split(',');
    let updateAmountOld = await sequelize.query(`update TypeService SET AmountService-=1 WHERE IDTypeS = (SELECT TypeService FROM Service WHERE IDService = ${body.idServiceNew})`)
    let editService = await sequelize.query(`UPDATE [dbo].[Service]
    SET 
       [NameService] = N'${body.name_service}'
       ,[Description] = N'${body.description_service}'
       ,[PathImg] = 'http://localhost:3000/img/${filepath}'
       ,[TypeService] = ${body.category_name}
       ,[ListPrice] = ${price}
  WHERE IDService = ${body.idServiceNew}`)
    var sql = '';
    var isDone = false;
    let updateAmountNew = await sequelize.query(`UPDATE TypeService SET AmountService+=1 WHERE IDTypeS = ${body.category_name}`)
    let deleteStaffService_old = await sequelize.query(` delete Staff_Service WHERE IDService = ${body.idServiceNew} `)
    arrEmployee.forEach((employee, index) => {
        if (index == 0) {
            sql = `INSERT INTO Staff_Service (IDStaff,IDService) VALUES('${employee}',${body.idServiceNew})`
        }
        else {
            sql += `,('${employee}',${body.idServiceNew})`
        }
        if (index == arrEmployee.length - 1) {
            isDone = true;
        }
    })

    if (isDone) {
        let createStaff_Service = await sequelize.query(sql);
    }
    res.redirect('back');
})
router.post('/service/info-employee', StaffController.getInfoEmployee_service);
router.post('/service/delete-service', StaffController.deleteService);
router.post('/service/info-service', StaffController.infoService);
router.post('/service/edit-category', StaffController.editCategory)
router.post('/service/delete-category', StaffController.deleteCategory)
router.post('/service/create-category', StaffController.createCategory)
router.post('/service/employee-service', StaffController.employService)
router.post('/service/employee-service-id', StaffController.employService_id)
router.get('/service', StaffController.service)
router.get('/dashboard-manager', StaffController.dashboard)
router.post('/login', StaffController.login);
router.get('/', StaffController.main);

module.exports = router;