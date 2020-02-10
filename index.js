const fs = require("fs");
const open = require("open");
var AxeBuilder = require("axe-webdriverjs");
var { Builder, By, Key, until } = require("selenium-webdriver");

(async function example() {
  let violations = {};
  let pages = [
    "page1player1name",
    "page2player1mascot",
    "page3player2name",
    "page4player2mascot",
    "page5firstWelcomeScreen",
    "page6ActivityScreen",
    "page6ActivityScreenWithHelpPopupOpen",
    "page7GreetingScreen",
    "page8ResultScreen",
    "page9TakeScreenShotScreen",
    "page10FinishScreen"
  ];
  let pagesMapping = {
    page1player1name: "Player 1 Name Page",
    page2player1mascot: "Player 1 Mascot Page",
    page3player2name: "Player 1 Name Screen",
    page4player2mascot: "Player 2 Mascot Page",
    page5firstWelcomeScreen: "First Welcome Page",
    page6ActivityScreen: "Activity Page",
    page6ActivityScreenWithHelpPopupOpen:
      "Activity With Help Text Popup Opened",
    page7GreetingScreen: "Greetings Page",
    page8ResultScreen: "Result Screen",
    page9TakeScreenShotScreen: "Take Screenshot Page",
    page10FinishScreen: "Finish Screen"
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
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver
      .manage()
      .window()
      .maximize();
    await driver.get(navigateTo);
    await driver.wait(until.elementLocated(By.id("input__playername")), 40000); // page loaded
    await AxeBuilder(driver).analyze(function(err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 1");
    await driver.sleep(1000);
    await driver.findElement(By.id("player_next_name")).click();
    await driver.sleep(1000);
    await AxeBuilder(driver).analyze(function(err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
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
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
    });
    await driver
      .findElement(By.id("input__playername"))
      .sendKeys("test user 2");
    await driver.sleep(500);
    await driver.findElement(By.id("player_next_name")).click();
    await driver.sleep(500);
    await AxeBuilder(driver).analyze(function(err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
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
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
    });
    const readyButton = driver.findElement(By.id("gameReadyButton"));
    await readyButton.click();
    await driver.sleep(300);
    await AxeBuilder(driver).analyze(function(err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
    });
    const popupHeader1 = await driver.findElement(By.id("popupHeader1"));
    await popupHeader1.click();
    await driver.sleep(300);
    await AxeBuilder(driver).analyze(function(err, results) {
      const error = err ? err : null;
      const result = results ? results.violations : {};
      violations[pages.shift()] = { error, result };
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
    fs.writeFile(fileName, JSON.stringify(violations), "utf8", function(err) {
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
                          const data = ${JSON.stringify(violations)};
                          function show(page) {
                            if(data && page && data[page] && !data[page].error && data[page].result && data[page].result.length) {
                              let v = data[page].result;
                              let popupData = '<div class="violations">';
                              for(let iter = 0; iter < v.length; v++) {
                                let _v = v[iter];
                                popupData += '<div class="violation">';
                                popupData += '<p class="description">Description: ' + _v.description + '</p>';
                                popupData += '<p class="help">Help: ' + _v.help + '</p>';
                                popupData += '<p class="impact">Impact: ' + _v.impact + '</p><p>Impacted nodes/elements:</p>';
                                for(let iter2 = 0; iter2 < _v.nodes.length; iter2++) {
                                  let node = _v.nodes[iter2];
                                  popupData += '<div class="violation-node">';
                                  popupData += '<p class="f-summary">Failure Summary: ' + node.failureSummary + '</p>';
                                  popupData += '<p class="html">Node HTML: <xmp>' + node.html + '</xmp></p>';
                                  popupData += '<p class="identifier">Identifier(s): ' + node.target.join(" ") + '</p>';
                                }
                                popupData += '<p class="tags">WCAG tags: ' + _v.tags.join(", ") + '</p></div>';
                              }
                              popupData += '</div>';
                              console.log(popupData);
                              document.getElementById('popup').innerHTML = popupData;
                              document.getElementById("popup").classList.add("show-popup");
                            }
                          }
                        </script>
                      </head>
                      <body>
                        <div class='pages'>`;
        let pages = "";
        for (let page in violations) {
          const item = violations[page];
          if (item.error) {
            pages += `<button class='page' disabled='disabled' id=${page}><p class='page-title'>${pagesMapping[page]}</p><p class='page-violations'>Error while assessing, unable to test current page</p></button>`;
          } else {
            let check = item.result.length == 1 ? "issue" : "issues";
            let disabled = item.result.length === 0 ? "disabled" : false;
            let noV = item.result.length == 0 ? "no-violation-found" : "";
            pages += `<button class='page ${noV}' onclick="show('${page}')" id=${page}><p class='page-title'>${pagesMapping[page]}</p><p class='page-violations'>${item.result.length} ${check}</p></button>`;
          }
        }
        html += pages;
        html +=
          "</div><div class='details-popup show-popup' id='popup'></div></body></html>";
        fs.writeFile("index.html", html, "utf8", function(err) {
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
