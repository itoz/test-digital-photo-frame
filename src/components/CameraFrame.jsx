import { useEffect, useRef, useState } from "react";

export default function CameraFrame({ frameSrc, onOpenFrameSelector }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    // 実際に表示されているサイズに合わせてcanvasを設定
    const rect = video.getBoundingClientRect();

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    // ピクセル密度対応（Retinaなど）
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    // 映像を描画
    context.drawImage(video, 0, 0, rect.width, rect.height);

    // フレームを描画
    const frameImage = new Image();
    frameImage.src = frameSrc;
    frameImage.onload = () => {
      context.drawImage(frameImage, 0, 0, rect.width, rect.height);
      setPhotoUrl(canvas.toDataURL("image/png"));
      setPhotoTaken(true);
      setPhotoCount((prev) => prev + 1);
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* プレビュー領域 */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* カメラ映像 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-contain z-0 ${
            photoTaken ? "hidden" : ""
          }`}
        />

        {/* 撮影済みcanvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-contain z-0 ${
            photoTaken ? "" : "hidden"
          }`}
        />

        {/* ✅ フレーム画像：プレビュー時のみ表示（2重防止） */}
        {!photoTaken && (
          <img
            src={frameSrc}
            alt="Selected Frame"
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
          />
        )}
      </div>

      {/* ボタン類 */}
      <div className="flex justify-center mt-4 space-x-4">
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
          <>
            <button
              onClick={() => {
                setPhotoTaken(false);
                setPhotoUrl(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
            >
              とりなおす
            </button>
            <a
              href={photoUrl}
              download="photo.png"
              onClick={() => {
                setTimeout(() => {
                  setPhotoTaken(false);
                  setPhotoUrl(null);
                }, 0);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            >
              💾 保存
            </a>
          </>
        )}
      </div>

      {/* 撮影回数 */}
      {photoTaken && (
        <p className="text-sm text-gray-700 mt-2">
          {photoCount}回目の撮影！ 絆が深まった📸
        </p>
      )}
    </div>
  );
}
