# X-DM-API (Twitter 🐥)

## Overview
The **X-DM-API** provides developers with powerful tools to integrate direct messaging (DM) functionality into their applications. It allows seamless interaction with users on X (formerly Twitter) by automating DMs, sending personalized messages, and managing conversations in real-time.

## Getting Started

Follow the instructions below to set up and start using the X-DM-API.

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/suhailroushan13/X-DM-API
   cd X-DM-API
   ```

2. **Configuration**  

Update the following section in your code to provide your username, password, and profile URLs where you want to send your personalized messages.

```javascript
// Example usage: Providing the parameters directly
const username = '0xsuhailroushan';  // Twitter Username
const password = 'TWITTER-PASSWORD';  // Twitter Password

const profileUrls = [
  'https://x.com/0xsuhailroushan',
  'https://x.com/csprojects_xyz'
]; // Profile URLs to send messages
```

3. **Personalize Your Message** 

Modify the message content in the following section to fit your needs:

```javascript
// SEND HERE YOUR CUSTOM MESSAGE
////////////////////////////////////////////////////////////
let personalizedMessage = `Hello ${name}! How are you today?`;
////////////////////////////////////////////////////////////
```

4. **Install Dependencies** 
   ```bash
   npm install
   ```

5. **Start the Application**

After completing the above steps, start the application by running:

```bash
npm start
```


## Authors

- [@suhailroushan13](https://www.github.com/suhailroushan13)

