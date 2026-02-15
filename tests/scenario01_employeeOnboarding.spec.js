const { expect } = require('@playwright/test');
const { loginTest } = require('../fixtures/loginFixture');
const { excelRows } = require('../config/config');
const DataGenerator = require('../utils/dataGenerator');

const DashboardPage = require('../pages/DashboardPage');
const AddEmployeePage = require('../pages/AddEmployeePage');
const PersonalDetailsPage = require('../pages/PersonalDetailsPage');

const excel = require('../helpers/excelHelper');
const logger = require('../utils/logger');

loginTest(
  'Scenario 1: Multi-Step Employee Onboarding with Dynamic Navigation',
  async ({ page }) => {
    logger.info('=== TEST STARTED: Employee Onboarding ===');

    try {
      /* ---------- Test Data Rows ---------- */
      const employeeRow = excelRows.employee;
      const employeeLoginRow = excelRows.employeeLogin;
      const personalDetailsRow = excelRows.personalDetails;

      /* ---------- Read Excel Data ---------- */
      const employeeData = await excel.getRowData('EmployeeData', employeeRow);
      const employeeLoginData = await excel.getRowData(
        'EmployeeLoginData',
        employeeLoginRow
      );
      const personalDetailsData = await excel.getRowData(
        'PersonalDetails',
        personalDetailsRow
      );

      const firstName = DataGenerator.maybeMutate(employeeData[1], 'name');
      const middleName = employeeData[2];
      const lastName = DataGenerator.maybeMutate(employeeData[3], 'name');

      const loginUsername = DataGenerator.maybeMutate(employeeLoginData[1], 'username');
      const loginPassword = employeeLoginData[2];
      const loginStatus = employeeLoginData[3];

      const personalDetails = {
        License: personalDetailsData[1],
        LicenseExpiry: personalDetailsData[2],
        Nationality: personalDetailsData[3],
        MaritalStatus: personalDetailsData[4],
        DOB: personalDetailsData[5],
        Gender: personalDetailsData[6]
      };

      /* ---------- Page Objects ---------- */
      const dashboardPage = new DashboardPage(page);
      const addEmployeePage = new AddEmployeePage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);

      /* ---------- Navigation ---------- */
      logger.info('Navigating to Add Employee page');
      await dashboardPage.navigateToAddEmployee();

      await expect(
        page.getByRole('heading', { name: 'Add Employee' })
      ).toBeVisible();
      logger.info('ASSERTION PASSED: Add Employee page opened');

      /* ---------- Add Employee ---------- */
      await addEmployeePage.enterEmployeeName(
        firstName,
        middleName,
        lastName
      );

      const generatedEmployeeId =
        await addEmployeePage.getGeneratedEmployeeId();

      await excel.writeCell(
        'EmployeeData',
        employeeRow,
        4,
        generatedEmployeeId
      );

      logger.info(`Captured Employee ID: ${generatedEmployeeId}`);

      await addEmployeePage.uploadEmployeePhoto(
        'test-data/images/employee.jpg'
      );

      await addEmployeePage.enableCreateLoginDetails();
      await addEmployeePage.enterLoginCredentials(
        loginUsername,
        loginPassword
      );
      await addEmployeePage.selectStatus(loginStatus);

      /* ---------- Save Employee ---------- */
      await addEmployeePage.saveEmployee();

      /* Assertion: Redirect to profile page */
      await personalDetailsPage.verifyOnPersonalDetailsPage();
      logger.info('ASSERTION PASSED: Redirected to employee profile');

      /* ---------- Personal Details ---------- */
      await personalDetailsPage.verifyPersonalDetailsTabActive();
      logger.info('ASSERTION PASSED: Personal Details tab is active');

      await personalDetailsPage.fillPersonalDetails(personalDetails);

      /* Assertion: Success message */
      await personalDetailsPage.verifySaveSuccessToast();

      logger.info('=== TEST COMPLETED SUCCESSFULLY ===');
    } catch (error) {
      logger.error(`TEST FAILED: ${error.message}`);
      throw error;
    }
  }
);
