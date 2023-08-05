const { response } = require("express");
const express = require("express");
const app = express();
const mailingLists = require("./mailing-lists")

// middleware
app.use(express.json());

// route to fetch all existing list names
app.get('/lists', (request, response) => {
    const listsArray = Array.from(mailingLists.keys());
    response.send(listsArray);
});

// route to get a single list by name
app.get('/lists/:name', (request, response) => {
    const name = request.params.name;
    const list = mailingLists[name];

    if (list) {
        response.status(200).json(list);
    } else {
        response.status(404).json({ message: 'List not found'})
    }
});

// Route to delete a single list by name
app.delete('/lists/:name', (request, response) => {
    const name = request.params.name;
    if (mailingLists.hasOwnProperty(name)) {
        delete mailingLists[name];
        response.status(200).json({ message: 'List deleted successfully' });
    } else {
        response.status(404).json({ message: 'List not found'});
    }
});

// Route to add or update a list with the given name plus update code as per stretch 1.
app.put('/lists/:name', (request, response) => {
    const nameInPath = request.params.name;
    const { name: nameInBody, members } = request.body;
   
    if (!nameInBody || nameInPath !== nameInBody) {
        response.status(400).json({ message: 'Name in path does not match the name in the request body' });
    } else {
        mailingLists[nameInBody] = members || [];
response.status(200).json({ message: 'List updated successfully' });
}
});

// stretch 2: Get members of a list by name
app.get('/lists/:name/members', (request, response) => {
    const name = request.params.name;
    const list = mailingLists[name];

    if (list) {
        response.status(200).json(list.members);
    } else {
        response.status(404).json({ message: 'List not found'})
    }
});

// stretch 2: Add a member to a list
app.put('/lists/:name/members/:email', (request, response) => {
    const name = request.params.name;
    const email = request.params.email;

    const list = mailingLists[name];
    if (list) {
        list.members.push(email);
        response.status(200).json({ message: 'Member added successfully' });
    } else {
        response.status(404).json({ message: 'List not found' });
    }
});

// stretch 2: Remove a member from a list 
app.delete('/lists/:name/members/:email', (request, response) => {
    const name = request.params.name;
    const email = request.params.email;

    const list = mailingLists[name];
    if (list) {
        const index = list.members.indexOf(email);
        if (index !== -1) {
            list.members.splice(index, 1);
            response.status(200).json({ message: 'Member removed successfully' });
        } else {
            response.status(404).json({ message: 'Member not found in the list' });
        }
        } else {
            response.status(404).json({ message: 'List not found' });
        }
    });

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
