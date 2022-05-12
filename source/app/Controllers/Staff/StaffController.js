const { response } = require('express');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../../util/sequelizedb');
const { uploadFile } = require('../../Models/UploadModal')
const multer = require('multer')
const path = require('path');
require('dotenv').config();
const fs = require('fs');

class StaffController {
    main(req, res) {
        res.render('staff/login')
    }
    async login(req, res) {
        let login = await sequelize.query(`SELECT * FROM TaiKhoan WHERE Account='${req.body.username}' and Password='${req.body.password}' AND IDRole = 3`, {
            raw: true,
            type: QueryTypes.SELECT,
        })
        if (login.length > 0) {
            res.status(200).json({
                status: 'found',
            })
        }
        else {
            res.status(200).json({
                status: 'not found'
            })
        }
    }

    dashboard(req, res) {
        res.render('staff/main')
    }
    async service(req, res) {
        let categories = await sequelize.query(`Select  * from TypeService`);
        let allService = await sequelize.query(`Select sum(AmountService) as Sum from TypeService`);
        let services = await sequelize.query(`Select * from Service`);
        let employee = await sequelize.query(`Select * from Staff`);
        res.render('staff/service', {
            categories: categories[0],
            lengthCategory: categories[0].length,
            allService: allService[0][0].Sum,
            services: services[0],
            employee: employee[0],
        })
    }

    async employService(req, res) {
        let employee_service = await sequelize.query(`select st_s.IDService,PathImgStaff,TypeService from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService`)
        if (employee_service[0].length > 0) {
            return res.status(200).json({
                status: 'success',
                employee_service: employee_service[0]
            })
        }
        else {
            return res.status(200).json({
                status: 'failed'
            })
        }
    }

    async employService_id(req, res) {
        let employee_service = await sequelize.query(`select IDStaff from Staff_Service where IDService = ${req.body.idService}`)
        if (employee_service[0].length > 0) {
            return res.status(200).json({
                statusE: 'success',
                employee_service: employee_service[0]
            })
        }
        else {
            return res.status(200).json({
                status: 'failed'
            })
        }
    }
    async createCategory(req, res) {
        let createCategory = await sequelize.query(`INSERT INTO TypeService(IDTypeS,NameTypeService,Description,AmountService)
        VALUES(${req.body.id},N'${req.body.name}',N'${req.body.desc}',0)
        `, {
            raw: true,
            type: QueryTypes.INSERT
        })
        if (createCategory.length > 0) {
            return res.status(200).json({
                status: 'success',
            })
        }
        else {
            return res.status(200).json({
                status: 'failed',
            })
        }
    }

    async deleteCategory(req, res) {

        let updateType = await sequelize.query(`UPDATE Service SET TypeService = 1 WHERE TypeService = ${req.body.id}`)
        if (req.body.lengthService > 0) {
            let updateAmount = await sequelize.query(`UPDATE TypeService SET AmountService+=${req.body.lengthService} WHERE IDTypeS = 1`)
        }
        let deleteCategory = await sequelize.query(`delete TypeService where IDTypeS = ${req.body.id}`)
        if (deleteCategory.length > 0) {
            return res.status(200).json({
                status: 'success',
            })
        }
        else {
            return res.status(200).json({
                status: 'failed',
            })
        }
    }

    async editCategory(req, res) {
        let editCategory = await sequelize.query(`UPDATE TypeService SET NameTypeService = N'${req.body.name}' , Description = N'${req.body.description}' WHERE IDTypeS = ${req.body.id}`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async infoService(req, res) {
        let infoService = await sequelize.query(`select * from Service where IDService = ${req.body.idService}`)
        return res.status(200).json({
            status: 'success',
            infoService: infoService[0],
        })
    }

    async deleteService(req, res) {
        const id = req.body.idService;
        let getPathImg = await sequelize.query(`select PathImg FROM Service WHERE IDService = ${id} `);
        let fileImgOld = getPathImg[0][0].PathImg.split('/');
        let filePathImgOld = path.join(__dirname, `../../../public/img/${fileImgOld[4]}`);
        fs.unlink(filePathImgOld, (err) => err);
        let deleteStaff_Service = await sequelize.query(`delete Staff_Service WHERE IDService = ${id}`)
        let updateAmountOld = await sequelize.query(`update TypeService SET AmountService-=1 WHERE IDTypeS = (SELECT TypeService FROM Service WHERE IDService = ${id})`);
        let deleteService = await sequelize.query(`delete service where IDService = ${id}`)
        return res.status(200).json({
            status: 'success',
        })
    }
    async getInfoEmployee_service(req, res) {
        let info = await sequelize.query(`select NameStaff,PathImgStaff from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService and st_s.IDService = ${req.body.idService}`)
        return res.status(200).json({
            status: 'success',
            info: info[0],
        })
    }

}


module.exports = new StaffController;