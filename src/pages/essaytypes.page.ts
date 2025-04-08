import { expect, Page } from "@playwright/test";
import { Constants, Controls, Essays } from "../utils/constants";
import { EssayType } from "../selectors/essayTypeSelectors";

export class EssayPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private static readonly fields = [
        { name: EssayType.Cars, value: EssayType.EssayAboutCars },
        { name: EssayType.School, value: EssayType.EssayAboutSchool },
        { name: EssayType.Animals, value: EssayType.EssayAboutAnimals },
        { name: EssayType.Other, value: EssayType.EssayAboutOthers },
    ];

    public async goToNextPage() {
        const nextButton = this.page.getByText(EssayType.NextPageButton);
        await nextButton.scrollIntoViewIfNeeded();
        await nextButton.click({ force: true });
        await this.page.waitForLoadState();
    }

    /**
     * 
     * @param name 
     * @returns 
     */
    private getTextBoxByName(name: string) {
        return this.page.getByRole(Controls.TextBox, { name });
    }

    /**
     * 
     * @param name 
     * @returns 
     */
    private getCheckboxByName(name: string) {
        return this.page.getByRole(Controls.Checkbox, { name });
    }

    /**
     * 
     * @param essayType 
     */
    public async validateEssayInput(essayType: string) {
        const textbox = this.getTextBoxByName(essayType);
        await textbox.waitFor({ state: Constants.Visible });
        const tagName = await textbox.evaluate(node => node.tagName.toLowerCase());
        expect(tagName).toBe(Constants.TextArea);
    }

    /**
     * Check essay types
     */
    public async checkEssayTypes() {
        for (const field of EssayPage.fields) {
            const checkbox = this.getCheckboxByName(field.name);
            await checkbox.check();
            await this.validateEssayInput(field.value);
        }
    }

    /**
     * Clear checkbox
     */
    public async clearCheckbox() {
        const targetFields = [EssayPage.fields[0], EssayPage.fields[3]]
        for (const field of targetFields) {
            await this.getCheckboxByName(field.name).uncheck();
            await expect(this.getTextBoxByName(field.value)).toBeHidden();
        }
    }

    /**
     * Fll essay types
     */
    public async fillEssayTypes() {
        for (const field of Essays) {
            await this.getTextBoxByName(field.essayType).fill(field.value);
        }
    }
}