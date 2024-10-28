import { Builder, By, Key, until } from 'selenium-webdriver';

async function twitterLogin(driver, username, password) {
  try {
    // Step 1: Log in to Twitter (X)
    await driver.get('https://twitter.com/login');
    await driver.wait(until.elementLocated(By.name('text')), 10000);

    let emailField = await driver.findElement(By.name('text'));
    await emailField.sendKeys(username, Key.RETURN);

    await driver.wait(until.elementLocated(By.name('password')), 10000);
    let passwordField = await driver.findElement(By.name('password'));
    await passwordField.sendKeys(password, Key.RETURN);

    await driver.wait(until.urlContains('home'), 15000);
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error);
  }
}

async function sendPersonalizedMessage(driver, profileUrl) {
  try {
    // Step 2: Navigate to the profile URL
    await driver.get(profileUrl);
    await driver.wait(until.urlIs(profileUrl), 10000);
    console.log(`Navigated to: ${profileUrl}`);

    // Step 3: Extract the name using a more reliable selector
    let nameElement = await driver.wait(
      until.elementLocated(By.css('div[data-testid="UserName"] span')),
      10000
    );
    let name = await nameElement.getText();
    console.log(`Extracted name: ${name}`);

    // Step 4: Click the "Message" button
    let messageButton = await driver.wait(
      until.elementLocated(By.css('button[data-testid="sendDMFromProfile"]')),
      10000
    );
    await messageButton.click();
    console.log('Message button clicked!');

    // Step 5: Enter the personalized message
    let messageInput = await driver.wait(
      until.elementLocated(By.css('div[data-testid="dmComposerTextInput"]')),
      10000
    );

    //  SEND HERE YOUR CUSTOM MESSAGE 
    ////////////////////////////////////////////////////////////
    let personalizedMessage = `Hello ${name}! How are you today?`;
    /////////////////////////////////////////////////////////////


    
    await messageInput.sendKeys(personalizedMessage);
    console.log('Personalized message entered!');

    // Step 6: Click the "Send" button
    let sendButton = await driver.wait(
      until.elementLocated(By.css('button[data-testid="dmComposerSendButton"]')),
      10000
    );
    await sendButton.click();
    console.log('Message sent!');
  } catch (error) {
    console.error(`Error while sending message to ${profileUrl}:`, error);
  }
}


async function main(username, password, profileUrls) {
    let driver = await new Builder().forBrowser('chrome').build();
  
    try {
      // Log in once with provided credentials
      await twitterLogin(driver, username, password);
  
      // Loop through the array of profiles and send personalized messages
      for (const profileUrl of profileUrls) {
        await sendPersonalizedMessage(driver, profileUrl);
      }
    } catch (error) {
      console.error('Error in main function:', error);
    } finally {
      // Close the browser after execution
      await driver.quit();
    }
  }
  
  // Example usage: Providing the parameters directly
  const username = '0xsuhailroushan';  // Twitter Username

  const password = 'TWITTER-PASSWORD';  // Twiiter Password

  const profileUrls = ['https://x.com/0xsuhailroushan','https://x.com/csprojects_xyz']; // Profile URL's to Send Message
  
  // Call the main function with parameters
  main(username, password, profileUrls);