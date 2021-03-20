const Sequelize = require('sequelize');
var sequelize = new Sequelize('dbvnn8lp28ncgo', 'cpcdkzwwmopseh', 'b1760e58cb53553ec50f1f04e72457e67fb24c01b5335829ad3409e93083be9d', {
    host: 'ec2-52-7-115-250.compute-1.amazonaws.com',
    dialect: 'postgres',
    port:5432 ,
    dialectOptions: {
        ssl: true
    }
});

// define employee table
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false
});

// define department table
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false
});

Department.hasMany(Employee, {foreignKey: 'department'});

// export functions
module.exports = {
    // retrieve data from json files
    initialize: function() {
        return new Promise(function (resolve, reject) {
            sequelize.sync()
            .then(() => resolve("Successfully connected to database!"))
            .catch(() => reject("Uh-oh! Unable to connect to database!"))
        });
    },

    // return all employees
    getAllEmployees: function() {
        return new Promise(function (resolve, reject) {
            Employee.findAll({ raw: true })
            .then(function(data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("No Employees Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    },
    
    // return managers
    getManagers: function() {
        return new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    isManager: true
                },
                raw: true
            }).then(function(data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("No Employees Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    },
    
    // return departments
    getDepartments: function() {
        return new Promise(function (resolve, reject) {
            Department.findAll({ raw: true })
            .then(function(data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("No Departments Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    },

    getEmployeesByStatus: function(empStatus) {
        return new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    status: empStatus
                },
                raw: true
            }).then(function(data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("No Employees Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    },

    getEmployeesByDepartment: function(empDepartment) {
        return new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    department: empDepartment
                },
                raw: true
            }).then(function(data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("No Employees Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    },

    getEmployeesByManager: function(manager) {
        return new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    employeeManagerNum: manager
                },
                raw: true
            }).then(function(data) {
                if (data.length > 0) {
                    resolve(data);
                } else {
                    reject("No Employees Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    }, 

    getEmployeesByNum: function(empNum) {
        return new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    employeeNum: empNum
                },
                raw: true
            }).then(function(data) {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject("Employee Not Found")
                }
            }).catch(() => reject("No results returned!"))
        });
    },

    // NOTE: There's no data validation done.
    // In a real world scenario, data validation should be done on
    // both client and server side.
    addEmployee: function(employeeData) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var property in employeeData) {
            if (employeeData[property] == "")
                employeeData[property] = null;
        }

        return new Promise(function (resolve, reject) {
            Employee.create({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                hireDate: employeeData.hireDate,
                department: employeeData.department
            }).then(function() { 
                console.log("New entry created!");
                resolve();
            }).catch(function() {
                console.log("Unable to create new entry!");
                reject();
            });
        });
    },

    updateEmployee: function(employeeData) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var property in employeeData) {
            if (employeeData[property] == "")
                employeeData[property] = null;
        }
        
        return new Promise(function (resolve, reject) {
            Employee.update({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                hireDate: employeeData.hireDate,
                department: employeeData.department
            },{
                where: {
                    employeeNum: employeeData.employeeNum
                }
            }).then(function() { 
                console.log("Entry has been updated!");
                resolve();
            }).catch(function() {
                reject("Unable to update Employee!");
            });
        });
    },

    deleteEmployeeByNum: function(empNum) {
        return new Promise(function (resolve, reject){
            Employee.destroy({
                where: {
                    employeeNum: empNum
                }
            }).then(function(){
                console.log("Successfully removed employee from database!");
                resolve();
            }).catch(function() {
                reject("Unable to remove employee from database!");
            });
        });
    },

    addDepartment: function(departmentData) {
        for (var property in departmentData) {
            if (departmentData[property] == "")
                departmentData[property] = null;
        }

        return new Promise(function (resolve, reject) {
            Department.create({
                departmentName: departmentData.departmentName
            }).then(function() { 
                console.log("New department created!");
                resolve();
            }).catch(function() {
                console.log("Unable to create new department!");
                reject();
            });
        });
    },

    updateDepartment: function(departmentData) {
        for (var property in departmentData) {
            if (departmentData[property] == "")
                departmentData[property] = null;
        }

        return new Promise(function (resolve, reject) {
            Department.update({
                departmentName: departmentData.departmentName
            },{
                where: {
                    departmentId: departmentData.departmentId
                }
            }).then(function(){ 
                console.log("New department created!");
                resolve();
            }).catch(function(){
                reject("Unable to update department!");
            });
        });
    },

    getDepartmentById: function(depId) {
        return new Promise(function (resolve, reject) {
            Department.findAll({ 
                where: {
                    departmentId: depId
                },
                raw: true
            }).then(function(data) {
                if (data.length > 0) {
                    resolve(data[0]);
                } else {
                    reject("Department Not Found")
                }
            }).catch(() => reject("No results returned!"));
        });
    },

    deleteDepartmentById: function(depId) {
        return new Promise(function (resolve, reject){
            Department.destroy({
                where: {
                    departmentId: depId
                }
            }).then(function(){
                console.log("Successfully removed department from database!");
                resolve();
            }).catch(function() {
                reject("Unable to remove department from database!");
            });
        });
    }

}; // end module.exports