const logger = require('../utils/logger');

class AddEmployeePage {
  constructor(page) {
    this.page = page;

    // Employee Info
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');

    this.employeeIdInput = page.locator(
      '//label[text()="Employee Id"]/../following-sibling::div/input'
    );

    // Photo
    this.photoUploadInput = page.locator('input[type="file"]');

    // Create Login
    this.createLoginToggle = page.locator('.oxd-switch-input');

    // Login Details
    this.loginUsernameInput = page.locator(
      '//label[text()="Username"]/../following-sibling::div/input'
    );

    this.loginPasswordInput = page.locator(
      '//label[text()="Password"]/../following-sibling::div/input'
    );

    this.confirmPasswordInput = page.locator(
      '//label[text()="Confirm Password"]/../following-sibling::div/input'
    );

    this.statusRadio = (status) =>
        page.getByLabel(status, { exact: true });

    // Save
    this.saveButton = page.getByRole('button', { name: 'Save' });

    //Error messages
    this.employeeIdExistsError = page.locator(
      '//label[text()="Employee Id"]/ancestor::div[contains(@class,"oxd-input-group")]//span[contains(@class,"oxd-input-field-error-message")]'
    );
  }

  //Employee Basic Info

  async enterEmployeeName(first, middle, last) {
    logger.info('Entering employee name');
    await this.firstNameInput.fill(first);
    await this.middleNameInput.fill(middle);
    await this.lastNameInput.fill(last);
  }

  async getGeneratedEmployeeId() {
    const empId = await this.employeeIdInput.inputValue();
    logger.info(`Captured Employee ID: ${empId}`);
    return empId;
  }

  async uploadEmployeePhoto(imagePath) {
    logger.info('Uploading employee photo');
    await this.photoUploadInput.setInputFiles(imagePath);
  }

  //Login Details

  async enableCreateLoginDetails() {
    logger.info('Enabling Create Login Details');
    await this.createLoginToggle.click();
  }

  async enterLoginCredentials(username, password) {
    logger.info(`Entering employee login username: ${username}`);
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async selectStatus(status) {
    logger.info(`Selecting status: ${status}`);
    await this.statusRadio(status).check();
  }

  //Save 

  async saveEmployee() {
    await this.saveButton.click();
    logger.info('Saving employee');
    const duplicate = await this.employeeIdExistsError.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    if (duplicate){
      logger.warn('OrangeHRM known Bug: Duplicate Employee ID detected, retrying with cleared ID');
      await this.employeeIdInput.click();
      await this.employeeIdInput.press('Control+A');
      await this.employeeIdInput.press('Backspace');
      await this.saveButton.click();
    }
  }
  
}

module.exports = AddEmployeePage;
