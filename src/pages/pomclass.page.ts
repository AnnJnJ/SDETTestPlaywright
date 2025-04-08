import { Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { SigninPage } from "./signin.page";
import { ActivityPage } from "./activity.page";
import { EssayPage } from "./essaytypes.page";
import { SchoolInfoPage } from "./schoolinfo.page";
import { ReviewPage } from "./review.page";

export class POMClass extends BasePage {
    constructor(public readonly page: Page) {
        super(page);
        this.page = page;
      }

      public get signinPage(): SigninPage {
        return new SigninPage(this.page);
      }

      public get activityPage(): ActivityPage {
        return new ActivityPage(this.page);
      }

      public get essayPage(): EssayPage {
        return new EssayPage(this.page);
      }

      public get schoolinfoPage(): SchoolInfoPage {
        return new SchoolInfoPage(this.page);
      }

      public get reviewPage(): ReviewPage {
        return new ReviewPage(this.page);
      }
}