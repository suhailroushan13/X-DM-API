import { Builder, By, Key, until } from "selenium-webdriver";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

const username = process.env.TWITTER_USERNAME;

const password = process.env.TWITTER_PASSWORD;

const data = await fs.readFile("following.json", "utf-8");
const jsonData = JSON.parse(data);

const profileUrls = jsonData;
// console.log(profileUrls);

const delay = () => {
  const ms = 6000 + Math.random() * 4000; // Random delay between 6000 and 10000 ms
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// // Generate a random delay to mimic human pauses
// function randomPause(min = 2000, max = 5000) {
//   return new Promise((resolve) =>
//     setTimeout(resolve, Math.floor(Math.random() * (max - min + 1000) + min))
//   );
// }

async function twitterLogin(driver, username, password) {
  try {
    await driver.get("https://twitter.com/login");
    await driver.wait(until.elementLocated(By.name("text")), 10000);

    let emailField = await driver.findElement(By.name("text"));
    await emailField.sendKeys(username, Key.RETURN);

    await driver.wait(until.elementLocated(By.name("password")), 10000);
    let passwordField = await driver.findElement(By.name("password"));
    await passwordField.sendKeys(password, Key.RETURN);

    await driver.wait(until.urlContains("home"), 15000);
    console.log("Login successful!");
  } catch (error) {
    console.error("Login failed:", error);
  }
}

async function sendPersonalizedMessage(driver, profileUrl) {
  try {
    // Navigate to the user profile URL
    await driver.get(profileUrl);
    await driver.wait(until.urlIs(profileUrl), 10000);
    console.log(`Navigated to: ${profileUrl}`);

    // Wait for the user name element and extract the name
    const nameElement = await driver.wait(
      until.elementLocated(By.css('div[data-testid="UserName"] span')),
      10000
    );
    const name = await nameElement.getText();
    console.log(`Extracted name: ${name}`);

    const personalizedMessage = `Hi ${name}, I own the domain code.live and think it could align well with your brand or tools. Let me know if you're interested! :)`;

    // Locate and click the message button, skip if it doesn’t exist
    let messageButton;
    try {
      messageButton = await driver.wait(
        until.elementLocated(By.css('button[data-testid="sendDMFromProfile"]')),
        20000
      );
      await messageButton.click();
      console.log("Message button clicked!");
    } catch (error) {
      console.log("Message button not found. Skipping message send.");
      return; // Exit if the message button isn't found
    }

    // Wait for the message input field to appear
    const messageInput = await driver.wait(
      until.elementLocated(By.css('div[data-testid="dmComposerTextInput"]')),
      30000
    );

    // Check if the input field already contains the message to prevent duplication
    const existingContent = await messageInput.getAttribute("textContent");
    if (existingContent.includes(personalizedMessage.trim())) {
      console.log("Message already typed, skipping send.");
      return;
    }

    // Clear the input field (if needed) and enter the personalized message
    await messageInput.clear();
    await messageInput.sendKeys(personalizedMessage);
    console.log("Personalized message entered!");

    // Locate and click the send button
    const sendButton = await driver.wait(
      until.elementLocated(
        By.css('button[data-testid="dmComposerSendButton"]')
      ),
      20000
    );

    // Ensure the send button is enabled before clicking
    const isDisabled = await sendButton.getAttribute("disabled");
    if (!isDisabled) {
      await sendButton.click();
      console.log("Message sent!");
    } else {
      console.log("Send button is disabled, message not sent.");
    }

    // Final delay to avoid sending duplicate messages
    await delay(5000);
  } catch (error) {
    console.error(`Error while sending message to ${profileUrl}:`, error);
  }
}

async function main(username, password, profileUrls) {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Log in once with provided credentials
    await twitterLogin(driver, username, password);

    // Loop through the array of profiles and send personalized messages
    for (const profileUrl of profileUrls) {
      await sendPersonalizedMessage(driver, profileUrl);
    }
  } catch (error) {
    console.error("Error in main function:", error);
  } finally {
    // Close the browser after execution
    await driver.quit();
  }
}

// Call the main function with parameters
main(username, password, profileUrls);
