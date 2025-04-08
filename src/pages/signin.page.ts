import { Page } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { Constants, Controls, PersonalInfo } from "../utils/constants";
import { Signin } from "../selectors/signinSelectors";
import { generateSecurePassword } from "../utils/helper";

export class SigninPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Sign in to the application
     */
    public async signIn() {
        const email = `${Constants.emailStartName}${uuidv4()}@${Constants.emailDomain}`;

        // Register a new User
        const signIn = this.page.locator(Signin.SignIn);
        await signIn.waitFor({ state: Constants.Visible });
        await signIn.click({force: true});
        const emailInput = this.page.getByPlaceholder(Signin.EmailAddress);
        await emailInput.waitFor();
        await emailInput.fill(email);
        await this.page.locator(Signin.NextButton).click();

        return email;
    }

    /**
     * Fill and submit account details
     */
    public async fillandSubmitAccountDetails() {
        await this.page.waitForLoadState();

        // Fill the first and last Name 
        const fisrtName = this.page.getByLabel(Signin.FirstNameInput);
        await fisrtName.waitFor({ state: Constants.Visible });
        await fisrtName.fill(PersonalInfo.FirstName);
        const lastName = this.page.getByLabel(Signin.LastNameInput);
        await lastName.waitFor({ state: Constants.Visible });
        await lastName.fill(PersonalInfo.LastName);

        // Fill the phone number
        const phone = this.page.getByPlaceholder(Signin.PhonePlaceHolder);
        await phone.waitFor({ state: Constants.Visible });
        // await phone.clear();
        await phone.fill(PersonalInfo.PhoneNumber);

        // Generate and fill a secure password
        const createPassword = this.page.getByLabel(Signin.CreatePassword);
        await createPassword.waitFor({ state: Constants.Visible });
        await createPassword.fill(generateSecurePassword());

        // Check the confirmation checkbox
        await this.page.getByLabel(Signin.ConfirmCheckBox).check();

        // Click the Submit button
        await this.page.locator(Signin.Submit).click();
    }

    /**
     * Go to the next page
     */
    
    public async goToNextPage(){
        await this.page.getByText(Signin.NextPageButton).click();
    }

    /**
     * Fill personal details
     */
    public async fillPersonalDetails(){
        await this.page.waitForLoadState();

        // Fill the street address
        const streetAddress = this.page.getByPlaceholder(Signin.StreetAddress);
        await streetAddress.waitFor({ state: Constants.Visible });
        await streetAddress.fill(PersonalInfo.StreetAddress);

        // Fill the state
        const state = this.page.getByPlaceholder(Signin.State);
        await state.waitFor({ state: Constants.Visible });
        await state.fill(PersonalInfo.State);
        let option = this.page.getByRole(Controls.Option, { name: PersonalInfo.State });
        await option.waitFor({ state: 'visible' });
        await option.click();

        // Fill the city
        const city = this.page.getByPlaceholder(Signin.City);
        await city.waitFor({ state: Constants.Visible });
        await city.fill(PersonalInfo.City);

        // Fill the zip code
        const zipCode = this.page.getByPlaceholder(Signin.ZipCode);
        await zipCode.waitFor({ state: Constants.Visible });
        await zipCode.fill(PersonalInfo.ZipCode);

        // Fill the country
        const country = this.page.getByPlaceholder(Signin.Country);
        await country.waitFor({ state: Constants.Visible });
        await country.fill(PersonalInfo.Country);
        option = this.page.getByRole(Controls.Option, { name: PersonalInfo.Country });
        await option.waitFor({ state: 'visible' });
        await option.click();

        // Click the Next Page button
        await this.goToNextPage();
    }
}