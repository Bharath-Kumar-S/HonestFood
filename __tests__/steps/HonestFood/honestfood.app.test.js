import { libs } from "../../pages/general.page";

describe("Honest food Sanity suite", () => {
  beforeAll(async () => {
    await libs.launch();
    await libs.goTo();
  });

  it("Select mamacita brand", async () => {
    // assertions are available at utility libs level
    await libs.selectBrand("mamacita");
  });

  it("Add product to cart and checkout", async () => {
    // assertions are available at utility libs level
    await libs.checkout();
  });

  afterEach(async () => {
    console.log(
      "Test",
      jasmine["currentTest"].fullName,
      "failed",
      !!jasmine["currentTest"].failedExpectations.length
    );
    if (!!jasmine["currentTest"].failedExpectations.length) {
      const screenshotBuffer = await page.screenshot();
      await reporter.addAttachment(
        jasmine["currentTest"].fullName,
        screenshotBuffer,
        "image/png"
      );
    }
  });

  afterAll(async () => {
    await libs.tearDown();
  });
});
