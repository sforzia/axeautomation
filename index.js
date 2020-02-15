const fs = require("fs");
const open = require("open");
var AxeBuilder = require("axe-webdriverjs");
var {
  Builder,
  By,
  Key,
  until
} = require("selenium-webdriver");

(async function example() {
  let violations = {};
  let pages = [
    "page1player1name",
    "page2player1mascot",
    "page3player2name",
    "page4player2mascot",
    "page5firstWelcomeScreen",
    "page6ActivityScreen",
    "page7ActivityScreenWithHelpPopupOpen",
    "page8GreetingScreen",
    "page9ResultScreen",
    "page10TakeScreenShotScreen",
    "page11FinishScreen"
  ];
  let pagesMapping = {
    page1player1name: "Player 1 Name Page",
    page2player1mascot: "Player 1 Mascot Page",
    page3player2name: "Player 1 Name Screen",
    page4player2mascot: "Player 2 Mascot Page",
    page5firstWelcomeScreen: "First Welcome Page",
    page6ActivityScreen: "Activity Page",
    page7ActivityScreenWithHelpPopupOpen: "Activity With Help Text Popup Opened",
    page8GreetingScreen: "Greetings Page",
    page9ResultScreen: "Result Screen",
    page10TakeScreenShotScreen: "Take Screenshot Page",
    page11FinishScreen: "Finish Screen"
  };
  const baseURL = "http://magicwebs.magicsw.com/SchoolJam_Games/schooljam";
  let buildToTest = "pairs";
  let environment = "/dev/";
  let fileDescriptionDev = "dev";
  if (process.env.npm_config_activity) {
    buildToTest = process.env.npm_config_activity.toLowerCase();
  }
  if (
    process.env.npm_config_env &&
    process.env.npm_config_env.toLowerCase() === "client"
  ) {
    environment = "/";
    fileDescriptionDev = "live";
  }
  let navigateTo = baseURL + environment + buildToTest;
  console.log("Navigating to: ", navigateTo);
  const mascots = [0, 1, 2, 3, 4, 5];
  let pageTitle = '';
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver
      .manage()
      .window()
      .maximize();
    await driver.get(navigateTo);
    await driver.wait(until.elementLocated(By.id("input__playername")), 40000); // page loaded
    pageTitle = await driver.getTitle();
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 1");
    await driver.sleep(1000);
    await driver.findElement(By.id("player_next_name")).click();
    await driver.sleep(1000);
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
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
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 2");
    await driver.sleep(500);
    await driver.findElement(By.id("player_next_name")).click();
    await driver.sleep(500);
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
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
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
    });
    const readyButton = driver.findElement(By.id("gameReadyButton"));
    await readyButton.click();
    await driver.sleep(300);
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
    });
    const popupHeader1 = await driver.findElement(By.id("popupHeader1"));
    await popupHeader1.click();
    await driver.sleep(300);
    await AxeBuilder(driver).analyze(function (err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = {
        error,
        result
      };
    });
    const popupHeader1Close = await driver.findElement(
      By.id("closePopupPlayer1")
    );
    await popupHeader1Close.click();
    await driver.sleep(1000);
    let answerResponseText = await driver.findElements(
      By.className("answerResponseText")
    );
    while (!answerResponseText.length) {
      driver.sleep(3000);
      let activityArea = await driver.findElements(
        By.className("activityArea")
      );
      const welomeWrapper = await driver.findElements(
        By.className("welomeWrapper")
      );
      await driver.sleep(300);
      if (
        activityArea.length &&
        (await activityArea[0].getAttribute("class")).indexOf("ng-hide") === -1
      ) {
        let dragItems = await driver.findElements(By.className("btn-star"));
        while (
          dragItems.length &&
          (await activityArea[0].getAttribute("class")).indexOf("ng-hide") ===
          -1
        ) {
          let selectedCard = dragItems[0];
          const dragItemValue = await selectedCard.getAttribute("data-value");
          await selectedCard.click();
          driver.sleep(1500);
          let virtualDropList = await driver.findElements(
            By.className("drag-drop-button")
          );
          let itemFound = -1;
          if (virtualDropList) {
            if (virtualDropList.length) {
              for (let i = 0; i < virtualDropList.length; i++) {
                const elem = virtualDropList[i];
                const elemAriaText = await elem.getAttribute("aria-label");
                if (elemAriaText.indexOf(dragItemValue) !== -1) {
                  itemFound = i;
                  break;
                }
              }
              if (itemFound !== -1) {
                await driver.executeScript(
                  "arguments[0].click()",
                  virtualDropList[itemFound]
                );
                await driver.sleep(500);
                dragItems = await driver.findElements(By.className("btn-star"));
                let disabledItems = [];
                for (let i = 0; i < dragItems.length; i++) {
                  const isDisabled = await dragItems[i].getAttribute(
                    "disabled"
                  );
                  if (isDisabled) {
                    disabledItems.push(i);
                  }
                }
                if (disabledItems.length) {
                  for (let i = 0; i < disabledItems.length; i++) {
                    dragItems.splice(disabledItems[i], 1);
                  }
                }
              }
            }
          }
          activityArea = await driver.findElements(
            By.className("activityArea")
          );
          await driver.sleep(2500);
        }
      } else if (welomeWrapper.length) {
        await driver.sleep(500);
        const gameReadyButton = await driver.findElement(
          By.id("gameReadyButton")
        );
        await gameReadyButton.click();
        await driver.sleep(300);
      }
      driver.sleep(500);
      answerResponseText = await driver.findElements(
        By.className("answerResponseText")
      );
    }
    await driver.sleep(2000);
    let nextDoneFinishButton = await driver.findElement(
      By.id("nextDoneFinishButton")
    );
    await nextDoneFinishButton.click();
    await driver.sleep(2000);
    nextDoneFinishButton = await driver.findElement(
      By.id("nextDoneFinishButton")
    );
    await nextDoneFinishButton.click();
    await driver.sleep(2000);
    let takeScreenShotButton = await driver.findElement(
      By.id("take_screenshot_action_button")
    );
    await takeScreenShotButton.click();
    await driver.sleep(3500);
    nextDoneFinishButton = await driver.findElement(
      By.id("nextDoneFinishButton")
    );
    await nextDoneFinishButton.click();
  } catch (ex) {
    console.log("catch: ", ex);
  } finally {
    const fileName = `test_report_${fileDescriptionDev}_${buildToTest}_${new Date().getTime()}.json`;
    fs.writeFile(fileName, JSON.stringify(violations), "utf8", function (err) {
      if (err) {
        console.log(
          "An error occurred while writing file to the system: ",
          err
        );
      } else {
        console.log("File is successfully written.");
        let html = `<!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8"> 
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Test Report</title>
                        <link rel="stylesheet" href="style.css">
                        <script>
                          const url = ${JSON.stringify(navigateTo)};
                          const title = ${JSON.stringify(pageTitle)};
                          const violations = ${JSON.stringify(violations)};
                          const mapping = ${JSON.stringify(pagesMapping)};
                        </script>
                      </head>
                      <body>
                      <div id='parent'></div><script src="script.js"></script></body></html>`;
        fs.writeFile("index.html", html, "utf8", function (err) {
          console.log("file written");
          if (!err) {
            open("index.html");
          }
        });
      }
      return err;
    });
    await driver.quit();
  }
})();