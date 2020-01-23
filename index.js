const fs = require("fs");
var AxeBuilder = require("axe-webdriverjs");
var { Builder, By, Key, until } = require("selenium-webdriver");

(async function example() {
  let violations = {};
  let pages = [
    "page1player1name",
    "page2player1mascot",
    "page3player2name",
    "page4player2mascot",
    "page5firstWelcomeScreen"
  ];
  let navigateTo =
    "http://magicwebs.magicsw.com/SchoolJam_Games/schooljam/dev/pairs/";
  const mascots = [0, 1, 2, 3, 4, 5];
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver
      .manage()
      .window()
      .maximize();
    await driver.get(navigateTo);
    await driver.wait(until.elementLocated(By.id("input__playername")), 40000); // page loaded
    await AxeBuilder(driver).analyze(function(err, results) {
      console.log("inside AxeBuilder");
      if (err) {
        violations[pages.shift()] = {
          error: err,
          violations: {}
        };
      } else {
        violations[pages.shift()] = {
          error: null,
          violations: results.violations
        };
      }
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 1");
    await driver.sleep(1000);
    await driver.findElement(By.id("player_next_name")).click();
    await driver.sleep(1000);
    await AxeBuilder(driver).analyze(function(err, results) {
      console.log("inside AxeBuilder");
      if (err) {
        violations[pages.shift()] = {
          error: err,
          violations: {}
        };
      } else {
        violations[pages.shift()] = {
          error: null,
          violations: results.violations
        };
      }
    });
    let randomMascot = mascots.splice(
      Math.floor(Math.random() * mascots.length),
      1
    )[0];
    let mascotId = "mascot__" + randomMascot;
    let mascotElement = await driver.findElement(By.id(mascotId));
    driver.executeScript("arguments[0].click()", mascotElement);
    await driver.sleep(300);
    await driver.findElement(By.id("player_next_character")).click();
    await driver.sleep(300);
    await AxeBuilder(driver).analyze(function(err, results) {
      console.log("inside AxeBuilder");
      if (err) {
        violations[pages.shift()] = {
          error: err,
          violations: {}
        };
      } else {
        violations[pages.shift()] = {
          error: null,
          violations: results.violations
        };
      }
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 2");
    await driver.sleep(500);
    await driver.findElement(By.id("player_next_name")).click();
    await driver.sleep(500);
    await AxeBuilder(driver).analyze(function(err, results) {
      console.log("inside AxeBuilder");
      if (err) {
        violations[pages.shift()] = {
          error: err,
          violations: {}
        };
      } else {
        violations[pages.shift()] = {
          error: null,
          violations: results.violations
        };
      }
    });
    randomMascot = mascots.splice(
      Math.floor(Math.random() * mascots.length),
      1
    )[0];
    mascotId = "mascot__" + randomMascot;
    mascotElement = await driver.findElement(By.id(mascotId));
    driver.executeScript("arguments[0].click()", mascotElement);
    await driver.sleep(300);
    await driver.findElement(By.id("player_next_character")).click();
    await driver.sleep(300);
    await AxeBuilder(driver).analyze(function(err, results) {
      console.log("inside AxeBuilder");
      if (err) {
        violations[pages.shift()] = {
          error: err,
          violations: {}
        };
      } else {
        violations[pages.shift()] = {
          error: null,
          violations: results.violations
        };
      }
    });
  } catch (ex) {
    console.log("catch: ", ex);
  } finally {
    console.log("finally");
    const fileName = "test_report_" + new Date().getTime() + ".json";
    fs.writeFile(fileName, JSON.stringify(violations), "utf8", function(err) {
      if (err) {
        console.log(
          "An error occurred while writing file to the system: ",
          err
        );
      } else {
        console.log("File is successfully written.");
      }
      return err;
    });
    await driver.quit();
  }
})();
