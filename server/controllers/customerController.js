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