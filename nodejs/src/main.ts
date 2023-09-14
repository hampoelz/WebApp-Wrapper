import { channel } from 'bridge';

// Listens to messages from the website.
channel.addListener('wrapper:onMessage', message => {
    console.log('[Node.js] Message from website: ' + message);

    // Sends a message back to the website.
    channel.send("wrapper:sendMessage", "Replying to the message: " + message, "And optionally add more arguments.");
});
