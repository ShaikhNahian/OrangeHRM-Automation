const logger = require('../utils/logger');

class DashboardPage {
  constructor(page) {
    this.page = page;

    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.addEmployeeMenu = page.getByRole('button', { name: ' Add ' });
  }

  async navigateToPIM() {
    logger.info('Navigating to PIM module');
    await this.pimMenu.click();
  }

  async navigateToAddEmployee() {
    await this.navigateToPIM();
    logger.info('Navigating to Add Employee page');
    await this.addEmployeeMenu.waitFor({ state: 'visible' });
    await this.addEmployeeMenu.click();
  }
}

module.exports = DashboardPage;