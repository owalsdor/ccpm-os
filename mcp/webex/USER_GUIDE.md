Webex MCP Server for Cursor — User Guide

This guide is written so you can copy it into a Word document. Use the section titles as headings and the structure as-is.


1. WHAT IS THIS?

The Webex MCP Server lets you use Webex messaging from inside Cursor (the AI code editor). It is a small server that talks to the Webex REST API so you can:

  • List your Webex spaces (rooms) — direct and group
  • Read messages from a space or a 1:1 conversation
  • Send messages to a space or a person

You talk in plain language in Cursor chat (e.g. “list my Webex spaces” or “send ‘hello’ to test space for webex mcp”), and the AI uses this server to perform the actions. You do not need to run a separate app or leave Cursor.


2. IMPORTANT: ABOUT WEBEX PERSONAL ACCESS TOKENS

2.1 Limited lifetime

  • Webex Personal Access Tokens expire after 12 hours.
  • After 12 hours the token stops working and you will see errors when listing spaces, reading messages, or sending messages.
  • You must create a new token at the Webex for Developers site and update wherever you use it (e.g. Cursor MCP config or when pasting in chat).

  Create a token here: https://developer.webex.com/docs/getting-your-personal-access-token

2.2 Security warning

  • Never commit or share your token. Anyone with the token can act as your Webex account (list spaces, read and send messages).


3. PREREQUISITES

  • Node.js 18 or newer
  • npm (comes with Node.js)
  • A Webex account (to sign in and create a Personal Access Token)
  • Cursor with MCP support (modern Cursor versions)


4. INSTALLATION

4.1 Step 1: Download the code and unzip it

  • Open the AI PM Guide and find the link to the Webex MCP Server code (zip file).
  • Click the link or copy it into your browser to download the zip file to your computer.
  • Unzip the file and note the path to the unzipped folder. You will need this path for the next step.

4.2 Step 2: Install dependencies and build

In a terminal, go to the unzipped project folder from Step 1 and run the following commands. Replace /path/to/WebexMCP with the actual path to your unzipped WebexMCP folder.

  • Change into the project folder:

    cd /path/to/WebexMCP

  • Install dependencies:

    npm install

  • Build the server:

    npm run build

You should see a dist folder with the built server. You only need to run these steps once (and again if the code is updated).

4.3 Step 3: Create a Webex Personal Access Token

  1. Open: https://developer.webex.com/docs/getting-your-personal-access-token
  2. Sign in with your Webex account.
  3. Create a new token and copy it.
  4. Store it somewhere safe. Remember: it expires in 12 hours. You will need to create a new one and update your setup when it does.


5. HOW TO USE IT

5.1 Add the server to Cursor

  1. Open Cursor Settings (gear icon or Cursor → Settings).
  2. Go to Features → MCP (or open your MCP config file directly).
  3. Edit the MCP config file:
       • macOS: ~/.cursor/mcp.json
       • Windows: %APPDATA%\Cursor\mcp.json
  4. Add the Webex server. Example (replace the path and token with your own):

Example config:

  "mcpServers": {
    "webex": {
      "command": "node",
      "args": [
        "/FULL/PATH/TO/WebexMCP/dist/index.js",
        "--webex-token=YOUR_WEBEX_TOKEN_HERE"
      ]
    }
  }

  • Use the full path to WebexMCP/dist/index.js on your machine.
  • Put your current Webex Personal Access Token in place of YOUR_WEBEX_TOKEN_HERE.
  • When the token expires (after 12 hours), create a new token and update this line.

  5. Save the file and restart Cursor so it loads the new server.

5.2 Providing the token

You can give the server your token in two ways:

  • In the command: Put the token in the args in mcp.json (as in the example above). This is the usual way.
  • In the message: Do not put the token in config. When the AI needs it, paste the token in chat when asked. You can use this for quick tests.

Remember to refresh the token in your config when it expires (every 12 hours for Personal Access Tokens).


6. USING IT IN CURSOR CHAT

After the server is added and Cursor restarted, you can ask in chat for example:

  • “List my Webex spaces” or “List 20 Webex spaces”
  • “Read messages from test space for webex mcp” or “Get messages from [space name]”
  • “Send a message to test space for webex mcp saying hello world”

The AI will call the Webex tools, and you will see results (spaces, messages, or confirmation that a message was sent). You do not need to run the server yourself; Cursor starts it when needed.

6.1 If something fails

  • “Webex API error” or “token” errors: Your Personal Access Token may be expired (12-hour lifetime). Create a new token at https://developer.webex.com/docs/getting-your-personal-access-token and update your MCP config (or paste the new token when the AI asks).
  • “404” or “Not Found”: The server uses the correct Webex API host; if 404 persists, check that the token is valid and not expired.
  • Spaces or messages not loading: Confirm you are in the right space (name or ID). For messages you need either a roomId (space) or personId (direct). Listing spaces gives you the IDs.


7. QUICK REFERENCE: WHAT THE TOOLS DO

  • See your spaces: “List my Webex spaces” or “List 20 Webex spaces”
  • Read messages: “Read messages from [space name]” or “Get messages from test space for webex mcp”
  • Send a message: “Send ‘hello world’ to test space for webex mcp”


8. TOKEN LIFETIME SUMMARY

  • Personal Access Token: 12 hours. When it expires, create a new token and update your Cursor MCP config (or provide it again in chat if you use that method).

For long-lived or automated use, consider a Webex Bot and bot token (different setup; see https://developer.webex.com/).


9. LICENSE

MIT. See the project README for details.
