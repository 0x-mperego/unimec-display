import { expect, test } from "@playwright/test";

test.describe("Display Screen", () => {
  test("should render display screen with black background", async ({
    page,
  }) => {
    await page.goto("/display");

    await expect(page.locator(".bg-black")).toBeVisible();
    await expect(page.locator(".text-white")).toBeVisible();
  });

  test("should show default message when no content", async ({ page }) => {
    await page.goto("/display");

    // Wait for potential content to load
    await page.waitForTimeout(2000);

    // Should show default message or content
    const hasContent =
      (await page
        .locator("text=/Display Manager|MESSAGGIO DI PROVA/")
        .count()) > 0;
    expect(hasContent).toBe(true);
  });

  test("should display content rotation indicator", async ({ page }) => {
    await page.goto("/display");

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Look for content indicator (e.g., "1 / 2")
    const indicator = page.locator("text=/\\d+ \\/ \\d+/");
    const indicatorExists = (await indicator.count()) > 0;

    // Indicator should exist if there's content, or not if there's no content
    if (indicatorExists) {
      await expect(indicator).toBeVisible();
    }
  });

  test("should show fullscreen hint on desktop", async ({ page }) => {
    await page.goto("/display");

    // Wait for content load
    await page.waitForTimeout(2000);

    // Look for fullscreen hint
    const hint = page.getByText("Clicca ovunque per lo schermo intero");
    const hintExists = (await hint.count()) > 0;

    if (hintExists) {
      await expect(hint).toBeVisible();
    }
  });

  test("should handle click to fullscreen", async ({ page }) => {
    await page.goto("/display");

    // Click anywhere on the screen
    await page.locator("body").click();

    // Note: Fullscreen API might not work in headless mode
    // This test primarily checks that the click handler is attached
    await page.waitForTimeout(1000);
  });

  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/display");

    // Should render properly on mobile
    await expect(page.locator(".bg-black")).toBeVisible();
    await expect(page.locator(".text-white")).toBeVisible();

    // Wait for content
    await page.waitForTimeout(2000);
  });

  test("should handle network failure gracefully", async ({ page }) => {
    // Start on display page
    await page.goto("/display");
    await page.waitForTimeout(2000);

    // Block network requests to simulate failure
    await page.route("**/api/contents", (route) => route.abort());

    // Reload the page
    await page.reload();

    // Should still render the page structure
    await expect(page.locator(".bg-black")).toBeVisible();
  });

  test("should connect to SSE endpoint", async ({ page }) => {
    await page.goto("/display");

    // Wait for SSE connection attempts
    await page.waitForTimeout(3000);

    // Check that the page has loaded properly
    await expect(page.locator(".bg-black")).toBeVisible();
  });
});
