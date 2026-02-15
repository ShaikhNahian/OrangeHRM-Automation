require('dotenv').config();

module.exports = {
  url: process.env.BASE_URL,
  excelPath: 'test-data/excel/testData.xlsx',
  excelRows: {
    employee: Number(process.env.EMPLOYEE_DATA_ROW || 2),
    employeeLogin: Number(process.env.EMPLOYEE_LOGIN_DATA_ROW || 2),
    personalDetails: Number(process.env.PERSONAL_DETAILS_ROW || 2)
  },
  dataMutation: {
    enabled: process.env.USE_UNIQUE_DATA === 'true'
  }
};
 