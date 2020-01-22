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
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(navigateTo);
    await driver.wait(until.elementLocated(By.id("input__playername")), 20000);
    AxeBuilder(driver).analyze(function(err, results) {
      if (!err) {
        violations[pages.shift()] = results.violations;
      }
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 1");
    await driver.sleep(1000);
    let nextButton = await driver.findElement(
      By.id("next-button-player-name-screen")
    );
    await nextButton.setAttribute("class", classes.join(" "));
    nextButton.click();
    await driver.sleep(1000);
    AxeBuilder(driver).analyze(function(err, results) {
      if (!err) {
        violations[pages.shift()] = results.violations;
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

const getViolationsForCurrentPage = (driver, cb) => {
  AxeBuilder(driver).analyze(function(err, results) {
    console.log("AxeBuilder: ", err, results);
    let cbData = {};
    if (err) {
      cbData = err;
    } else {
      cbData = results.violations;
    }
    if (cb && typeof cb === "function") {
      cb(cbData);
    }
  });
};

// driver.get("https://www.google.co.in").then(function() {
//     await driver.findElement
// //   AxeBuilder(driver).analyze(function(err, results) {
// //     if (err) {
// //       console.log("error occurred[err]: ", err);
// //       // Handle error somehow
// //     }
// //     console.log(results.violations);
// //   });
// });
