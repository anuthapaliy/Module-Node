process.env.PORT = process.env.PORT || 9090;
const express = require("express");
const cors = require("cors");
const { response, text } = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));




const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});



// (1st challenge -create a new message) and challenges 2-create a new messages with validation-:
app.post("/messages", (request, response) => {
  console.log("posting");

  const {from, text } = request.body;
  if(!from || !text || from.trim() === "" || text.trim() === "") {
    console.log("invalidMessage")
    console.log(request.body)
    response.status(400).json({ error: "Missing or empty 'from' or 'text' property"});
  } else {
    const newMessage = {
      id: messages.length,
      from: from,
      text: text,
    };

    messages.push(newMessage);
    response.status(201).json(newMessage);
  }
});


 // - [ ] Read all messages
app.get("/messages", (request, response) => {
  response.json(messages);
});

// Level-3-challenges
  // - [ ] Read _only_ messages whose text contains a given substring: `/messages/search?text=express`
app.get("/messages/search", (request, response) => {

  console.log("Anu")
    const searchText = request.query.text.toLowerCase();
    console.log(searchText);
    const filteredMessages = messages.filter(
      (msg) => msg.text.toLowerCase().includes(searchText)
    );
  
    response.json(filteredMessages);
  });

// - [ ] Read one message specified by an ID
app.get("/messages/:id", (request, response) => {
  console.log("Sal")

  const messageId = parseInt(request.params.id);
  console.log(request.params.id);
  // Find the message with the specified ID in the messages array
  const message = messages.find((msg) => msg.id === messageId);
if (message) {
  response.json(message);
} else {
  response.status(404).json({ error: "Message not found"});
}
});
// - [ ] Delete a message, by ID
  app.delete("/messages/:id", (request, response) => {
    console.log(request.params.id)
    const messageId = parseInt(request.params.id);
    // Find the index of the message with the specified ID
  const messageIndex = messages.findIndex((msg) => msg.id === messageId);

  if (messageIndex !== -1) {
    // Delete the message from array
     messages.splice(messageIndex, 1);
     response.status(204).end();
  
  } else {
     response.status(404).json({error: "Message not found"});
}
});




// Read the most recent 10 messages
app.get("/messages/latest", (request, response) => {
  const latestMessages = messages.slice(-10);

  response.json(latestMessages);
});

// level 5- challenge,
app.put("/messages/:id", (request, response) => {
  const messageId = parseInt(request.params.id);
  const updatedMessage = request.body;

  const messageToUpdate = messages.find((msg) => msg.id === messageId);

  if(!messageToUpdate) {
    return response.status(404).json({ error: "Message not found" });
  }

  if(updatedMessage.text !== undefined) {
    messageToUpdate.text = updatedMessage.text;
  }

  if (updatedMessage.from !== undefined) {
    messageToUpdate.from = updatedMessage.from;
  }

  response.json(messageToUpdate);
});

app.listen(process.env.PORT,() => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});
