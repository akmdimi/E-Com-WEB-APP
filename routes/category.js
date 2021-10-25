const express = require("express")
const router = express.Router()

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, deleteCategory} = require("../controllers/category")
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//Params
//Populating Profile Field
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)

//Actual Routes Goes Here::::::>>>>>

//Create Routes
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)

//read Routes
router.get ("/category/:categoryId", getCategory)
router.get ("/categories", getAllCategory)

//Update Routes
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

//Delete Routes
router.delete("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, deleteCategory)

module.exports= router