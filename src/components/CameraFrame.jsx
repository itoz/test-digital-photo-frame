import { useEffect, useRef, useState } from "react";

export default function CameraFrame({ frameSrc, onOpenFrameSelector }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
      });
  };

  const drawFrameImage = (ctx, frameImage, targetW, targetH) => {
    const frameW = frameImage.width;
    const frameH = frameImage.height;
    const frameAspect = frameW / frameH;
    const targetAspect = targetW / targetH;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (frameAspect > targetAspect) {
      drawWidth = targetW;
      drawHeight = targetW / frameAspect;
      offsetX = 0;
      offsetY = (targetH - drawHeight) / 2;
    } else {
      drawHeight = targetH;
      drawWidth = targetH * frameAspect;
      offsetY = 0;
      offsetX = (targetW - drawWidth) / 2;
    }

    ctx.drawImage(frameImage, offsetX, offsetY, drawWidth, drawHeight);
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    ctx.drawImage(video, 0, 0, width, height);

    const frameImage = new Image();
    frameImage.src = frameSrc;
    frameImage.onload = () => {
      drawFrameImage(ctx, frameImage, width, height);
      setPhotoUrl(canvas.toDataURL("image/png"));
      setPhotoTaken(true);
      setPhotoCount((prev) => prev + 1);
    };
  };

  return (
    <div className="flex flex-col items-center flex-1">
      {/* プレビュー領域 */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative">
          <canvas ref={canvasRef} className="hidden" />

          {!photoTaken && (
            <>
              <video
                key="video"
                ref={videoRef}
                autoPlay
                playsInline
                className=" w-full h-full object-contain z-0"
              />
              <img
                src={frameSrc}
                alt="Frame"
                className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
              />
            </>
          )}

          {photoTaken && (
            <>
              <img
                src={photoUrl}
                alt="撮影結果"
                className="w-full h-full object-contain z-0"
              />
              <p className="text-sm text-gray-500 my-3 text-center">
                長押し or 右クリックで保存してください
              </p>
            </>
          )}
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center mt-6 space-x-4 h-[120px] py-2">
        {!photoTaken ? (
          <>
            <button
              onClick={onOpenFrameSelector}
              className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
            >
              🖼️ フレーム選択
            </button>
            <button
              onClick={takePhoto}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              📸 撮影
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-700">
              {photoCount}回目の撮影！ 絆が深まった📸
            </p>
            <button
              onClick={() => {
                setPhotoTaken(false);
                setPhotoUrl(null);
                startCamera();
              }}
              className="bg-gray-400 text-white m-2 p-4 rounded shadow hover:bg-gray-500"
            >
              📸 とりなおす
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
