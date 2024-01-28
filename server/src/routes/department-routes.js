const { Router } = require("express");

const departmentController = require("../controllers/department-controller");

const departmentRouter = Router();

departmentRouter.get("/", departmentController.getDepartments);
// departmentRouter.get("/:id", departmentController.getDepartmentById);

// departmentRouter.post("/", departmentController.addDepartment);

// departmentRouter.put("/:id", departmentController.updateDepartment);

// departmentRouter.delete("/:id", departmentController.deleteDepartment);

module.exports = departmentRouter;