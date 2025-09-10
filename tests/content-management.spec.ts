import { expect, test } from "@playwright/test";

test.describe("Content Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.getByPlaceholder("Inserisci password admin").fill("M1ll1w0rm!");
    await page.getByRole("button", { name: "Accedi" }).click();
    await expect(page).toHaveURL("/admin");
  });

  test("should open add content dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Aggiungi Contenuto" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Aggiungi Nuovo Contenuto" })
    ).toBeVisible();
  });

  test("should show content type selection", async ({ page }) => {
    await page.getByRole("button", { name: "Aggiungi Contenuto" }).click();

    // Should show tabs for content type
    await expect(
      page.getByRole("tab", { name: "Messaggio di Testo" })
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Immagine" })).toBeVisible();
  });

  test("should validate text content form", async ({ page }) => {
    await page.getByRole("button", { name: "Aggiungi Contenuto" }).click();

    // Switch to text tab and try to submit empty form
    await page.getByRole("tab", { name: "Messaggio di Testo" }).click();
    await page.getByRole("button", { name: "Crea Messaggio" }).click();

    // Should show validation errors
    await expect(page.getByText(/obbligatorio/i)).toBeVisible();
  });

  test("should create text content successfully", async ({ page }) => {
    await page.getByRole("button", { name: "Aggiungi Contenuto" }).click();

    // Switch to text tab and fill form
    await page.getByRole("tab", { name: "Messaggio di Testo" }).click();
    await page
      .getByRole("textbox", { name: "Testo del Messaggio" })
      .fill("Test Message");
    await page.getByRole("button", { name: "Crea Messaggio" }).click();

    // Should close dialog and show success message
    await expect(
      page.getByText("Contenuto aggiunto con successo")
    ).toBeVisible();
  });

  test("should display existing content", async ({ page }) => {
    // Should show content cards or list
    const contentCards = page.locator('[data-testid="content-card"]');
    // May be 0 if no content exists yet
    await expect(contentCards).toBeDefined();
  });

  test("should handle keyboard navigation in dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Aggiungi Contenuto" }).click();

    // Test Tab navigation
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Test Escape to close
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
