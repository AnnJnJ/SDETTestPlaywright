import { Page } from "@playwright/test";
import { Constants, Controls } from "../utils/constants";
import { Activities } from "../selectors/actvitySelectors";

export class ActivityPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async goToNextPage() {
        const nextButton = this.page.getByText(Activities.NextPageButton);
        await nextButton.scrollIntoViewIfNeeded();
        await nextButton.click({ force: true });
        await this.page.waitForLoadState();
    }

    /**
     * Open the modal
     */
    public async openModal() {
        const addEntry = this.page.getByRole(Controls.Button, { name: Activities.AddEntry }).last();
        await addEntry.waitFor({ state: Constants.Visible });
        await addEntry.click();
    }

    /**
     * Add an entry
     */
    public async submitForm() {
        const addActivity = this.page.getByRole(Controls.Button, { name: Activities.AddActivity }).last();
        await addActivity.click();
    }

    /**
     * 
     * @param data 
     * Fill the form
     */
    public async fillForm(data: any) {
        const activities = this.page.getByRole(Controls.TextBox, { name: Activities.ExtraCurricularActivities });
        await activities.fill(data.activity);
        await this.page.getByRole(Controls.TextBox, { name: Activities.TotalYears })
            .fill(data.totalYears.toString());
        await this.page.getByRole(Controls.TextBox, { name: Activities.LeadershipRole })
            .fill(data.recognitions);
        await this.page.getByRole(Controls.TextBox, { name: Activities.InvolvementDescription })
            .fill(data.involvement);
    }

    /**
     * 
     * @param entries 
     * @param count 
     */
    public async addMultipleActivityData(entries: any[], count: number) {
        for (let i = 0; i < count; i++) {
            await this.openModal();
            await this.fillForm(entries[i]);
            await this.submitForm();
        }

        await this.goToNextPage();
    }
}