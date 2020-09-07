import { libs } from "../../pages/general.page";
import { util } from "chai";

describe("Honest food Sanity suite", () => {
  beforeAll(async () => {
    await libs.launch();
    await libs.goTo();
  });

  it("Checvk if table is rendered correctly", async () => {
    await libs.checkTable();
  });

  it("check for tree grids", async () => {
    await libs.checkgrids();
  });

  it(`check if user data is displayed correctly`, async () => {
    await libs.checkViewData(`Andrew`, `Tacoma`);
  });

  // it("Add product to cart and checkout", async () => {
  //   // assertions are available at utility libs level
  //   await libs.checkout();
  // });

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
