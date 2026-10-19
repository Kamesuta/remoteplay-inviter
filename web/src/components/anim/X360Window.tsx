import type { CSSProperties, ReactNode } from "react";

// A simplified x360ce 4.26.38 window drawn on a 720x480 stage: the real layout,
// labels and colors, with the parts the guide doesn't need left out.
// Animations toggle classes on their root to drive it (see x360.css).

type BoxProps = { x: number; y: number; w?: number; h?: number; style?: CSSProperties; className?: string; children?: ReactNode };

export function W({ x, y, w, h, style, className, children }: BoxProps) {
  return (
    <div className={className ? `w ${className}` : "w"} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}

const Svg = ({ viewBox, children }: { viewBox: string; children: ReactNode }) => (
  <svg width="100%" height="100%" viewBox={viewBox} aria-hidden="true">
    {children}
  </svg>
);

export const PadIcon = () => (
  <Svg viewBox="0 0 48 36">
    <path d="M10 10 C10 6 14 5 18 6 L30 6 C34 5 38 6 38 10 L44 26 C46 33 38 35 34 29 L31 24 L17 24 L14 29 C10 35 2 33 4 26 Z" fill="#b8c4d6" stroke="#5f6f8a" strokeWidth="1.5" />
    <circle cx="16" cy="14" r="4" fill="#5f6f8a" />
    <circle cx="33" cy="12" r="2" fill="#3b7fd6" />
    <circle cx="36" cy="16" r="2" fill="#d6453b" />
    <circle cx="30" cy="16" r="2" fill="#3a9a3a" />
  </Svg>
);
const PlusIcon = () => (
  <Svg viewBox="0 0 16 16">
    <path d="M6 1h4v5h5v4h-5v5H6v-5H1V6h5z" fill="#3fae3f" stroke="#2a7a2a" strokeWidth=".8" />
  </Svg>
);
const CrossIcon = () => (
  <Svg viewBox="0 0 16 16">
    <path d="M2 4.5L4.5 2 8 5.5 11.5 2 14 4.5 10.5 8 14 11.5 11.5 14 8 10.5 4.5 14 2 11.5 5.5 8z" fill="#e0503a" stroke="#a83020" strokeWidth=".7" />
  </Svg>
);
const DiskIcon = () => (
  <Svg viewBox="0 0 16 16">
    <rect x="1" y="1" width="14" height="14" rx="1.5" fill="#3b6fb6" />
    <rect x="4" y="1.5" width="8" height="5" fill="#e9eef5" />
    <rect x="4" y="9" width="8" height="6" fill="#2a4f86" />
  </Svg>
);
const CheckBox = ({ checked }: { checked: boolean }) => (
  <Svg viewBox="0 0 18 18">
    <rect x="1" y="1" width="16" height="16" rx="1" fill="#ffffff" stroke={checked ? "#5c9a5c" : "#6f8f6f"} strokeWidth="1.6" />
    {checked && <path d="M4 9.5l3.2 3.2L14 5.5" fill="none" stroke="#2f9a2f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);
const WarnIcon = () => (
  <Svg viewBox="0 0 16 16">
    <path d="M8 1.5L15 14H1z" fill="#f5c518" stroke="#b08800" strokeWidth="1" />
    <path d="M8 6v4" stroke="#3a2a00" strokeWidth="1.6" />
    <circle cx="8" cy="12" r=".9" fill="#3a2a00" />
  </Svg>
);
const OkIcon = () => (
  <Svg viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#c8c8c8" />
    <path d="M4.5 8.2l2.3 2.3 4.6-4.8" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);
const TabSquare = ({ fill }: { fill: string }) => <div className="w" style={{ inset: 0, background: fill, border: "1px solid #8a8a8a" }} />;
const ControllerFront = () => (
  <Svg viewBox="0 0 234 162">
    <path d="M40 40 C40 20 62 14 86 18 L148 18 C172 14 194 20 194 40 L214 110 C222 146 184 156 166 128 L150 106 L84 106 L68 128 C50 156 12 146 20 110 Z" fill="#f7f7f7" stroke="#c8c8c8" strokeWidth="2" />
    <path d="M30 118 C34 146 60 150 72 128 L84 110 L150 110 L162 128 C174 150 200 146 204 118" fill="none" stroke="#7a7a7a" strokeWidth="6" />
    <circle cx="62" cy="58" r="17" fill="#bdbdbd" />
    <circle cx="62" cy="58" r="12" fill="#5f5f5f" />
    <circle cx="96" cy="88" r="17" fill="#bdbdbd" />
    <path d="M90 88h12M96 82v12" stroke="#4a4a4a" strokeWidth="6" />
    <circle cx="146" cy="88" r="17" fill="#bdbdbd" />
    <circle cx="146" cy="88" r="12" fill="#5f5f5f" />
    <circle cx="117" cy="40" r="11" fill="#c9c9c9" stroke="#e4d63a" strokeWidth="2.5" />
    <path d="M112 35l10 10M122 35l-10 10" stroke="#3a9a3a" strokeWidth="2.5" />
    <circle cx="172" cy="38" r="7" fill="#f2c230" />
    <circle cx="160" cy="50" r="7" fill="#3b6fd6" />
    <circle cx="184" cy="50" r="7" fill="#e0503a" />
    <circle cx="172" cy="62" r="7" fill="#3fae3f" />
  </Svg>
);

const button = (extra?: CSSProperties): CSSProperties => ({ background: "#fdfdfd", border: "1px solid #adadad", borderRadius: 4, textAlign: "center", lineHeight: "30px", ...extra });

function Field({ x, y, w, value, fill, index }: { x: number; y: number; w: number; value?: string; fill?: boolean; index: number }) {
  return (
    <W x={x} y={y} w={w} h={26} className={value && fill ? "cbf" : undefined} style={{ background: "#ffffff", border: "1px solid #c4c4c4", borderRadius: 2 }}>
      {value && (
        <span className={fill ? `fv f${index}` : undefined} style={{ position: "absolute", left: 8, top: 3 }}>
          {value}
        </span>
      )}
      <span style={{ position: "absolute", right: 6, top: 5, fontSize: 9, color: "#555555" }}>▼</span>
    </W>
  );
}

// Window frame: title bar and Save All
export function Frame() {
  return (
    <>
      <W x={20} y={14} w={680} h={452} style={{ background: "#f0f0f0", border: "1px solid #9a9a9a", borderRadius: 12, boxShadow: "0 18px 40px rgba(0,0,0,.4)" }} />
      <W x={21} y={15} w={678} h={36} style={{ background: "#ffffff", borderRadius: "11px 11px 0 0" }} />
      <W x={32} y={23} w={26} h={20}>
        <PadIcon />
      </W>
      <W x={66} y={24} style={{ fontWeight: 700 }}>X360 Controller Emulator</W>
      <W x={612} y={33} w={12} h={1} style={{ background: "#333333" }} />
      <W x={642} y={27} w={11} h={11} style={{ border: "1px solid #333333" }} />
      <W x={670} y={21} style={{ fontSize: 16 }}>✕</W>
      <W x={572} y={58} w={118} h={30} style={button()} />
      <W x={582} y={65} w={17} h={17}>
        <DiskIcon />
      </W>
      <W x={606} y={63} className="sva" style={{ fontWeight: 700 }}>Save All</W>
    </>
  );
}

const TABS = [
  { x0: 30, x1: 160, label: "Controller 1", kind: "c1" },
  { x0: 160, x1: 290, label: "Controller 2", kind: "grey" },
  { x0: 290, x1: 380, label: "Options", kind: "" },
  { x0: 380, x1: 480, label: "Issues", kind: "issues" },
] as const;

// Tabs. `issues` sets the Issues tab icon; "swap" draws both and lets CSS pick
export function Tabs({ issues }: { issues: "ok" | "warn" | "swap" }) {
  const raised: CSSProperties = { background: "#ffffff", border: "1px solid #cfcfcf", borderBottom: "none", borderRadius: "6px 6px 0 0" };
  return (
    <>
      <W x={21} y={92} w={678} h={1} style={{ background: "#cfcfcf" }} />
      {TABS.map((tab) => (
        <W key={tab.label} x={tab.x0} y={60} w={tab.x1 - tab.x0} h={32} style={{ background: "#f6f6f6", border: "1px solid #d4d4d4", borderBottom: "none", borderRadius: "4px 4px 0 0" }} />
      ))}
      <W x={30} y={56} w={130} h={37} className="ts-c1" style={raised} />
      <W x={380} y={56} w={100} h={37} className="ts-is" style={raised} />
      {TABS.map((tab) =>
        tab.kind === "c1" || tab.kind === "grey" ? (
          <span key={tab.label}>
            <W x={tab.x0 + 12} y={70} w={13} h={13}>
              <TabSquare fill={tab.kind === "c1" ? "linear-gradient(135deg,#3cb043 50%,#3b7fd6 50%)" : "#d4d4d4"} />
            </W>
            <W x={tab.x0 + 32} y={66}>{tab.label}</W>
          </span>
        ) : tab.kind === "issues" ? (
          <span key={tab.label}>
            {issues !== "warn" && (
              <W x={tab.x0 + 12} y={66} w={20} h={20} className="ic-ok">
                <OkIcon />
              </W>
            )}
            {issues !== "ok" && (
              <W x={tab.x0 + 12} y={66} w={20} h={20} className="ic-warn">
                <WarnIcon />
              </W>
            )}
            <W x={tab.x0 + 40} y={66}>{tab.label}</W>
          </span>
        ) : (
          <W key={tab.label} x={tab.x0 + 16} y={66}>
            {tab.label}
          </W>
        ),
      )}
    </>
  );
}

const LEFT = [["Trigger", "Button 16"], ["Bumper", "Button 18"], ["Stick Up", "Button 17"], ["Stick Left", "Button 30"], ["Stick Right", "Button 32"], ["Stick Down", "Button 31"]] as const;
const RIGHT = [["Trigger", "Button 22"], ["Bumper", "Button 24"], ["Y Button", "Button 23"], ["X Button", "Button 36"], ["B Button", "Button 38"], ["A Button", "Button 37"]] as const;

interface ControllerPageProps {
  // Product name of the keyboard, as Windows names it in the viewer's language
  keyboard: string;
  // "row": the device row appears when the root gets .row
  device: "on" | "none" | "row";
  // "toggle": unchecked until the root gets .on
  enable: "on" | "off" | "toggle";
  // "fill": the values fade in when the root gets .fill
  values: "on" | "none" | "fill";
}

// The Controller 1 tab: Enable, device list, mapping fields and the preset buttons
export function ControllerPage({ keyboard, device, enable, values }: ControllerPageProps) {
  const showValues = values !== "none";
  const fill = values === "fill";
  const row = (
    <>
      <W x={30} y={166} w={660} h={32} style={{ background: "#0078d7" }} />
      <W x={56} y={175} w={13} h={13} style={{ background: "#3cb043", border: "1px solid #ffffff" }} />
      <W x={130} y={172} style={{ color: "#ffffff" }}>6F1D2B61</W>
      <W x={260} y={172} style={{ color: "#ffffff" }}>DirectInput</W>
      <W x={390} y={172} style={{ color: "#ffffff", fontWeight: 700 }}>{keyboard}</W>
    </>
  );
  return (
    <>
      {enable !== "off" && (
        <>
          <W x={30} y={100} w={250} h={34} className={enable === "toggle" ? "eon" : undefined} style={{ background: "#cce8ff", border: "1px solid #99d1ff", borderRadius: 3 }} />
          <W x={36} y={106} w={22} h={22} className={enable === "toggle" ? "eon" : undefined}>
            <CheckBox checked />
          </W>
        </>
      )}
      {enable !== "on" && (
        <W x={36} y={106} w={22} h={22} className={enable === "toggle" ? "eoff" : undefined}>
          <CheckBox checked={false} />
        </W>
      )}
      <W x={66} y={108} style={{ fontWeight: 700 }}>Enable 1 Mapped Device</W>
      <W x={520} y={106} w={22} h={22}>
        <PlusIcon />
      </W>
      <W x={546} y={108} className="addb">Add...</W>
      <W x={604} y={105} w={24} h={24}>
        <CrossIcon />
      </W>
      <W x={630} y={108}>Remove</W>

      <W x={30} y={140} w={660} h={62} style={{ background: "#ffffff", border: "1px solid #d4d4d4" }} />
      <W x={30} y={140} w={70} h={24} style={{ background: "#3d8ee0" }} />
      {[[38, "Online"], [130, "Instance ID"], [260, "Source"], [390, "Product Name"]].map(([x, s]) => (
        <W key={s} x={x as number} y={143} style={{ fontSize: 12.5, color: "#333333" }}>
          {s}
        </W>
      ))}
      {device === "on" && row}
      {device === "row" && (
        <div className="w x-row en" style={{ left: 0, top: 0 }}>
          {row}
        </div>
      )}

      <W x={30} y={208} w={660} h={206} style={{ border: "1px solid #d4d4d4", borderRadius: 4, background: "#f6f6f6" }} />
      {LEFT.map(([label, value], r) => (
        <span key={`l${r}`}>
          <W x={42} y={220 + r * 32} style={{ fontSize: 13 }}>{label}</W>
          <Field x={132} y={216 + r * 32} w={112} value={showValues ? value : undefined} fill={fill} index={r} />
        </span>
      ))}
      <W x={262} y={246} w={196} h={136}>
        <ControllerFront />
      </W>
      {RIGHT.map(([label, value], r) => (
        <span key={`r${r}`}>
          <W x={476} y={220 + r * 32} style={{ fontSize: 13 }}>{label}</W>
          <Field x={566} y={216 + r * 32} w={112} value={showValues ? value : undefined} fill={fill} index={6 + r} />
        </span>
      ))}
      <W x={30} y={424} w={170} h={32} className="gcb" style={button()}>Game Controllers...</W>
      <W x={388} y={424} w={130} h={32} style={button()}>Copy Preset</W>
      <W x={526} y={424} w={164} h={32} className="psb" style={button({ fontWeight: 700 })}>Paste Preset</W>
    </>
  );
}

// The Issues tab with the Virtual Device Driver issue; .ins shows the install spinner, .ok clears it
export function IssuesPage({ description }: { description: string }) {
  return (
    <>
      <W x={30} y={100} w={660} h={314} style={{ background: "#ffffff", border: "1px solid #d4d4d4" }} />
      {[[76, "Name"], [280, "Description"], [588, "Solution"]].map(([x, s]) => (
        <W key={s} x={x as number} y={104} style={{ fontSize: 12.5, color: "#333333" }}>
          {s}
        </W>
      ))}
      <div className="w irow" style={{ left: 0, top: 0 }}>
        <W x={30} y={128} w={660} h={46} style={{ background: "#0078d7" }} />
        <W x={40} y={137} w={28} h={28} style={{ borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f07a6a, #c42b1c 70%)", border: "1px solid #8a1a10" }}>
          <span style={{ position: "absolute", left: 7, top: 2, color: "#ffffff", fontWeight: 700, fontSize: 16 }}>✕</span>
        </W>
        <W x={76} y={141} style={{ color: "#ffffff", fontWeight: 700 }}>Virtual Device Driver</W>
        <W x={280} y={142} style={{ color: "#dbeafe", fontSize: 13 }}>{description}</W>
        <W x={578} y={134} w={102} h={34} className="insb" style={button({ background: "#e1e1e1", lineHeight: "32px", fontWeight: 700 })}>
          <span className="il">Install</span>
          <span className="ib">
            <i className="spin" />
          </span>
        </W>
      </div>
      <W x={30} y={414} w={660} h={44} style={{ borderTop: "1px solid #d4d4d4" }} />
      <W x={46} y={426} className="aok" style={{ fontWeight: 700, fontSize: 16, color: "#1e7d1e" }}>
        All OK. No issues were found.
      </W>
    </>
  );
}

// The "Map Device To Controller" dialog; .sel highlights the keyboard row
export function MapDeviceDialog({ keyboard, mouse }: { keyboard: string; mouse: string }) {
  const rows = [
    { id: "6F1D2B61", name: keyboard, online: true },
    { id: "6F1D2B60", name: mouse, online: true },
    { id: "E5064A00", name: "Wireless Gamepad", online: false },
    { id: "F2612C60", name: "Wireless Gamepad", online: false },
  ];
  return (
    <>
      <W x={140} y={104} w={440} h={340} style={{ background: "#f0f0f0", border: "1px solid #8a8a8a", borderRadius: 12, boxShadow: "0 18px 44px rgba(0,0,0,.45)" }} />
      <W x={141} y={105} w={438} h={36} style={{ background: "#ffffff", borderRadius: "11px 11px 0 0" }} />
      <W x={152} y={113} w={24} h={18}>
        <PadIcon />
      </W>
      <W x={184} y={114} style={{ fontWeight: 700 }}>Map Device To Controller</W>
      <W x={552} y={110} style={{ fontSize: 16, color: "#555555" }}>✕</W>
      <W x={152} y={150} w={416} h={238} style={{ background: "#ffffff", border: "1px solid #d4d4d4", borderRadius: 4 }} />
      <W x={152} y={150} w={30} h={26} style={{ background: "#3d8ee0" }} />
      <W x={200} y={154} style={{ fontSize: 12.5, color: "#333333" }}>Instance ID</W>
      <W x={320} y={154} style={{ fontSize: 12.5, color: "#333333" }}>Product Name</W>
      {rows.map((row, i) => {
        const y = 180 + i * 38;
        const color = row.online ? "#1f1f1f" : "#9a9a9a";
        const cls = i === 0 ? "kt" : undefined;
        return (
          <span key={row.id}>
            {i === 0 && <W x={154} y={y} w={412} h={36} className="ksel" style={{ background: "#0078d7" }} />}
            <W x={166} y={y + 11} w={13} h={13} style={{ background: row.online ? "#3cb043" : "#d0d0d0", border: `1px solid ${row.online ? "#2a8a2a" : "#a0a0a0"}` }} />
            <W x={200} y={y + 9} className={cls} style={{ color }}>{row.id}</W>
            <W x={320} y={y + 9} className={cls} style={{ color, fontWeight: row.online ? 700 : 400 }}>{row.name}</W>
          </span>
        );
      })}
      <W x={316} y={398} w={180} h={36} className="asd" style={{ background: "#e5f1fb", border: "2px solid #0078d7", borderRadius: 4, textAlign: "center", lineHeight: "32px", fontWeight: 700 }}>
        Add Selected Device
      </W>
      <W x={504} y={398} w={66} h={36} style={button({ lineHeight: "34px" })}>Cancel</W>
    </>
  );
}

export function Window({ children }: { children: ReactNode }) {
  return <div className="xw">{children}</div>;
}

// A green callout with an optional arrow; it appears when the root gets the class in `show`
export function Callout({ show, x, y, arrow, light, children }: { show: string; x: number; y: number; arrow?: ["up" | "down", number]; light?: boolean; children: ReactNode }) {
  const bg = light ? "#ffffff" : "#a4d007";
  return (
    <div
      className={`ab en x-${show}`}
      style={{ left: x, top: y, height: 32, padding: "0 14px", borderRadius: 999, background: bg, color: light ? "#15222f" : "#16210a", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", whiteSpace: "nowrap", boxShadow: "0 6px 16px rgba(0,0,0,.3)" }}
    >
      {children}
      {arrow && <span style={{ position: "absolute", left: arrow[1], [arrow[0] === "up" ? "top" : "bottom"]: -6, width: 12, height: 12, background: bg, transform: "rotate(45deg)" }} />}
    </div>
  );
}

export function Ripples({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`ab rg r${i + 1}`} />
      ))}
    </>
  );
}

export function Cursor() {
  return (
    <svg className="cur" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#ffffff" stroke="#111d2c" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export const stageStyle: CSSProperties = { position: "relative", width: 720, height: 480, background: "#111d2c", borderRadius: 18, overflow: "hidden" };
