const Customer = require('../models/Customer')
const mongoose = require('mongoose');

/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {

    const messages = await req.consumeFlash('info')

    const locals = {
        title: "NodeJs",
        description: ""
    }

    let perPage = 12;
    let page = req.query.page || 1;

    try {

        const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });

    } catch (error) {
        console.log(error);
    }


}


/**
 * GET /
 * About
 */

exports.about = async (req, res) => {

    const locals = {
        title: "NodeJs",
        description: "NodeJs User Management System"
    }
    try {

        res.render('about', {
            locals,
        });

    } catch (error) {
        console.log(error);
    }


}

/**
 * GET /
 * New Customer Form
 */

exports.addCustomer = async (req, res) => {
    const locals = {
        title: "Add New Customer",
        description: "Free NodeJs User Management System"
    }

    res.render('customer/add', locals)
}

/**
 * POST /
 * Create New Customer Form
 */

exports.postCustomer = async (req, res) => {

    // console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email,
    })

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'New Customer has been added')
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }

}

/**
 * GET /
 * view details
 */

exports.viewCustomer = async (req, res) => {


    try {
        const locals = {
            title: "NodeJs | View Customer Data",
            description: "NodeJs User Management System"
        }
        const customer = await Customer.findOne({ _id: req.params.id })

        res.render('customer/view', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }
}

/**
 * GET /
 * Edit details
 */

exports.editCustomer = async (req, res) => {


    try {
        const locals = {
            title: "NodeJs | Edit Customer Data",
            description: "NodeJs User Management System"
        }
        const customer = await Customer.findOne({ _id: req.params.id })

        res.render('customer/edit', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }
}


/**
 * PUT /
 * Edit details
 */

exports.editDetails = async (req, res) => {


    try {
        const locals = {
            title: "NodeJs | Edit Customer Data",
            description: "NodeJs User Management System"
        }
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastNames: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updatedAt: Date.now(),
        })

        res.redirect(`/edit/${req.params.id}`)

    } catch (error) {
        console.log(error);
    }
}


/**
 * DELETE /
 * Delete Customer
 */

exports.deleteCustomer = async (req, res) => {


    try {

        await Customer.deleteOne({ _id: req.params.id })

        res.redirect(`/`)

    } catch (error) {
        console.log(error);
    }
}

/**
 * GET /
 * Search Customer
 */

exports.searchCustomer = async (req, res) => {

    try {
        const locals = {
            title: "NodeJs | Search",
            description: "NodeJs User Management System",
        }

        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            ]
        });

        res.render("search", {
            customers,
            locals
        })

    } catch (error) {
        console.log(error);
    }
}