const { chromium } = require("playwright");
const { action } = require("../utilities/action");
const { checks } = require("../utilities/check");
const { data } = require("../data/constants");

const locator = {
  brand: {
    mamacita: `.right > .banner--link[href="/speisekarte/mamacita/wallenstein/"]`,
  },
  checkout: {
    addrs: `[id="address-input"]`,
    toMenu: `.form-address input[type="submit"]`,
    firstProduct: `[name="sAddToBasket"]`,
    addToCart: `.content--cart-button`,
  },
};

exports.libs = {
  launch: async () => {
    return new Promise(async (resolve, reject) => {
      browser = process.env.npm_config_brw
        ? await chromium.launch({
            headless: false,
            args: ["--ignore-certificate-errors"],
          })
        : await chromium.launch();
      context = await browser.newContext();
      page = await context.newPage();
      page.on("dialog", async (dialog) => {
        // console.log(dialog.message());
        await dialog.accept();
      });
      return resolve();
    });
  },
  tearDown: async () => {
    return new Promise(async (resolve, reject) => {
      if (!page.isClosed()) {
        browser.close();
      }
      return resolve();
    });
  },
  goTo: async () => {
    const { URL } = data.portal;
    await action.goto(URL);
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US",
    });
  },
  selectBrand: async (type) => {
    const { mamacita } = locator.brand;
    const { pass, user, alertmessage } = data.formData;
    switch (String(type)) {
      case `mamacita`:
        //assertion
        await checks.visible(mamacita);
        await action.click(mamacita);
        break;
    }
  },
  checkout: async () => {
    const { addrs, toMenu, firstProduct, addToCart } = locator.checkout;
    const { address } = data.formData;
    return new Promise(async (resolve, reject) => {
      await action.fill(addrs, address);
      await action.click(toMenu);
      await page.waitForNavigation({
        waitUntil: "domcontentloaded",
      });
      await action.click(firstProduct);
      await action.click(addToCart);
      await page.waitFor(10000);
      return resolve();
    });
  },
  checkBoxes: async () => {
    const { fcheck, link, scheck } = locator.checkboxes;
    await action.click(link);

    //assertion
    await checks.checked(fcheck, false);
    await checks.checked(scheck, true);

    await action.check(fcheck);
    await action.uncheck(scheck);

    //assertion
    await checks.checked(fcheck, true);
    await checks.checked(scheck, false);
  },
};
