const User = require("../models/user"); 
const Order = require("../models/order")

//Middleware
exports.getUserById = (req, res, next, id)=> {
    User.findById(id).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "No User was foud in DB"
            })
        }
        req.profile = user;
        next()
    })
}

exports.updateUser = (req, res)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set:req.body},
        {new: true, useFindAndModify: false},
        (err, user)=>{
            if(err){ 
            return res.status(400).json({
                error:"You are not authorized to update this user"
            })
        }
        user.salt = undefined; //Updated User So not using Profile
        user.encry_password= undefined;
        res.json(user)
    }
)}

// Code to Get All USERS
// exports.getAllusers = (req, res) => {
//     User.find().exec((err, users) => {
//         if(err || !users){
//             return res.status(400).json({
//                 error:"No Users Found"
//             })
//         }
//         res.json(users)
//     })
// }

exports.getUser = (req, res)=>{
    //TODO: get back here for password
    
    //Removing salt and protected info from user's browser that we don't want to show!
    //!!!It's there in DB
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt= undefined;
    req.profile.updatedAt= undefined;
    return res.json(req.profile)
}
//To get order from the user from front end only not all the purchase list
exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id},
        )
    .populate("user", "_id name")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error:"No order in this account"
            })
        }
        return res.json(order)
    })
}
//Middleware for getting all purchase list
exports.pushOrderInPurchaseList = (req, res, next) =>{
    let purchases = [] //empty array
    req.body.order.products.forEach(items => {
        purchases.push({                                           //push the info for purchases
            _id:product._id,
            name: product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })

    //Store this in DB
    User.findOneAndUpdate(                                      
        {_id:req.profile._id},
        {$push: {purchases: purchases}},                       //$push because it's array
        {new: true},                                           //send the database the updated one,
        (err, purchaselist) => {
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                })
            }
            next()
        }
    )
}