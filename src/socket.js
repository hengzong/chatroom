import socketIOClient from "socket.io-client";
var socket = socketIOClient('http://localhost:3001/');
export default socket;
