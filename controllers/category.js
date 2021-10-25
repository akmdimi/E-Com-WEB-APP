const Category = require ("../models/category")

exports. getCategoryById = (req, res, next, id) =>{
    Category.findById(id).exec((err, cate)=>{
        if(err){
            return res.status(400).json({
                error:"Category Not found in DB"
            })
        }
        req.category = cate;
        next()
    })
}
exports.createCategory = (req, res) =>{
    const category = new Category(req.body)
    category.save((err, category)=>{
        if(err){
            return res.status(400).json({
                error:"Not Able to save Category in DB"
            })
        }
        res.json({category})
    })
}
//Getting sigle category
exports.getCategory = (req, res) =>{
    return res.json(req.category)
}
//Getting All Category
exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories)=>{
        if(err){
            return res.status(400).json({
                error:"No categories found"
            })
        }
        res.json(categories)
    })
}

//
exports.updateCategory = (req, res) => {
    const category = req.category   //req.category is able to grab because of the middleware
    category.name = req.body.name   //grabbing the category from the front end or postman

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error:"failed to update the category"
            })
        }
        res.json(updatedCategory)
    })
}

exports.deleteCategory = (req, res) => {
    const category = req.category //from middleware extracting things from param
    category.remove((err, category)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete this category"
            })
        }
        res.json({
            message:"Successfully Deleted"
        })
    })
}