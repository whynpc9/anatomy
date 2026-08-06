"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  Heart,
  LibraryBig,
  LocateFixed,
  Search,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { organById, organs, type Organ, type OrganId } from "../lib/anatomy-data";

/**
 * Renders an organ illustration, or its accent glyph for organs that ship as a
 * 3D model without the painted asset set. Keeps every image slot filled instead
 * of leaving a broken `<img>` behind.
 */
function OrganArt({
  organ,
  asset,
  alt,
  size,
}: {
  organ: Organ;
  asset: "thumb" | "organ";
  alt: string;
  size?: number;
}) {
  if (!organ.illustrated) {
    // An empty alt means a surrounding control already names this, so the
    // glyph should be skipped rather than announced with no label.
    const labelling = alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true };
    return (
      <span className="art-fallback" style={{ "--art-accent": organ.accent } as React.CSSProperties} {...labelling}>
        {organ.icon}
      </span>
    );
  }
  return (
    <img
      key={`${organ.id}-${asset}`}
      src={`/anatomy/${organ.id}/${asset}.webp`}
      alt={alt}
      width={size}
      height={size}
      loading={asset === "thumb" ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function AnatomyApp() {
  const [organId, setOrganId] = useState<OrganId>("heart");
  const [autoRotate, setAutoRotate] = useState(true);
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("全部");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
  const systems = useMemo(() => ["全部", ...new Set(organs.map((item) => item.system))], []);
  const filteredOrgans = useMemo(
    () => organs.filter((item) => {
      const matchesSystem = system === "全部" || item.system === system;
      const searchText = `${item.name} ${item.scientificName} ${item.system}`.toLowerCase();
      return matchesSystem && searchText.includes(query.trim().toLowerCase());
    }),
    [query, system],
  );

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power2.out", overwrite: true },
    );
  }, [organId]);

  const selectOrgan = (id: OrganId) => {
    if (organById[id].illustrated) {
      const image = new Image();
      image.src = `/anatomy/${id}/organ.webp`;
    }
    setOrganId(id);
    setSelectedHotspotId(null);
    setMobileLibrary(false);
  };

  // Warms the model in the HTTP cache while the pointer is still travelling,
  // so the switch usually renders without a visible loading pass.
  const prefetchOrgan = (id: OrganId) => {
    if (id === organId || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(organById[id].model, { priority: "low" } as RequestInit).catch(() => {});
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => selectOrgan("heart")} aria-label="解剖工坊首页">
          <strong>解剖工坊<sup>✦</sup></strong>
          <em>人体器官 3D 图鉴</em>
        </button>
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label="打开器官库"><LibraryBig size={20} /></button>
      </header>

      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>器官库</span>
            <button aria-label="关闭器官库" className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索器官或系统…" />
          </label>
          <div className="system-filters" aria-label="按系统筛选">
            {systems.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={system === item}
                className={system === item ? "active" : ""}
                onClick={() => setSystem(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="organ-list">
            {filteredOrgans.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`organ-item ${organId === item.id ? "active" : ""}`}
                onClick={() => selectOrgan(item.id)}
                onPointerEnter={() => prefetchOrgan(item.id)}
                onFocus={() => prefetchOrgan(item.id)}
                style={{ "--item-accent": item.accent } as React.CSSProperties}
              >
                <span className="organ-glyph">
                  <OrganArt organ={item} asset="thumb" alt={`${item.name}缩略图`} size={47} />
                </span>
                <span><b>{item.name}</b><small>{item.system}</small></span>
                {organId === item.id && <Heart className="favorite" size={14} fill="currentColor" />}
              </button>
            ))}
            {filteredOrgans.length === 0 && <p className="empty-library">没有匹配的器官</p>}
          </div>
        </aside>

        <OrganViewer
          organ={organ}
          autoRotate={autoRotate}
          onAutoRotate={setAutoRotate}
          selectedHotspotId={selectedHotspotId}
          onHotspotSelect={setSelectedHotspotId}
        />

        <aside className="info-panel" ref={contentRef}>
          <div className="info-kicker" data-reveal><Heart size={13} fill="currentColor" /> {organ.name}</div>
          <div className="info-title-row" data-reveal>
            <div><h1>{organ.name}</h1><em>{organ.poetic}</em></div>
            <span className="specimen-stamp">
              <OrganArt organ={organ} asset="organ" alt={`${organ.name}解剖插图`} size={92} />
            </span>
          </div>
          <p className="description" data-reveal>{organ.description}</p>
          <section className="hotspot-nav" aria-label={`${organ.name}结构导航`} data-reveal>
            <div className="hotspot-nav-heading">
              <h2><LocateFixed size={14} /> 结构导航</h2>
              <small>点击在模型中定位</small>
            </div>
            <div className="hotspot-nav-list">
              {organ.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  type="button"
                  className={selectedHotspotId === hotspot.id ? "active" : ""}
                  aria-pressed={selectedHotspotId === hotspot.id}
                  aria-label={`${hotspot.label}：${hotspot.detail}`}
                  title={hotspot.detail}
                  onClick={() => setSelectedHotspotId(
                    selectedHotspotId === hotspot.id ? null : hotspot.id,
                  )}
                  style={{ "--hotspot-color": hotspot.color } as React.CSSProperties}
                >
                  <span />
                  {hotspot.label}
                </button>
              ))}
            </div>
          </section>
          <div className="rule" />
          <h2 data-reveal>关键数据</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> 大小</dt><dd>{organ.size}</dd></div>
            <div data-reveal><dt><span>♙</span> 重量</dt><dd>{organ.weight}</dd></div>
            <div data-reveal><dt><span>⌁</span> 每日</dt><dd>{organ.dailyFact}</dd></div>
            <div data-reveal><dt><span>⌖</span> 位置</dt><dd>{organ.location}</dd></div>
            <div data-reveal><dt><span>❋</span> 血液供应</dt><dd>{organ.bloodSupply}</dd></div>
            <div data-reveal><dt><span>◈</span> 功能</dt><dd>{organ.function}</dd></div>
          </dl>
          <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>医学意义</b>{organ.medical}</p></div>
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>你知道吗</b>{organ.funFact}</p></div>
        </aside>
      </div>

      {mobileLibrary && <button className="drawer-backdrop" aria-label="关闭器官库" onClick={() => setMobileLibrary(false)} />}
    </main>
  );
}
