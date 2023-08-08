import { saveAs } from "file-saver";
import { useContext, useState } from "react";
import { ImgViewerContext } from "../context/ImgViewer";
import "./styles/ImgViewer.scss";

export default function ImgViewerMenu() {
    // needs at least an object imgInfos {user: {photoURL: string, displayName: string}, img: {url: string}, OPTIONAL: prevImgs: []}
    
    const {
        imgInfos,
        setImgInfos,
        imgViewerIsActive,
        setImgViewerIsActive,
        resetImgViewerStates,
    } = useContext(ImgViewerContext);
    
    const [isZooming, setIsZooming] = useState(false);

    const handleCloseImgView = (event = "") => {
      const clickedElement = event?.target;
      const imgWrapper = document.querySelector(".img-wrapper");
      if (imgWrapper && imgWrapper.contains(clickedElement)) return;

      resetImgViewerStates();
      setImgViewerIsActive(false);
    }

    const handleDownloadImg = (url = imgInfos.img.url) => saveAs(url, "image.jpg");

    const handleSwitchImg = (img) => {
      setImgInfos((prevImgInfos) => ({
        ...prevImgInfos,
        img: {
          ...prevImgInfos.img,
          url: img,
        },
      }));
    };

    const prevImgsEl = imgInfos?.prevImgs?.map((media) => (
        <img 
            src={media.img} 
            key={media.id} 
            className={imgInfos.img.url === media.img ? "selected_img" : ""} 
            onClick={() => handleSwitchImg(media.img)}
        />
    ))

    return (
        imgViewerIsActive && (
            <div className="img-viewer-container">

                <header className="img-infos d-f">
                    <div className="user-infos d-f">
                        <img src={imgInfos.user.photoURL} className="img-sender-pfp" />
                        <h1>{imgInfos.user.displayName}</h1>
                    </div>
                    <div className="img-infos-btns d-f">
                        <svg onClick={handleCloseImgView} viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M19.8,5.8l-1.6-1.6L12,10.4L5.8,4.2L4.2,5.8l6.2,6.2l-6.2,6.2l1.6,1.6l6.2-6.2l6.2,6.2l1.6-1.6L13.6,12 L19.8,5.8z"></path></svg>
                        <svg onClick={() => handleDownloadImg()} viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M18.9,10.3h-4V4.4H9v5.9H5l6.9,6.9L18.9,10.3z M5.1,19.2v2H19v-2H5.1z"></path></svg>
                    </div>
                </header>

                <div className="img-container" onClick={(e) => handleCloseImgView(e)}>
                    <div className="img-wrapper">
                        <img 
                            src={imgInfos.img.url} 
                            className={isZooming ? "zooming" : ""}
                            onClick={() => setIsZooming(!isZooming)} 
                        />
                    </div>
                </div>

                {imgInfos?.prevImgs && (
                    <article className="prev-imgs-container d-f">
                        <div className="img-wrapper d-f">
                            {prevImgsEl}
                        </div>
                        <div></div>
                    </article>
                )}

            </div>
        )
    )
};
