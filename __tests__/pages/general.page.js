const { chromium } = require("playwright");
const { action } = require("../utilities/action");
const { checks } = require("../utilities/check");
const { data } = require("../data/constants");
const { check } = require("prettier");

const locator = {
  table: {
    headers: {
      fname: `//*[contains(text(),"FirstName")]`,
      lname: `//*[contains(text(),"LastName")]`,
      title: `//*[@role="columnheader"]//*[contains(text(),"Title")]`,
      contents: `[id="contenttabletreeGrid"]`,
      databtn: `[id="btn"]`,
    },
    grid: {
      firstgrid: `td[role="gridcell"]`,
      treegrid: `[id="row1treeGrid"]`,
      userinfo: `[id="listitem0listBoxSelected"]`,
      databtn: `[id="btn"]`,
    },
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
    let title = await page.title();
    await checks.compareTextIgnorcase(title, `Employees from`);
  },
  checkTable: async () => {
    const { fname, lname, title, contents, databtn } = locator.table.headers;
    await checks.visible(fname);
    await checks.visible(lname);
    await checks.visible(title);
    await checks.visible(contents);
    await checks.visible(databtn);
  },
  checkgrids: async () => {
    const { firstgrid, treegrid } = locator.table.grid;
    await checks.visible(treegrid);
    await action.click(firstgrid);
    await checks.visible(treegrid, true);
  },
  checkViewData: async (name, location) => {
    const { firstgrid, userinfo, databtn } = locator.table.grid;
    await action.click(`.jqx-tree-grid-checkbox`);
    await action.click(databtn);
    let info = await action.getText(userinfo);
    await checks.compareTextIgnorcase(info, `${name} is from ${location}`);
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
