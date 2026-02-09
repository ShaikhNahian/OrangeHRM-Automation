const ExcelJS = require('exceljs');
const { excelPath } = require('../config/config');

class ExcelHelper {
  async getRowData(sheetName, rowNumber) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const sheet = workbook.getWorksheet(sheetName);
    return sheet.getRow(rowNumber).values;
  }

  async writeCell(sheetName, row, col, value) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    const sheet = workbook.getWorksheet(sheetName);
    sheet.getRow(row).getCell(col).value = value;
    await workbook.xlsx.writeFile(excelPath);
  }
}

module.exports = new ExcelHelper();
 