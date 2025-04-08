import { test as base, BrowserContext } from '@playwright/test';

type TestFixtures = {
    context: BrowserContext;
}

export const test = base.extend<TestFixtures>({
    context: async ({ browser }, use) => {
        const context = await browser.newContext(); // Create an isolated session
        await use(context);
        await context.close();
    }
});

export { expect } from '@playwright/test';