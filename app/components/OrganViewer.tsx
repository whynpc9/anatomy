"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CircleDashed,
  Layers3,
  Maximize2,
  RotateCcw,
  ScanLine,
  Search,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import type { Hotspot, Organ } from "../lib/anatomy-data";
import type { AnatomyViewer } from "../lib/three/viewer";

type Props = {
  organ: Organ;
  autoRotate: boolean;
  onAutoRotate: (enabled: boolean) => void;
  selectedHotspotId: string | null;
  onHotspotSelect: (id: string | null) => void;
};

export function OrganViewer({
  organ,
  autoRotate,
  onAutoRotate,
  selectedHotspotId,
  onHotspotSelect,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<AnatomyViewer | null>(null);
  const organRef = useRef(organ);
  const autoRotateRef = useRef(autoRotate);
  const selectedHotspotRef = useRef(selectedHotspotId);
  const onHotspotSelectRef = useRef(onHotspotSelect);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slowLoad, setSlowLoad] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // A typical organ is ready well inside a second — flashing a loading panel for
  // that reads as jank. It only appears if the fetch is genuinely slow; the flag
  // is cleared by onLoading when the next load starts.
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setSlowLoad(true), 900);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    organRef.current = organ;
  }, [organ]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    onHotspotSelectRef.current = onHotspotSelect;
  }, [onHotspotSelect]);

  useEffect(() => {
    selectedHotspotRef.current = selectedHotspotId;
    viewerRef.current?.selectHotspot(selectedHotspotId);
  }, [selectedHotspotId]);

  useEffect(() => {
    let cancelled = false;
    let viewer: AnatomyViewer | null = null;

    void import("../lib/three/viewer").then(({ AnatomyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        onSelect: (hotspot) => {
          setSelected(hotspot);
          onHotspotSelectRef.current(hotspot?.id ?? null);
        },
        onLoading: (isLoading, value) => {
          setLoading(isLoading);
          setProgress(value);
          if (isLoading) setSlowLoad(false);
        },
      });
      viewerRef.current = viewer;
      viewer.setAutoRotate(autoRotateRef.current);
      const current = organRef.current;
      void viewer
        .setOrgan(
          current.model,
          current.hotspots,
          current.accent,
          current.viewScale,
          current.hotspotSize,
        )
        .then(() => viewer?.selectHotspot(selectedHotspotRef.current))
        .catch(() => {
          setLoading(false);
          setProgress(0);
        });
    });

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
  }, []);

  useEffect(() => {
    void viewerRef.current
      ?.setOrgan(
        organ.model,
        organ.hotspots,
        organ.accent,
        organ.viewScale,
        organ.hotspotSize,
      )
      .then(() => viewerRef.current?.selectHotspot(selectedHotspotRef.current))
      .catch(() => {
        setLoading(false);
        setProgress(0);
      });
  }, [organ]);

  useEffect(() => viewerRef.current?.setAutoRotate(autoRotate), [autoRotate]);

  // The viewer drives the callout's position directly, so a spinning model
  // never costs a React render.
  const calloutRef = useCallback((node: HTMLDivElement | null) => {
    viewerRef.current?.attachCallout(node);
  }, []);

  const handleTool = (tool: string) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (tool === "rotate") onAutoRotate(!autoRotate);
    if (tool === "zoom") viewer.zoom(-1);
    if (tool === "isolate") setActiveTool(viewer.toggleIsolate() ? tool : null);
    if (tool === "section") setActiveTool(viewer.toggleCrossSection() ? tool : null);
    if (tool === "layers") setActiveTool(viewer.toggleLayers() ? tool : null);
    if (tool === "reset") {
      viewer.reset();
      setActiveTool(null);
    }
  };

  const tools = [
    { id: "rotate", label: "旋转", icon: RotateCcw },
    { id: "zoom", label: "缩放", icon: Search },
    { id: "isolate", label: "隔离", icon: CircleDashed },
    { id: "section", label: "剖面", icon: ScanLine },
    { id: "layers", label: "分层", icon: Layers3 },
    { id: "reset", label: "重置", icon: Undo2 },
  ];

  return (
    <section className="viewer-shell" aria-label={`${organ.name}交互式查看器`}>
      <div className="viewer-glow" style={{ "--organ-accent": organ.accent } as React.CSSProperties} />
      <div ref={mountRef} className="three-mount" />

      <div className="viewer-tools" aria-label="3D 查看器工具">
        {tools.map(({ id, label, icon: Icon }) => {
          // Rotate mirrors the auto-rotate switch rather than the one-shot
          // activeTool state, so the button shows whether spinning is on.
          const pressed = id === "rotate" ? autoRotate : activeTool === id;
          return (
            <button
              key={id}
              type="button"
              className={`tool-button ${pressed ? "active" : ""}`}
              onClick={() => handleTool(id)}
              aria-pressed={pressed}
              title={label}
            >
              <Icon size={19} strokeWidth={1.65} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <aside className="tip-note" aria-label="查看器操作提示">
        <span><Sparkles size={15} /> 提示</span>
        <p>拖动旋转<br />滚轮缩放<br />点击圆点了解结构</p>
      </aside>

      {selected && (
        <div className="hotspot-callout" ref={calloutRef} data-side="right">
          <div className="callout-body" style={{ "--hotspot-color": selected.color } as React.CSSProperties}>
            <button className="callout-close" type="button" onClick={() => viewerRef.current?.clearSelection()} aria-label="关闭">
              <X size={13} />
            </button>
            <b>{selected.label}</b>
            <small>{selected.detail}</small>
          </div>
        </div>
      )}

      {/* Screen-reader equivalent of the dots, which live in the canvas. */}
      <ul className="hotspot-index">
        {organ.hotspots.map((hotspot) => (
          <li key={hotspot.id}>{hotspot.label}：{hotspot.detail}</li>
        ))}
      </ul>

      {loading && slowLoad && (
        <div className="model-loader" role="status" aria-live="polite">
          <div className="loader-orbit"><Maximize2 size={20} /></div>
          <strong>正在准备{organ.name}模型</strong>
          <span>{Math.max(8, Math.round(progress * 100))}%</span>
        </div>
      )}

      <button className="auto-rotate" type="button" onClick={() => onAutoRotate(!autoRotate)} aria-pressed={autoRotate}>
        <RotateCcw size={14} /> 自动旋转
        <span className={`switch ${autoRotate ? "on" : ""}`}><i /></span>
      </button>

      <div className="view-caption">
        <span>3D 标本 · 点击圆点探索结构</span>
        <strong>{organ.scientificName}</strong>
      </div>
    </section>
  );
}
