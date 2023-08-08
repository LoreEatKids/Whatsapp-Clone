import Aside from "../components/Aside";
import ImgViewerMenu from "../components/ImgViewerMenu";
import Chat from "../components/OpenChat";
import "../styles/main.scss";

export default function ChatApp() {
  return (
    <main className="app">
      <ImgViewerMenu />
      <div className="chat_container flex">
        <Aside />
        <Chat />
      </div>
    </main>
  );
}
