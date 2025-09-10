import { expect, test } from "@playwright/test";

test.describe("Theme Switching", () => {
  test("should have theme toggle on login page", async ({ page }) => {
    await page.goto("/login");

    // Theme toggle button should be visible
    await expect(
      page.getByRole("button", { name: "Toggle theme" })
    ).toBeVisible();
  });

  test("should have theme toggle on dashboard", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByPlaceholder("Inserisci password admin").fill("M1ll1w0rm!");
    await page.getByRole("button", { name: "Accedi" }).click();
    await expect(page).toHaveURL("/admin");

    // Theme toggle should be visible in dashboard header
    await expect(
      page.getByRole("button", { name: "Toggle theme" })
    ).toBeVisible();
  });

  test("should open theme dropdown menu", async ({ page }) => {
    await page.goto("/login");

    // Click theme toggle
    await page.getByRole("button", { name: "Toggle theme" }).click();

    // Dropdown menu should appear with theme options
    await expect(page.getByRole("menuitem", { name: "Light" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Dark" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "System" })).toBeVisible();
  });

  test("should apply theme changes", async ({ page }) => {
    await page.goto("/login");

    // Open theme menu and select dark mode
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // Wait for theme to apply
    await page.waitForTimeout(100);

    // Check if dark theme is applied (html should have 'dark' class)
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");
  });

  test("should persist theme preference", async ({ page }) => {
    await page.goto("/login");

    // Set dark theme
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await page.waitForTimeout(100);

    // Reload page
    await page.reload();

    // Theme should still be dark
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");
  });
});
