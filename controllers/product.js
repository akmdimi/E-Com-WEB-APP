const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs") //default property of node js file system

exports.getProductById = (req, res, next, id) =>{
    Product.findById(id)
    .populate("category") //populating based on the category of the product we can have many methods as we want
    .exec((err, product)=>{
        if(err){
            return res.status(400).json({
            error:"Product not found"
            })
        }
        req.product = product;
        next()
    })
}

exports.createproduct = (req, res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with Image!"
            })
        }

        // TODO restrictions on field
        let product = new product(fields)

        //Handle files here
        if(file.photo){
            if(file.photo.size>300000){
                return res.status(400).json({
                    error:"File size is too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // save to db
        product.save((err, product)=>{
            if(err){
                res.status(400).json({
                    error:"Saving tshirt in DB failed"
                })
            }
            res.json(product)
        })
    })
}