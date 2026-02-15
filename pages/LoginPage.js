const logger = require('../utils/logger');

class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open() {
    logger.info('Opening login page');
    await this.page.goto('/web/index.php/auth/login');
  }

  async enterUsername(username) {
    logger.info(`Entering username: ${username}`);
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    logger.info('Entering password');
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    logger.info('Clicking Login button');
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.open();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}

module.exports = LoginPage;
