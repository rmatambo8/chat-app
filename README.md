Simple Chat app that takes advantage of sockets

we were trying to create a socket as a micro service that runs on a separate server.

this application allows for bidirectional communication between devices and when the socket server is down, the entire app does not crash but rather bypasses the socket service and waits for the socket service to become active again. 


to run the app you have to run two servers:
- react app server (main)
- socket service server
