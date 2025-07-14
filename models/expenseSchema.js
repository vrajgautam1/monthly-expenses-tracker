const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    month: {type: String,unique: true,required: true,trim: true,lowercase: true},
    income: {type: Number}, 
    expenseCategories: [{category: {type:String}, amount: {type:Number}}]
},{
    timestamps: true
})

const ExpenseModel = mongoose.model("Expense", expenseSchema)
module.exports = ExpenseModel; 