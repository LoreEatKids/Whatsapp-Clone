import "../styles/main.scss";
import Aside from "./Aside";
import Chat from "./Chat";

export default function ChatApp() {
  return (
    <main className="app">
      <div className="chat_container flex">
        <Aside />
        <Chat />
      </div>
    </main>
  );
}
