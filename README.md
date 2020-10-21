# MessagesServer

## Assumptions - not all assignments were clear
- The delete action is done in a manner similar to messaging apps such as whatsapp, where a deleted message is deleted for both the sender & receiver, as opposed to e-mail, where if I delete a message from my inbox, it's still accessible to the sender. For the record, this could easily be implemented by having the delete endpoint simply delete the message from the messages property of the given user's model, and adding a deletedBy attribute to the message model. If both sender & receiver have removed the message -> delete from db.

- The bonus task of using the authentication token to have get requests to the /messages endpoint return all of the requesting users messages automatically - I took that to mean that this is the *only* endpoint which should behave in this manner, which has a number of repercussions, chiefly:
  - The routes to get or delete a specific user's messages went under the route /users/:userid/messages/:messageid rather than simply /messages/:messageid, and have the user information get retrieved from the authentication token. I think this would of been a better choice, as it's closer to my development experience and I believe more RESTful
