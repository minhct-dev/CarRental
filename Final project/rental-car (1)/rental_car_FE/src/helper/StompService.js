// StompService.js
import SockJS from "sockjs-client";
import { over } from "stompjs";

class StompService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = [];
    this.onReadyCallbacks = [];
  }

  connect(token, onConnected = () => {}, onError = () => {}) {
    if (this.connected) return;
    const socket = new SockJS("http://localhost:8080/ws");
    this.stompClient = over(socket);

    this.stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        this.connected = true;
        onConnected(this.stompClient);
        this.onReadyCallbacks.forEach((cb) => cb()); // Gọi các callback chờ kết nối
        this.onReadyCallbacks = []; // Clear
      },
      (error) => {
        this.connected = false;
        console.error("STOMP error", error);
        onError(error);
      }
    );
  }

  send(destination, body) {
    if (this.connected && this.stompClient) {
      this.stompClient.send(
        destination,
        {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        JSON.stringify(body)
      );
    } else {
      console.error("Cannot send message, STOMP not connected");
    }
  }

  subscribe(destination, callback) {
    if (this.connected && this.stompClient) {
      return this.stompClient.subscribe(destination, (message) => {
        if (message.body) {
          callback(JSON.parse(message.body));
        }
      });
    } else {
      // Nếu chưa kết nối → delay việc subscribe cho đến khi ready
      this.onReadyCallbacks.push(() => {
        this.subscribe(destination, callback);
      });
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this.connected = false;
        console.log("Disconnected from STOMP");
      });
    }
  }

  isConnected() {
    return this.connected;
  }
  onReady(callback) {
    if (this.connected) {
      callback();
    } else {
      this.onReadyCallbacks.push(callback);
    }
  }
}

const stompService = new StompService();
export default stompService;
