const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const excel = require('../helpers/excelHelper');
const logger = require('../utils/logger');

exports.loginTest = test.extend({
  page: async ({ page }, use) => {
    logger.info('Logging into application');
    const loginData = await excel.getRowData('LoginData', 2);
    const loginCredentials = {
      username : loginData[1],
      password : loginData[2]
    };

    const loginPage = new LoginPage(page);
    await loginPage.login(loginCredentials.username, loginCredentials.password);

    await use(page);
  }
});