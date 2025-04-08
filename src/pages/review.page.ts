import { expect, Locator, Page } from "@playwright/test"
import { PersonalInfo, Extracurriculars, HighSchoolInfo, Essays, Controls } from "../utils/constants"
import { Signin } from "../selectors/signinSelectors";
import { SchoolInfo } from "../selectors/schoolInfoSelectors";
import { EssayType } from "../selectors/essayTypeSelectors";
import { ReviewData } from "../selectors/reviewSelectors";

export class ReviewPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async getBytext() {
        return
    }

    private async validateField(item: Locator, label: string, value: string) {
        const actualLabel = await item.locator('p').nth(0).textContent();
        expect(actualLabel?.trim()).toBe(label);

        const actualValue = await item.locator('p').nth(1).textContent();
        expect(actualValue?.trim() || "").toBe(value);
    }


    /**
     * Validate the personal information
     * @param email 
     */
    public async validatePersonalInfo(email: string) {
        const fieldsToValidate = [
            { label: Signin.FirstNameInput, expected: PersonalInfo.FirstName },
            { label: Signin.LastNameInput, expected: PersonalInfo.LastName },
            { label: Signin.EmailAddress, expected: email },
            { label: ReviewData.StreetAddress, expected: PersonalInfo.StreetAddress },
            { label: ReviewData.AdditionalStreetAddress, expected: "" },
            { label: ReviewData.State, expected: PersonalInfo.State },
            { label: ReviewData.City, expected: PersonalInfo.City },
            { label: ReviewData.ZipCode, expected: PersonalInfo.ZipCode },
            { label: ReviewData.Country, expected: PersonalInfo.Country },
        ];

        const listItems = this.page.locator(ReviewData.ListItems);

        for (const [index, field] of fieldsToValidate.entries()) {
            const item = listItems.nth(index);
            await this.validateField(item, field.label, field.expected);
        }
    }

    public async validatePages(email: string) {
        const pagesToValidate = [
            { pageLabel: "Lets get to know you" },
            { pageLabel: "Extra curricular activities" },
            { pageLabel: "Table Tennis" },
            { pageLabel: "Karate" },
            { pageLabel: "Swimming" },
            { pageLabel: "Skating" },
            { pageLabel: "High school information" },
            { pageLabel: "Essay" }
        ];

        const accordionControls = this.page.locator(ReviewData.AccordionControl);
        const expandedContentSections = this.page.locator(ReviewData.AccordionContent);
        for (let i = 0; i < pagesToValidate.length; i++) {
            const pages = pagesToValidate[i];

            // Open the accordion section
            await accordionControls.nth(i).click();

            if (pages.pageLabel === "Lets get to know you") {
                await this.validatePersonalInfo(email);
            }

            if (["Extra curricular activities", "Table Tennis", "Karate", "Swimming", "Skating"].includes(pages.pageLabel)) {
                if (i === 1) {
                    i = i + 1;
                    await accordionControls.nth(i).click();
                }
                const section = expandedContentSections.nth(i);
                await expect(section).toBeVisible();
                const activity = Extracurriculars[i - 2];
                await this.validateExtraCurricularActivities(section, activity);
            }

            if (pages.pageLabel === "High school information") {
                const section = expandedContentSections.nth(i);
                await expect(section).toBeVisible();
                await this.validateHighSchoolInfo(section);
            }

            if (pages.pageLabel === "Essay") {
                const section = expandedContentSections.nth(i);
                await expect(section).toBeVisible();
                await this.validateEssays(section);
            }
        }
    }

    /**
     * Validate the extra curricular activities
     */
    public async validateExtraCurricularActivities(section: Locator, activity: any) {
        await expect(section.getByText(activity.activity).first()).toBeVisible();
        await expect(section.getByText(activity.totalYears.toString()).first()).toBeVisible();
        await expect(section.getByText(activity.recognitions).first()).toBeVisible();
        await expect(section.getByText(activity.involvement).first()).toBeVisible();
    }

    /**
     * Validate the high school information
     */
    public async validateHighSchoolInfo(section: Locator) {
        const fieldsToValidate = [
            { label: SchoolInfo.SchoolName, expected: HighSchoolInfo.SchoolName },
            { label: SchoolInfo.SchoolStreetAddress, expected: HighSchoolInfo.StreetAddress },
            { label: SchoolInfo.SchoolAdditionalStreetAddress, expected: "" },
            { label: SchoolInfo.SchoolCity, expected: HighSchoolInfo.City },
            { label: SchoolInfo.SchoolState, expected: HighSchoolInfo.State },
            { label: SchoolInfo.SchoolZipCode, expected: HighSchoolInfo.ZipCode },
            { label: SchoolInfo.SchoolGPA, expected: HighSchoolInfo.GPA },
            { label: SchoolInfo.SchoolGraduationYear, expected: HighSchoolInfo.GraduationDate },
        ];

        const listItems = section.locator(ReviewData.ListItems);

        for (const [index, field] of fieldsToValidate.entries()) {
            const item = listItems.nth(index);
            const actualLabel = await item.locator('p').first().textContent();
            expect(actualLabel?.trim()).toBe(field.label);

            if (field.label === SchoolInfo.SchoolGPA) {
                const gpaValue = await item.locator('p').nth(1).textContent();
                expect(parseFloat(gpaValue?.trim() || "")).toBe(parseFloat(field.expected));
            }
            else {
                const actualValue = await item.locator('p').nth(1).textContent(); // Assuming value is second <p>
                expect(actualValue?.trim() || "").toBe(field.expected);
            }
        }

        // File validation
        await expect(this.page.getByRole(Controls.Button, { name: HighSchoolInfo.FileName })).toBeVisible();
    }

    /**
     * Validate the essay types
     */
    public async validateEssays(section: Locator) {
        const essaysToValidate = Essays.map(essay => ({
            label: EssayType.EssayTypeReceived,
            type: essay.essayType,
            expected: essay.value
        }));
        const expectedTypes = [EssayType.School, EssayType.Animals];

        const essayItems = section.locator(ReviewData.ListItems);

        for (const [index, essay] of essaysToValidate.entries()) {
            const item = essayItems.nth(index);

            // Validate the label
            const actualLabel = await item.locator('p').first().textContent();
            expect(actualLabel?.trim()).toBe(essay.label);

            // Validate the essay type
            const typeText = await item.locator('p').nth(1).textContent();
            const matches = expectedTypes.some(expected =>
                typeText?.trim().includes(expected)
            );
            expect(matches).toBe(true);
        }
    }

    /**
     * Submit the application
     */
    public async submitApplication() {
        await this.page.getByRole(Controls.Button, { name: ReviewData.Submit }).click();
        await expect(this.page.getByText(ReviewData.ApplicationSubmit).first()).toBeVisible();
        await this.page.waitForLoadState();
    }

    /**
     * Validate the edit visibility
     */
    public async validateEditVisibility() {
        await expect(this.page.getByRole(Controls.Button, { name: ReviewData.PersonalinfoEdit })).toBeHidden();
        await expect(this.page.getByRole(Controls.Button, { name: ReviewData.ExtraCurricularEdit })).toBeHidden();
        await expect(this.page.getByRole(Controls.Button, { name: ReviewData.HighSchoolInfoEdit })).toBeHidden();
        await expect(this.page.getByRole(Controls.Button, { name: ReviewData.EssayEdit })).toBeHidden();
    }
}