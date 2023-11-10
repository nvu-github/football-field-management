import { onUnmounted } from "vue";
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

let socket: any = null

export const initialSocketIo = async () => {
  socket = await io(`${config.public.SOCKET_URL}sockets`, configSocket);
}
initialSocketIo()
export const sendMessage = (event: string, message: object) => {
  socket.emit(event, message);
};

export const onEvent = (event: string, callback: any) => {
  socket.on(event, callback);
};

const disconnect = () => {
  socket.disconnect();
};

onUnmounted(disconnect);