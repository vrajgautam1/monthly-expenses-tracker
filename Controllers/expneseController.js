const ExpenseModel = require("../models/expenseSchema");
const fs = require("fs");
const path = require("path");

//1-CREATE
module.exports.setExpenses = async (req, res) => {
    const { income, month, expenseCategories } = req.body;

    //------------------ for dealing with similar sounding words like mae, may, me, and so on.
    let monthlist = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ];

    let formattedMonth;

    if (month) {
        formattedMonth = month.toLowerCase().trim();
    }

    if (!monthlist.includes(formattedMonth)) {
        return res.status(400).json({ message: "invalid month" });
    }
    //----------------------

    try {
        //check if there is any entry with the month that we entered
        const existingMonth = await ExpenseModel.findOne({
            month: formattedMonth,
        });

        if (existingMonth) {
            return res.status(400).json({
                message:
                    "month already exists, please update the data if u want to.",
            });
        }
        //---------------
        await ExpenseModel.create({
            income: income,
            month: formattedMonth,
            expenseCategories,
        });
        return res
            .status(201)
            .json({ message: "income added", content: req.body });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//2-READ
module.exports.summary = async (req, res) => {
    try {
        const month = req.body?.month;
        //1 - for getting monthwise summary
        let summary;

        if (month) {
            summary = await ExpenseModel.find({
                month: month.toLowerCase().trim(),
            });
        } else {
            summary = await ExpenseModel.find();
        }

        //2 - Total income kadhva mate. array ni andar object, object ni andar key-value pair.
        let totalIncome = 0;
        for (let obj of summary) {
            for (let key in obj) {
                if (key === "income") {
                    totalIncome = totalIncome + obj.income;
                }
            }
        }

        //3 - Total expenses kadhva mate. again same process, array ni andar object ane object ni andar key-value pair.
        let totalExpenses = 0;
        for (let obj of summary) {
            for (let key in obj) {
                if (key === "expenseCategories") {
                    for (let category of obj.expenseCategories) {
                        totalExpenses += category.amount;
                    }
                }
            }
        }

        //4 - Remaining balance
        let remainingBalance = totalIncome - totalExpenses;

        console.log("total income is", totalIncome);
        console.log("total expense is", totalExpenses);
        console.log("Remaining balance is", remainingBalance);

        //final data
        return res
            .status(200)
            .json({ summary, totalIncome, totalExpenses, remainingBalance });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//3.1-UPDATE-INCOME
module.exports.updateIncome = async (req, res) => {
    let income = req.body?.income;
    try {
        let month = req.body?.month;
        month = month.toLowerCase().trim();
        let monthToUpdateIncome = await ExpenseModel.findOne({ month });
        if (!monthToUpdateIncome) {
            return res.status(400).json({ error: "month does not exist" });
        }

        monthToUpdateIncome.income = income;

        await monthToUpdateIncome.save();
        return res
            .status(200)
            .json({ updatedIncome: monthToUpdateIncome.income });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
};

//3.2-UPDATE-CATEGORY
module.exports.updateCategory = async (req, res) => {
    try {
        let month = req.body?.month;
        let category = req.body?.category;
        let newExpense = req.body?.amount;

        // sanitization
        month = month.toLowerCase().trim();
        category = category.toLowerCase().trim();
        newExpense = Number(newExpense);

        if (isNaN(newExpense)) {
            return res.status(400).json({ error: "Invalid amount" });
        }

       
        let monthToUpdate = await ExpenseModel.findOne({ month });

        if (!monthToUpdate) {
            return res.status(400).json({ error: "month does not exist" });
        }

       
        const categoryExists = monthToUpdate.expenseCategories.some(
            (cat) => cat.category.toLowerCase().trim() === category
        );

        if (!categoryExists) {
            return res.status(400).json({ error: "category does not exist" });
        }

       
        monthToUpdate.expenseCategories = monthToUpdate.expenseCategories.map((cat) => {
            if (cat.category.toLowerCase().trim() === category) {
                return {
                    ...cat.toObject(), 
                    amount: newExpense,
                };
            }
            return cat;
        });

        await monthToUpdate.save();

        return res.status(200).json({
            message: "category updated successfully",
            updatedData: monthToUpdate,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
};



//4-DELETE
module.exports.deleteExpenseCategory = async (req, res) => {
    try {
        //step - 1 get month and category strings
        let month = req.body?.month;
        let category = req.body?.category;

        //step - 2 clean the strings
        month = month.toLowerCase().trim();
        category = category.toLowerCase().trim();

        //step - 3 search the month to check if it exists
        let monthForTheExpenseCategoryToDelete = await ExpenseModel.findOne({
            month,
        });

        //step - 3.1 if it does not exist then throw an error
        if (!monthForTheExpenseCategoryToDelete) {
            return res.status(400).json({ error: "month does not exist" });
        }

        //almost forgot this
        let categoryExists =
            monthForTheExpenseCategoryToDelete.expenseCategories.some((cat) => {
                return cat.category === category;
            });

        if (!categoryExists) {
            return res
                .status(400)
                .json({ message: "category to delete does not exist" });
        }

        //step - 4 now edit the goddamn array to delete that category its more of a update thing but we shall call it delete.
        monthForTheExpenseCategoryToDelete.expenseCategories =
            monthForTheExpenseCategoryToDelete.expenseCategories.filter(
                (cat) => cat.category !== category
            );

        //step - 5 now save the updated data.
        await monthForTheExpenseCategoryToDelete.save();

        console.log("category deleted from expenses");
        return res
            .status(200)
            .json({ message: `${category} deleted from expenses` });
    } catch (error) {
        console.log("something went wrong with the server", error.message);
        return res.status(500).json({ error: error.message });
    }
};


//5-export json file

module.exports.exportSummary = async (req, res) => {
    try {
        let month = req.body?.month;
        if (!month) return res.status(400).json({ error: "Month is required" });

        month = month.toLowerCase().trim();

        const summaryData = await ExpenseModel.findOne({ month });

        if (!summaryData) {
            return res.status(404).json({ error: "No data found for this month" });
        }

        // Create a summary object
        const summary = {
            month: summaryData.month,
            income: summaryData.income,
            expenses: summaryData.expenseCategories,
            totalExpenses: summaryData.expenseCategories.reduce((sum, cat) => sum + cat.amount, 0),
            remainingBalance: summaryData.income - summaryData.expenseCategories.reduce((sum, cat) => sum + cat.amount, 0),
        };

      
        const fileName = `summary-${month}.json`;
        const filePath = path.join(__dirname, "../exports", fileName);

        fs.writeFileSync(filePath, JSON.stringify(summary, null, 2)); 

        return res.download(filePath, fileName, (err) => {
            if (err) {
                console.log("Download error:", err);
                return res.status(500).json({ error: "Failed to download file" });
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
};