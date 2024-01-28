const pool = require("../../postgres-db");
const departmentQueries = require("../queries/department-queries");

const getDepartments = (req, res) => {
    pool.query(departmentQueries.getDepartments, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getDepartments,
}