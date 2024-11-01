import { Builder, By, Key, until } from "selenium-webdriver";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

async function main() {
  const driver = new Builder().forBrowser("chrome").build();
  const username = process.env.TWITTER_USERNAME;
  const password = process.env.TWITTER_PASSWORD;
  // Add username to fetch there followings // ex: elonmusk
  const profile = "elonmusk";

  try {
    await twitterLogin(driver, username, password);
    const followers = await scrapeUsernames(driver, profile);
    console.log(`Total followers scraped: ${followers.length}`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await driver.quit();
  }
}

async function twitterLogin(driver, username, password) {
  try {
    console.log("Attempting to log in...");
    await driver.get("https://twitter.com/login");
    await driver.wait(until.elementLocated(By.name("text")), 20000);

    const emailField = await driver.findElement(By.name("text"));
    await emailField.sendKeys(username, Key.RETURN);

    // Wait for username confirmation or password input
    await driver.wait(
      until.elementLocated(
        By.xpath('//input[@type="password" or @name="text"]')
      ),
      20000
    );

    const nextInput = await driver.findElement(
      By.xpath('//input[@type="password" or @name="text"]')
    );

    if ((await nextInput.getAttribute("name")) === "text") {
      await nextInput.sendKeys(username, Key.RETURN);
      await driver.wait(until.elementLocated(By.name("password")), 20000);
    }

    const passwordField = await driver.findElement(By.name("password"));
    await passwordField.sendKeys(password, Key.RETURN);

    await driver.wait(until.urlContains("home"), 20000);
    console.log("Login successful!");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

async function scrapeUsernames(driver, profile) {
  try {
    console.log(`Opening the profile: ${profile}`);
    await driver.get(`https://x.com/${profile}/following`);

    let usernames = new Set();
    let lastHeight = await driver.executeScript(
      "return document.body.scrollHeight"
    );

    while (true) {
      const elements = await driver.findElements(
        By.css("span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3")
      );

      for (const element of elements) {
        const username = await element.getText();
        if (username.startsWith("@")) {
          usernames.add(username);
        }
      }

      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight);"
      );
      await driver.sleep(3000);

      let newHeight = await driver.executeScript(
        "return document.body.scrollHeight"
      );
      if (newHeight === lastHeight) {
        console.log("Reached the end of the list.");
        break;
      }
      lastHeight = newHeight;
    }

    const usernamesArray = Array.from(usernames).slice(1); // Remove 0th item
    console.log("Usernames starting with @:", usernamesArray);

    saveToFile(usernamesArray);
    return usernamesArray;
  } catch (error) {
    console.error("Error scraping usernames:", error);
    throw error;
  }
}

function saveToFile(usernames) {
  const formattedUsernames = usernames.map(
    (username) => `https://x.com/${username.substring(1)}`
  );

  fs.writeFileSync(
    "following.json",
    JSON.stringify(formattedUsernames, null, 2),
    "utf8"
  );
  console.log("Usernames saved to following.json");
}

main();
