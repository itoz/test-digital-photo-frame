export default function FrameSelector({ onSelect }) {
  const frames = ["/frames/frame0.png", "/frames/frame1.png"];

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {frames.map((src, idx) => (
        <div
          key={idx}
          className="cursor-pointer border-2 border-gray-300 rounded-lg p-2 bg-gray-50"
        >
          <img
            src={src}
            alt={`Frame ${idx}`}
            className="w-40 border-4 border-transparent hover:border-blue-500 transition"
            onClick={() => onSelect(src)}
          />
          <p className="text-sm mt-2 ">フレーム {idx + 1}</p>
        </div>
      ))}
    </div>
  );
}
