import { useState } from "react";
import CameraFrame from "./components/CameraFrame";
import FrameSelector from "./components/FrameSelector";

function App() {
  const base = import.meta.env.BASE_URL;
  const [selectedFrame, setSelectedFrame] = useState(
    `${base}frames/frame0.png`
  );
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100  text-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 ">
        デジタルフォトフレーム2
      </h1>

      <CameraFrame
        frameSrc={selectedFrame}
        onOpenFrameSelector={() => setShowSelector(true)}
      />

      {showSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl mx-auto p-4">
            <h2 className="text-lg font-bold mb-4">
              フレームを選択してください
            </h2>
            <FrameSelector
              onSelect={(src) => {
                setSelectedFrame(src);
                setShowSelector(false);
              }}
            />
            <button
              className="mt-4 text-sm text-gray-500 underline"
              onClick={() => setShowSelector(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
