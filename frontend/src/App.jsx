import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import {
  getOverlays,
  createOverlay,
  updateOverlay,
  deleteOverlay,
} from "./api";

export default function App() {
  const [overlays, setOverlays] = useState([]);
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetchOverlays = async () => {
    const data = await getOverlays();
    setOverlays(data);
  };

  useEffect(() => {
    fetchOverlays();
    const i = setInterval(fetchOverlays, 1500);
    return () => clearInterval(i);
  }, []);

  const addOverlay = async () => {
    if (!text.trim()) return;
    await createOverlay({
      type: "text",
      content: text,
      x: 60,
      y: 60,
      width: 220,
      height: 50,
    });
    setText("");
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        boxSizing: "border-box",
      }}
      onClick={() => setSelectedId(null)}
    >
      <div style={{ marginBottom: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter overlay text..."
          style={{
            padding: 8,
            marginRight: 8,
            width: 260,
            borderRadius: 4,
            border: "none",
            outline: "none",
          }}
        />
        <button
          onClick={addOverlay}
          style={{
            padding: "8px 14px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Add Text Overlay
        </button>
      </div>

      <div
        style={{
          position: "relative",
          width: 800,
          border: "2px solid #333",
        }}
      >
        <video
          src="http://localhost:5000/stream/stream.m3u8"
          controls
          autoPlay
          style={{
            width: "100%",
            display: "block",
            position: "relative",
            zIndex: 1,
          }}
        />

        {overlays.map((o) => (
          <Rnd
            key={o._id}
            size={{ width: o.width, height: o.height }}
            position={{ x: o.x, y: o.y }}
            bounds="parent"
            style={{ zIndex: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(o._id);
            }}
            onDragStop={(e, d) => updateOverlay(o._id, { x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) =>
              updateOverlay(o._id, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: pos.x,
                y: pos.y,
              })
            }
            onDoubleClick={() => deleteOverlay(o._id)}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.6)",
                border:
                  o._id === selectedId
                    ? "2px solid #22c55e"
                    : "1px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "move",
                fontSize: 16,
                userSelect: "none",
              }}
            >
              {o.content}
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
