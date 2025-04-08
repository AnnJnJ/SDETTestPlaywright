import { test, expect } from "../fixtures/test.Fixture";
import { EnvVariables, Extracurriculars } from '../utils/constants';
import { Activities } from "../selectors/actvitySelectors";
import { POMClass } from "../pages/pomclass.page";
import { SchoolInfo } from "../selectors/schoolInfoSelectors";

test("User Application", async ({ context }) => {
    const page = await context.newPage();
    const pomPage = new POMClass(page);

    console.info(EnvVariables.OrgUrl)
    await pomPage.NavigateTo(EnvVariables.OrgUrl);
    await page.waitForLoadState();

    // Sign in to the application
    const email = await pomPage.signinPage.signIn();
    await pomPage.signinPage.fillandSubmitAccountDetails();
    await pomPage.signinPage.fillPersonalDetails();
    await page.waitForLoadState();

    // Validate mandatory field for extracurricular activities
    await expect(page.getByText(Activities.ExtraCurricular).last()).toBeVisible();
    await pomPage.signinPage.goToNextPage();
    await expect(page.getByText(Activities.MandatoryField)).toBeVisible();

    // Add extracurricular activities
    await pomPage.activityPage.addMultipleActivityData(Extracurriculars, Extracurriculars.length);
    await page.waitForLoadState();

    // Add school information
    await expect(page.getByText(SchoolInfo.HighSchoolPage)).toBeVisible();
    await pomPage.schoolinfoPage.fillSchoolInfo();
    await page.waitForLoadState();

    // Add and validate essay types
    await pomPage.essayPage.checkEssayTypes();
    await pomPage.essayPage.clearCheckbox();
    await pomPage.essayPage.fillEssayTypes();
    await pomPage.essayPage.goToNextPage();

    // Validate the review page
     await pomPage.reviewPage.validatePages(email);

    const previewURl = page.url();

    // Submit the application
    await pomPage.reviewPage.submitApplication();

    await pomPage.NavigateTo(previewURl);
    await page.waitForLoadState();

    // Validate the edit button visibility
    await pomPage.reviewPage.validateEditVisibility();
});