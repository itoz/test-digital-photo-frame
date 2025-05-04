import { useEffect, useRef, useState } from "react";

export default function CameraFrame({ frameSrc, onOpenFrameSelector }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    startCamera(); // 初回起動
  }, []);
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.error("Video play failed:", err);
            });
          };
        }
      })
      .catch((err) => {
        console.error("Camera access denied:", err);
      });
  };
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    // ✅ 実際の映像サイズを使う（これが重要）
    const width = video.videoWidth;
    const height = video.videoHeight;

    // ✅ ピクセルサイズ
    canvas.width = width;
    canvas.height = height;

    // ✅ 見た目サイズ（CSS）※任意（必要なら）
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    // ✅ そのまま描画（scale 不要）
    context.drawImage(video, 0, 0, width, height);

    const frameImage = new Image();
    frameImage.src = frameSrc;
    frameImage.onload = () => {
      // カメラ画像のサイズ
      const targetW = canvas.width;
      const targetH = canvas.height;

      const frameW = frameImage.width;
      const frameH = frameImage.height;

      const frameAspect = frameW / frameH;
      const targetAspect = targetW / targetH;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (frameAspect > targetAspect) {
        // フレームの方が横長 → 幅に合わせて高さ縮める
        drawWidth = targetW;
        drawHeight = targetW / frameAspect;
        offsetX = 0;
        offsetY = (targetH - drawHeight) / 2;
      } else {
        // フレームの方が縦長 → 高さに合わせて幅縮める
        drawHeight = targetH;
        drawWidth = targetH * frameAspect;
        offsetY = 0;
        offsetX = (targetW - drawWidth) / 2;
      }

      // 📷 映像を描画（すでに行っている前提）
      // context.drawImage(video, 0, 0, targetW, targetH);

      // 🖼 フレーム画像を比率を保って中央に描画
      context.drawImage(frameImage, offsetX, offsetY, drawWidth, drawHeight);

      // ✅ 完了
      setPhotoUrl(canvas.toDataURL("image/png"));
      setPhotoTaken(true);
      setPhotoCount((prev) => prev + 1);
    };
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* プレビュー領域 */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* カメラ映像 */}
        {!photoTaken && (
          <video
            key={String(photoTaken)} // ← 毎回再マウントされる
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-contain z-0"
          />
        )}

        {/* 合成用 canvas（非表示） */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 撮影後の画像（canvasと同じ位置） */}
        {photoTaken && (
          <img
            src={photoUrl}
            alt="撮影結果"
            className="absolute inset-0 w-full h-full object-contain z-0"
          />
        )}

        {/* フレーム（常に上に表示）※プレビュー中のみ */}
        {!photoTaken && (
          <img
            src={frameSrc}
            alt="Frame"
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
          />
        )}
      </div>

      {/* ボタン */}
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
          <div div className="flex flex-col items-center">
            <p className="text-sm text-gray-700 mt-2">
              {photoCount}回目の撮影！ 絆が深まった📸
            </p>
            <p className="text-sm text-gray-500 my-3 text-center">
              長押し or 右クリックで保存してください
            </p>
            <button
              onClick={() => {
                setPhotoTaken(false);
                setPhotoUrl(null);
                startCamera(); // ← 再度カメラ接続！
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500"
            >
              とりなおす
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
