const logger = require('../utils/logger');

class PersonalDetailsPage {
  constructor(page) {
    this.page = page;

    // Tabs
    this.personalDetailsTab = page.getByRole('tab', { name: 'Personal Details' });
    this.pageTitle = page.locator('.orangehrm-edit-employee-content h6',{ hasText: 'Personal Details' });

    // Inputs
    this.licenseNumberInput = page.locator('//label[text()="Driver\'s License Number"]/../following-sibling::div//input');
    this.licenseExpiryInput = this.licenseExpiryInput = page.locator('//label[text()="License Expiry Date"]/../following-sibling::div//input');

    this.dobInput = page.locator('//label[text()="Date of Birth"]/../following-sibling::div//input');

    // Dropdowns (dynamic / searchable)
    this.nationalityDropdown = page.locator('//label[text()="Nationality"]/../following-sibling::div//div[contains(@class,"oxd-select-text-input")]');

    // Radio Buttons
    this.genderRadioByValue = (value) =>
        this.page.locator(
            `//div[contains(@class,"gender-grouped-field")]` +
            `//input[@type="radio" and @value="${value}"]/following-sibling::span`
        );

    this.maritalStatusDropdown = page.locator('//label[text()="Marital Status"]/../following-sibling::div//div[contains(@class,"oxd-select-text-input")]');
    // Save Button
    this.saveButton = page.locator('.orangehrm-edit-employee-content form').first().getByRole('button', { name: 'Save' });
    this.successToast = page.locator('.oxd-toast.oxd-toast--success');
    this.successToastMessage = page.locator('.oxd-toast--success .oxd-text--toast-message');

  }

  /* ---------- Actions ---------- */

  async verifyPersonalDetailsTabActive() {
    await this.personalDetailsTab.waitFor({ state: 'visible' });
    await this.personalDetailsTab.evaluate(tab =>
      tab.classList.contains('oxd-tab--active')
    );
    logger.info('Personal Details tab is active');
  }

  async verifyOnPersonalDetailsPage() {
    await this.pageTitle.waitFor({ state: 'visible' });
    const titleText = await this.pageTitle.textContent();

    if (!titleText.includes('Personal Details')) {
        throw new Error(
        `Expected Personal Details page, but found: ${titleText}`
        );
    }

    logger.info('ASSERTION PASSED: On Personal Details page');
  }

  async enterLicenseNumber(license) {
    await this.licenseNumberInput.waitFor({ state: 'visible' });
    logger.info(`Entering license number: ${license}`);
    await this.licenseNumberInput.fill(license);
  }

  async selectLicenseExpiryDate(date) {
    logger.info(`Selecting license expiry date: ${date}`);
    await this.licenseExpiryInput.fill(date);
    await this.page.keyboard.press('Enter');
  }

  async selectNationality(nationality) {
    logger.info(`Selecting nationality: ${nationality}`);
    await this.nationalityDropdown.click();
    await this.page.getByRole('option', { name: nationality }).click();
  }

  async selectMaritalStatus(status) {
    logger.info(`Selecting marital status: ${status}`);
    await this.maritalStatusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
  }


  async selectDateOfBirth(dob) {
    logger.info(`Selecting DOB: ${dob}`);
    await this.dobInput.fill(dob);
    await this.page.keyboard.press('Tab');
  }

  async selectGender(gender) {
    logger.info(`Selecting gender: ${gender}`);

    const genderValue = gender.toLowerCase() === 'male' ? '1' : '2';

    await this.genderRadioByValue(genderValue).click();
  }
  
  async savePersonalDetails() {
    logger.info('Saving personal details');
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.click();
  }

  async verifySaveSuccessToast() {
    logger.info('Verifying success toast');

    // Toast appears fast but disappears fast → small timeout
    await this.successToast.waitFor({ state: 'visible', timeout: 5000 });

    const message = (await this.successToastMessage.textContent()).trim();

    if (!message.toLowerCase().includes('successfully')) {
        throw new Error(`Unexpected toast message: "${message}"`);
    }

    logger.info(`ASSERTION PASSED: Success toast shown → "${message}"`);
  }

  /* ---------- Composite Action ---------- */

  async fillPersonalDetails(data) {
    await this.verifyPersonalDetailsTabActive();
    await this.enterLicenseNumber(data.License);
    await this.selectLicenseExpiryDate(data.LicenseExpiry);
    await this.selectNationality(data.Nationality);
    await this.selectMaritalStatus(data.MaritalStatus);
    await this.selectDateOfBirth(data.DOB);
    await this.selectGender(data.Gender);
    await this.savePersonalDetails();
  }
}

module.exports = PersonalDetailsPage;
