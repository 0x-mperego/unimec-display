import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login form", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Display Manager" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Accedi" })).toBeVisible();
    await expect(
      page.getByPlaceholder("Inserisci password admin")
    ).toBeVisible();
  });

  test("should show error for invalid password", async ({ page }) => {
    await page.goto("/login");

    await page
      .getByPlaceholder("Inserisci password admin")
      .fill("wrongpassword");
    await page.getByRole("button", { name: "Accedi" }).click();

    await expect(page.getByText("Password non valida")).toBeVisible();
  });

  test("should login successfully with correct password", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("Inserisci password admin").fill("M1ll1w0rm!");
    await page.getByRole("button", { name: "Accedi" }).click();

    // Should redirect to admin dashboard
    await expect(page).toHaveURL("/admin");
    await expect(
      page.getByRole("heading", { name: "Display Manager" })
    ).toBeVisible();
    // Note: subtitle was removed
  });

  test("should redirect to login when accessing protected route without auth", async ({
    page,
  }) => {
    await page.goto("/admin");

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });

  test("should logout successfully", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByPlaceholder("Inserisci password admin").fill("M1ll1w0rm!");
    await page.getByRole("button", { name: "Accedi" }).click();
    await expect(page).toHaveURL("/admin");

    // Logout
    await page.getByRole("button", { name: "Disconnetti" }).click();
    await expect(page).toHaveURL("/login");
  });
});
