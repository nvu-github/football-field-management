import { ref, onUnmounted } from "vue";
import io from "socket.io-client";

const config = useRuntimeConfig();
const getToken = () => {
  const userLoggedIn = localStorage.getItem("userLogin");
  let token = "";
  if (userLoggedIn) {
    token = JSON.parse(userLoggedIn)?.accessToken;
  }
  return token;
};

const token = getToken();
const configSocket = {
  extraHeaders: {
    authorization: token,
  },
};
const socket = io(`${config.public.SOCKET_URL}sockets`, configSocket);
const messages = ref({});

socket.on("message", (message) => {
  messages.value = message;
});

const sendMessage = (event: string, message: object) => {
  socket.emit(event, message);
};

const onEvent = (event: string, callback: any) => {
  socket.on(event, callback);
};

const disconnect = () => {
  socket.disconnect();
};

onUnmounted(disconnect);

export { messages, sendMessage, onEvent };
