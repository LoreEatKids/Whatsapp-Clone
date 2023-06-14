import Aside from "../components/Aside";
import Chat from "../components/OpenChat";
import "../styles/main.scss";

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
