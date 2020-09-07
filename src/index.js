import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Popover } from "antd";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const renderSelectionAddon = () => {
  return (
    <Popover content={content} title="Title" visible>
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          background: "red"
        }}
      ></div>
    </Popover>
  );
};

function App() {
  const imageRef = useRef();
  const [crop, setCrop] = useState({
    unit: "px",
    width: 100,
    height: 100
    // aspect: 16 / 9
  });

  const [src, setSrc] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSrc(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  const onImageLoaded = (image) => {
    imageRef.current = image;
  };

  const onCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    setCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef && imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  };

  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      <div style={{ height: 500, width: 500, background: "green" }}>
        {src && (
          <ReactCrop
            className="react-crop"
            src={src}
            crop={crop}
            onImageLoaded={onImageLoaded}
            onComplete={onCropComplete}
            onChange={onCropChange}
            imageStyle={{ maxHeight: "100%", maxWidth: "100%" }}
            renderSelectionAddon={renderSelectionAddon}
            keepSelection={false}
          />
        )}
      </div>
      {croppedImageUrl && (
        <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("container"));
