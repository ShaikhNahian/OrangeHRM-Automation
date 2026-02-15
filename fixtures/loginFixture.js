const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const excel = require('../helpers/excelHelper');
const logger = require('../utils/logger');

exports.loginTest = test.extend({
  page: async ({ page }, use) => {
    logger.info('Logging into application');
    const loginData = await excel.getRowData('LoginData', 2);

    const loginPage = new LoginPage(page);
    await loginPage.login(loginData[1], loginData[2]);

    await use(page);
  }
});