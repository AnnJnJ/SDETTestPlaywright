import { Page } from "@playwright/test";
import { Constants, Controls, HighSchoolInfo } from "../utils/constants";
import { SchoolInfo } from "../selectors/schoolInfoSelectors";

export class SchoolInfoPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async goToNextPage() {
        const nextButton = this.page.getByText(SchoolInfo.NextPageButton);
        await nextButton.scrollIntoViewIfNeeded();
        await nextButton.click({ force: true });
        await this.page.waitForLoadState();
    }

    public async uploadFile() {
        const fileChooser = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.page.getByRole(Controls.Button, { name: SchoolInfo.UploadTranscript }).click()
        ]);
        await fileChooser[0].setFiles(Constants.FilePath);
        await this.page.getByText(HighSchoolInfo.FileName).waitFor({ state: Constants.Visible });
    }

    public async fillSchoolInfo() {
        const fields = [
            { name: SchoolInfo.SchoolName, value: HighSchoolInfo.SchoolName },
            { name: SchoolInfo.SchoolStreetAddress, value: HighSchoolInfo.StreetAddress },
            { name: SchoolInfo.SchoolCity, value: HighSchoolInfo.City },
            { name: SchoolInfo.SchoolState, value: HighSchoolInfo.State },
            { name: SchoolInfo.SchoolZipCode, value: HighSchoolInfo.ZipCode },
            { name: SchoolInfo.SchoolGPA, value: HighSchoolInfo.GPA },
            { name: SchoolInfo.SchoolGraduationYear, value: HighSchoolInfo.GraduationYear },
        ];

        for (const field of fields) {
            const input = this.page.getByRole(Controls.TextBox, { name: field.name }).first();
            await input.waitFor({ state: Constants.Visible });
            await input.fill(field.value);

            if ([SchoolInfo.SchoolState].includes(field.name)) {
                let option = this.page.getByRole(Controls.Option, { name: field.value });
                await option.waitFor({ state: 'visible' });
                await option.click();
            }

            if ([SchoolInfo.SchoolGraduationYear].includes(field.name)) {
                await this.page.keyboard.press(Controls.Enter);
            }
        }
        await this.uploadFile();
        await this.goToNextPage();
    }
}