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
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let categories = await sequelize.query(`Select  * from TypeService`);
        let allService = await sequelize.query(`Select sum(AmountService) as Sum from TypeService`);
        let services = await sequelize.query(`Select * from Service WHERE Status = N'Hoạt Động'`);
        let employee = await sequelize.query(`Select * from Staff WHERE TypeStaff = 1 AND Status = N'Hoạt Động'`);
        res.render('staff/service', {
            categories: categories[0],
            lengthCategory: categories[0].length,
            allService: allService[0][0].Sum,
            services: services[0],
            employee: employee[0],
        })
    }

    async employService(req, res) {
        let employee_service = await sequelize.query(`select st_s.IDService,PathImgStaff,TypeService from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService AND s.Status = N'Hoạt Động'`)
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
                statusE: 'failed'
            })
        }
    }

    async serviceEmployee_id(req, res) {
        let service_employee = await sequelize.query(`select IDService from Staff_Service where IDStaff = '${req.body.idEmployee}'`)
        if (service_employee[0].length > 0) {
            return res.status(200).json({
                statusS: 'success',
                service_employee: service_employee[0]
            })
        } else {
            return res.status(200).json({
                statusS: 'failed',
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
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
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
        let updateAmount = await sequelize.query(`update TypeService SET AmountService = (SELECT Count(IDService) FROM Service WHERE TypeService = IDTypeS)`)
        let deleteBookItem = await sequelize.query(`DELETE BookItem WHERE IDService = ${id}`)
        let deleteService = await sequelize.query(`delete service where IDService = ${id}`)
        let updatePaymentBook = await sequelize.query(`UPDATE Book SET Payment = (SELECT Sum(Price) FROM BookItem) WHERE Status = N'Đã đặt lịch'`)
        return res.status(200).json({
            status: 'success',
        })
    }
    async getInfoEmployee_service(req, res) {
        let info = await sequelize.query(`select SurName,NameStaff,PathImgStaff from Staff_Service as st_s,Staff as s,Service as sv WHERE st_s.IDStaff = s.IDStaff and sv.IDService = st_s.IDService and st_s.IDService = ${req.body.idService} AND s.Status = N'Hoạt Động' `)
        return res.status(200).json({
            status: 'success',
            info: info[0],
        })
    }

    async getInfoBook_service(req, res) {
        let infoBookFuture = await sequelize.query(`select IDService FROM BookItem as bi,Book as b WHERE IDService = ${req.body.idService} AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook AND b.Status = N'Đã đặt lịch'`);
        let infoBookDone = await sequelize.query(`select IDService FROM BookItem as bi,Book as b WHERE IDService = ${req.body.idService} AND b.DateBook = bi.DateBook AND b.IDShiftBook = bi.IDShiftBook AND b.Status = N'Đã thanh toán'`);
        return res.status(200).json({
            status: 'success',
            infoBookFuture: infoBookFuture[0],
            infoBookDone: infoBookDone[0],
        })
    }

    async getInfoBook_Employee(req, res) {
        let infoBookFuture = await sequelize.query(`select IDStaff FROM Book WHERE IDStaff = '${req.body.idEmployee}' AND Status = N'Đã đặt lịch'`);
        let infoBookDone = await sequelize.query(`select IDStaff FROM Book WHERE IDStaff = '${req.body.idEmployee}' AND Status = N'Đã thanh toán'`);
        return res.status(200).json({
            status: 'success',
            infoBookFuture: infoBookFuture[0],
            infoBookDone: infoBookDone[0],
        })
    }

    async employee(req, res) {
        let employee = await sequelize.query(`select * from Staff`)
        let store = await sequelize.query(`select * from Store`)
        let managers = await sequelize.query(`select * from Staff where IDManager = IDStaff`)
        let services = await sequelize.query(`select * from Service WHERE Status = N'Hoạt Động'`)
        let typeEmployee = await sequelize.query(`select * from TypeStaff`);
        var lengthEmployee = employee[0].length
        res.render('staff/employee', {
            employee: employee[0],
            lengthEmployee,
            store: store[0],
            managers: managers[0],
            services: services[0],
            typeEmployee: typeEmployee[0],
        });
    }

    async getInfoEmployee(req, res) {
        let employee = await sequelize.query(`select * from Staff WHERE IDStaff = '${req.body.idEmployee}'`)
        return res.status(200).json({
            status: 'success',
            employee: employee[0],
        })
    }


    async deleteEmployee(req, res) {
        const id = req.body.idEmployee;
        let getPathImg = await sequelize.query(`select PathImgStaff FROM Staff WHERE IDStaff = '${id}' `);
        let fileImgOld = getPathImg[0][0].PathImgStaff.split('/');
        let filePathImgOld = path.join(__dirname, `../../../public/img/${fileImgOld[4]}`);
        fs.unlink(filePathImgOld, (err) => err);
        let deleteStaff_Service = await sequelize.query(`delete Staff_Service WHERE IDStaff = '${id}'`)
        let deleteBookItem = await sequelize.query(`delete BookItem WHERE IDStaff = '${id}'`)
        let deleteBook = await sequelize.query(`delete Book WHERE IDStaff = '${id}'`)
        let deleteRegis = await sequelize.query(`delete RegisShift WHERE IDStaff = '${id}'`)
        let deleteEmployee = await sequelize.query(`delete Staff WHERE IDStaff = '${id}'`)
        return res.status(200).json({
            status: 'success',
        })
    }

    async setStatusEmployee(req, res) {
        let setStatus = await sequelize.query(`UPDATE Staff SET Status = N'${req.body.status}' WHERE IDStaff = '${req.body.idEmployee}'`)
        return res.status(200).json({
            status: 'success',
        })
    }
}


module.exports = new StaffController;