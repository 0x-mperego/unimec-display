import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.getByPlaceholder("Inserisci password admin").fill("M1ll1w0rm!");
    await page.getByRole("button", { name: "Accedi" }).click();
    await expect(page).toHaveURL("/admin");
  });

  test("should display dashboard header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Display Manager" })
    ).toBeVisible();
    // Note: subtitle was removed
    await expect(
      page.getByRole("button", { name: "Disconnetti" })
    ).toBeVisible();
  });

  test("should show display URL", async ({ page }) => {
    // Should show display URL (first occurrence)
    await expect(
      page.getByRole("link", { name: "Apri Display" })
    ).toBeVisible();
  });

  test("should display content library section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Libreria Contenuti" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Aggiungi Contenuto" })
    ).toBeVisible();
  });

  test("should show mobile layout on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile-specific elements should be visible
    await expect(
      page.getByRole("heading", { name: "Display Manager" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Aggiungi Contenuto" })
    ).toBeVisible();
  });

  test("should navigate to display page", async ({ page }) => {
    // Click on display URL or navigate manually
    await page.goto("/display");

    // Should load display screen
    await expect(page.locator(".bg-black")).toBeVisible();
    await expect(page.locator(".text-white")).toBeVisible();
  });
});
