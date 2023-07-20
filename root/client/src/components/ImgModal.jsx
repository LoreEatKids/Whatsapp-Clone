import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import "./styles/imgmodal.scss";

export default function ImgModal({img}) {
    const { setImgModalVisible, setImg } = useContext(ChatContext);
    
    const closeImgModal = () => {
        setImgModalVisible([false, ""]);
        setImg(null);
    }

    return (
        <div className="imgModal" onContextMenu={() => {return false}}>
            <div className="controls_container" onClick={closeImgModal}>
                <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z"></path></svg>
            </div>
            <div className="modal-img_container" onClick={closeImgModal}>
                <img src={img}/>
            </div>
        </div>
    )
};
