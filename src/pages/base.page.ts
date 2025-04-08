import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async ClosePage() {
    await this.page.close();
  }

  public Page() {
    return this.page;
  }

  public async NavigateTo(orgUrl: string) {
    this.page.goto(orgUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000});
  }
}