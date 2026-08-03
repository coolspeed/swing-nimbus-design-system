"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TabId = "foundations" | "controls" | "data" | "feedback" | "dialogs";
type DialogId = "info" | "confirm" | "file" | "color" | null;
type SortKey = "component" | "status" | "owner" | "updated";
type ComponentRow = Record<SortKey, string>;

const tabs: Array<{ id: TabId; label: string; shortcut: string }> = [
  { id: "foundations", label: "Foundations", shortcut: "F" },
  { id: "controls", label: "Controls", shortcut: "C" },
  { id: "data", label: "Data views", shortcut: "D" },
  { id: "feedback", label: "Feedback", shortcut: "B" },
  { id: "dialogs", label: "Dialogs", shortcut: "L" },
];

const appMenus = [
  { label: "File", items: ["New workspace", "Open…", "Save", "Exit"] },
  { label: "Edit", items: ["Undo", "Redo", "Preferences…"] },
  { label: "Help", items: ["Nimbus guide", "About"] },
] as const;

const palette = [
  ["Canvas", "#D6D9DF", "canvas"],
  ["Surface", "#FFFFFF", "surface"],
  ["Base", "#33628C", "base"],
  ["Focus", "#73A4D1", "focus"],
  ["Selection", "#39698A", "selection"],
  ["Progress", "#BF6204", "progress"],
  ["Blue grey", "#A9B0BE", "blue-grey"],
  ["Success", "#2A7849", "success"],
  ["Information", "#325B95", "information"],
  ["Warning", "#996D19", "warning"],
  ["Danger", "#9D3A3A", "danger"],
  ["Text", "#000000", "text"],
] as const;

const rows: ComponentRow[] = [
  { component: "Button hierarchy", status: "Ready", owner: "D. Kim", updated: "Today" },
  { component: "Form validation", status: "In review", owner: "A. Park", updated: "Yesterday" },
  { component: "Table styling", status: "Ready", owner: "M. Lee", updated: "Jul 28" },
  { component: "Empty states", status: "Draft", owner: "J. Choi", updated: "Jul 25" },
];

const notices = [
  { icon: "✓", title: "Success", detail: "All changes have been saved.", tone: "success" },
  { icon: "i", title: "Information", detail: "A new version is available.", tone: "information" },
  { icon: "!", title: "Warning", detail: "This is a visual design-system demo.", tone: "warning" },
  { icon: "×", title: "Error", detail: "Connection could not be verified.", tone: "danger" },
];

function NimbusButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`nimbus-button ${className}`} {...props}>
      {children}
    </button>
  );
}

function NimbusSelect({
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={`nimbus-select-shell ${className}`}>
      <select className="nimbus-select" {...props}>
        {children}
      </select>
      <span className="nimbus-select-arrow" aria-hidden="true">▼</span>
    </span>
  );
}

function Fieldset({
  legend,
  children,
  className = "",
}: {
  legend: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={`nimbus-fieldset ${className}`}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("foundations");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogId>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const [treeOpen, setTreeOpen] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("component");
  const [sortAscending, setSortAscending] = useState(true);
  const [accent, setAccent] = useState("#33628C");
  const [saved, setSaved] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [viewMode, setViewMode] = useState("Desktop");
  const [dialogOpener, setDialogOpener] = useState<HTMLElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const contextOpenerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuOpenerRef = useRef<HTMLButtonElement | null>(null);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const result = a[sortKey].localeCompare(b[sortKey]);
      return sortAscending ? result : -result;
    });
  }, [sortKey, sortAscending]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setDialog(null);
        setContextOpen(false);
      }
      if (event.altKey) {
        const match = tabs.find((tab) => tab.shortcut.toLowerCase() === event.key.toLowerCase());
        if (match) {
          event.preventDefault();
          setActiveTab(match.id);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!contextOpen) return;
    contextOpenerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      contextMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      contextOpenerRef.current?.focus();
    };
  }, [contextOpen]);

  useEffect(() => {
    if (!openMenu) return;
    const frame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      menuOpenerRef.current?.focus();
    };
  }, [openMenu]);

  const chooseSort = (key: SortKey) => {
    if (sortKey === key) setSortAscending((value) => !value);
    else {
      setSortKey(key);
      setSortAscending(true);
    }
  };

  const showDialog = (id: Exclude<DialogId, null>) => {
    const activeElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDialogOpener(
      activeElement && menuRef.current?.contains(activeElement)
        ? menuOpenerRef.current
        : activeElement,
    );
    setDialog(id);
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let targetIndex: number | null = null;
    if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = tabs.length - 1;
    if (targetIndex === null) return;
    event.preventDefault();
    setActiveTab(tabs[targetIndex].id);
    document.getElementById(`tab-${tabs[targetIndex].id}`)?.focus();
  };

  return (
    <main
      className={`desktop-stage ${gridEnabled ? "grid-enabled" : ""}`}
      style={{ "--nimbus-accent": accent } as React.CSSProperties}
    >
      <section
        className={`app-window view-${viewMode.toLowerCase()} ${previewEnabled ? "preview-enabled" : ""}`}
        aria-label="Nimbus Swing Design System web application"
        aria-hidden={dialog ? true : undefined}
        inert={dialog ? true : undefined}
      >
        <header className="title-bar">
          <div className="app-identity">
            <span className="java-mark" aria-hidden="true">N</span>
            <span>Nimbus Swing Design System</span>
          </div>
          <div className="window-controls" aria-hidden="true">
            <span>—</span><span>□</span><span>×</span>
          </div>
        </header>

        <nav className="menu-bar" aria-label="Application menu">
          {appMenus.map(({ label, items }) => (
            <div className="menu-wrap" key={label}>
              <button
                className="menu-trigger"
                id={`menu-trigger-${label.toLowerCase()}`}
                aria-haspopup="menu"
                aria-controls={`menu-${label.toLowerCase()}`}
                aria-expanded={openMenu === label}
                onClick={(event) => {
                  menuOpenerRef.current = event.currentTarget;
                  setOpenMenu(openMenu === label ? null : label);
                }}
              >
                {label}
              </button>
              {openMenu === label && (
                <div
                  id={`menu-${label.toLowerCase()}`}
                  ref={menuRef}
                  className="drop-menu"
                  role="menu"
                  aria-labelledby={`menu-trigger-${label.toLowerCase()}`}
                  onKeyDown={(event) => {
                    const menuItems = Array.from(
                      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
                    );
                    const current = menuItems.indexOf(document.activeElement as HTMLButtonElement);
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      menuItems[(current + 1 + menuItems.length) % menuItems.length]?.focus();
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      menuItems[(current - 1 + menuItems.length) % menuItems.length]?.focus();
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      menuItems[0]?.focus();
                    } else if (event.key === "End") {
                      event.preventDefault();
                      menuItems.at(-1)?.focus();
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      setOpenMenu(null);
                    }
                  }}
                >
                  {items.map((item, index) => (
                    <button
                      role="menuitem"
                      key={item}
                      className={index === items.length - 1 ? "menu-last" : ""}
                      onClick={() => {
                        if (item === "Open…") showDialog("file");
                        if (item === "About") showDialog("info");
                        if (item === "Save") {
                          setSaved(true);
                          window.setTimeout(() => setSaved(false), 1600);
                        }
                        setOpenMenu(null);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="tool-bar" role="toolbar" aria-label="Main tools">
          <NimbusButton className="tool-primary" title="Create a new workspace">New</NimbusButton>
          <NimbusButton onClick={() => showDialog("file")} title="Open file chooser">Open</NimbusButton>
          <NimbusButton onClick={() => setSaved(true)} title="Save this mock workspace">Save</NimbusButton>
          <span className="tool-separator" />
          <button
            className={`toggle-tool ${gridEnabled ? "active" : ""}`}
            aria-pressed={gridEnabled}
            onClick={() => setGridEnabled((value) => !value)}
          >
            Grid
          </button>
          <button
            className={`toggle-tool ${previewEnabled ? "active" : ""}`}
            aria-pressed={previewEnabled}
            onClick={() => setPreviewEnabled((value) => !value)}
          >
            Preview
          </button>
          <span className="tool-separator" />
          <label htmlFor="viewport-select">View:</label>
          <NimbusSelect
            id="viewport-select"
            value={viewMode}
            onChange={(event) => setViewMode(event.target.value)}
          >
            <option>Desktop</option>
            <option>Tablet</option>
            <option>Mobile</option>
          </NimbusSelect>
          <span className="toolbar-spacer" />
          <span className="theme-chip"><span /> Nimbus native</span>
        </div>

        <section className="page-head">
          <div>
            <h1>Nimbus component showcase</h1>
            <p>A faithful web interpretation of Java Swing&apos;s Nimbus Look &amp; Feel.</p>
          </div>
          <NimbusButton className="hero-action" onClick={() => showDialog("info")}>
            Primary action
          </NimbusButton>
        </section>

        <div className="tab-strip" role="tablist" aria-label="Design system sections">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              data-testid={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <u>{tab.label.slice(0, 1)}</u>{tab.label.slice(1)}
            </button>
          ))}
        </div>

        <div className="content-area">
          {activeTab === "foundations" && <FoundationsPanel />}
          {activeTab === "controls" && <ControlsPanel />}
          {activeTab === "data" && (
            <DataPanel
              treeOpen={treeOpen}
              setTreeOpen={setTreeOpen}
              rows={sortedRows}
              sortKey={sortKey}
              sortAscending={sortAscending}
              chooseSort={chooseSort}
              openContext={() => setContextOpen(true)}
            />
          )}
          {activeTab === "feedback" && (
            <FeedbackPanel />
          )}
          {activeTab === "dialogs" && (
            <DialogsPanel openDialog={showDialog} openContext={() => setContextOpen(true)} />
          )}
        </div>

        <footer className="status-bar">
          <span>Ready <b>•</b> Nimbus Look &amp; Feel</span>
          <span>React catalog <b>•</b> {activeTab} <b>•</b> {viewMode}</span>
        </footer>
      </section>

      {saved && <div className="save-toast" role="status">✓ Workspace saved</div>}

      {contextOpen && (
        <div className="context-shade" onClick={() => setContextOpen(false)}>
          <div
            id="context-menu"
            ref={contextMenuRef}
            className="context-menu"
            role="menu"
            aria-label="Component actions"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              const items = Array.from(
                contextMenuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
              );
              const current = items.indexOf(document.activeElement as HTMLButtonElement);
              if (event.key === "ArrowDown") {
                event.preventDefault();
                items[(current + 1 + items.length) % items.length]?.focus();
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                items[(current - 1 + items.length) % items.length]?.focus();
              } else if (event.key === "Home") {
                event.preventDefault();
                items[0]?.focus();
              } else if (event.key === "End") {
                event.preventDefault();
                items.at(-1)?.focus();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setContextOpen(false);
              }
            }}
          >
            <button role="menuitem" onClick={() => setContextOpen(false)}>Open component</button>
            <button role="menuitem" onClick={() => setContextOpen(false)}>Duplicate</button>
            <hr />
            <button role="menuitem" onClick={() => setContextOpen(false)}>Archive</button>
          </div>
        </div>
      )}

      {dialog && (
        <NimbusDialog
          type={dialog}
          accent={accent}
          setAccent={setAccent}
          restoreFocusTo={dialogOpener}
          onClose={() => setDialog(null)}
        />
      )}
    </main>
  );
}

function FoundationsPanel() {
  return (
    <section id="panel-foundations" role="tabpanel" aria-labelledby="tab-foundations" className="foundation-panel">
      <Fieldset legend="Color foundations" className="palette-fieldset">
        <div className="palette-grid">
          {palette.map(([name, value, tone]) => (
            <article className={`swatch swatch-${tone}`} key={name}>
              <strong>{name}</strong>
              <code>{value}</code>
            </article>
          ))}
        </div>
      </Fieldset>
      <div className="foundation-bottom">
        <Fieldset legend="Typography">
          <div className="type-specimens">
            <p className="type-page">Page title · 20 Bold</p>
            <p className="type-section">Section title · 14 Bold</p>
            <p className="type-strong">Body strong · 12 Bold</p>
            <p>Body · 12 Regular</p>
            <p className="type-caption">Caption · 11 Regular</p>
          </div>
        </Fieldset>
        <Fieldset legend="4 px spacing rhythm">
          <div className="spacing-list">
            {[4, 8, 12, 16, 24, 32].map((space, index) => (
              <div className="spacing-row" key={space}>
                <span>Space {index + 1} · {space} px</span>
                <i style={{ width: `${space * 4}px` }} />
              </div>
            ))}
          </div>
        </Fieldset>
        <Fieldset legend="Component states">
          <div className="state-stack">
            <NimbusButton>Default</NimbusButton>
            <NimbusButton disabled>Disabled</NimbusButton>
            <button className="nimbus-button selected-button" aria-pressed="true">Selected</button>
            <input className="nimbus-input" defaultValue="Editable input" aria-label="Editable input" />
            <input className="nimbus-input read-only" defaultValue="Read-only input" readOnly aria-label="Read-only input" />
            <label className="check-row disabled-control"><input type="checkbox" defaultChecked disabled /><span>Unavailable option</span></label>
          </div>
        </Fieldset>
      </div>
    </section>
  );
}

function ControlsPanel() {
  return (
    <section id="panel-controls" role="tabpanel" aria-labelledby="tab-controls" className="two-column">
      <Fieldset legend="Text input">
        <form className="input-form" onSubmit={(event) => event.preventDefault()}>
          <label><span>Name</span><input className="nimbus-input" data-testid="name-input" defaultValue="Morgan Lee" /></label>
          <label><span>Email</span><input className="nimbus-input" type="email" defaultValue="morgan@example.com" /></label>
          <label><span>Password</span><input className="nimbus-input" type="password" defaultValue="demopass" /></label>
          <label><span>Role</span><NimbusSelect data-testid="role-select" defaultValue="Designer"><option>Designer</option><option>Developer</option><option>Manager</option></NimbusSelect></label>
          <label><span>Date</span><input className="nimbus-input" type="text" defaultValue="2026-07-30" /></label>
          <label><span>Quantity</span><input className="nimbus-input" type="number" defaultValue="0" /></label>
          <label className="notes-field"><span>Notes</span><textarea className="nimbus-input" defaultValue={"Multiline text area\nwith scroll support."} /></label>
        </form>
      </Fieldset>
      <div className="selection-stack">
        <Fieldset legend="Options">
          <label className="check-row"><input type="checkbox" defaultChecked /><span>Enable notifications</span></label>
          <label className="check-row"><input type="checkbox" /><span>Keep workspace private</span></label>
          <label className="check-row disabled-control"><input type="checkbox" defaultChecked disabled /><span>Unavailable option</span></label>
        </Fieldset>
        <Fieldset legend="Plan">
          {["Starter", "Professional", "Enterprise"].map((plan) => (
            <label className="check-row" key={plan}>
              <input type="radio" name="plan" defaultChecked={plan === "Professional"} />
              <span>{plan}</span>
            </label>
          ))}
        </Fieldset>
        <Fieldset legend="Buttons & slider">
          <div className="button-row">
            <NimbusButton>Default</NimbusButton>
            <NimbusButton>Secondary</NimbusButton>
            <NimbusButton disabled>Disabled</NimbusButton>
          </div>
          <input className="nimbus-range" aria-label="Example slider" type="range" defaultValue="65" />
        </Fieldset>
      </div>
    </section>
  );
}

function DataPanel({
  treeOpen,
  setTreeOpen,
  rows,
  sortKey,
  sortAscending,
  chooseSort,
  openContext,
}: {
  treeOpen: boolean;
  setTreeOpen: (value: boolean) => void;
  rows: ComponentRow[];
  sortKey: SortKey;
  sortAscending: boolean;
  chooseSort: (key: SortKey) => void;
  openContext: () => void;
}) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const activities = [
    ["saved", "✓", "Saved workspace settings", "2 min"],
    ["preview", "↗", "Updated preview device", "18 min"],
    ["imported", "+", "Imported sample data", "1 hr"],
  ] as const;

  return (
    <section id="panel-data" role="tabpanel" aria-labelledby="tab-data" className="data-layout">
      <aside className="tree-pane">
        <h2>Project explorer</h2>
        <div className="tree-surface" role="tree" aria-label="Project files">
          <button role="treeitem" aria-selected="false" aria-expanded={treeOpen} onClick={() => setTreeOpen(!treeOpen)}>
            <span className="disclosure">{treeOpen ? "▼" : "▶"}</span><span className="folder-icon" /> Workspace
          </button>
          {treeOpen && (
            <div role="group" className="tree-children">
              <div role="treeitem" aria-selected="false"><span className="disclosure">▶</span><span className="folder-icon" /> Nimbus web</div>
              <div role="treeitem" aria-selected="false"><span className="disclosure ghost">▶</span><span className="file-icon" /> Archived</div>
            </div>
          )}
        </div>
      </aside>
      <div className="splitter" aria-hidden="true"><i /></div>
      <div className="table-pane">
        <div className="table-scroll">
          <table
            data-testid="component-table"
            aria-label="Component status"
            tabIndex={0}
            onContextMenu={(event) => {
              event.preventDefault();
              event.currentTarget.focus();
              openContext();
            }}
          >
            <thead>
              <tr>
                {(["component", "status", "owner", "updated"] as SortKey[]).map((key) => (
                  <th
                    key={key}
                    aria-sort={sortKey === key ? (sortAscending ? "ascending" : "descending") : undefined}
                  >
                    <button onClick={() => chooseSort(key)}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortKey === key && <span aria-label={sortAscending ? "ascending" : "descending"}>{sortAscending ? " ▲" : " ▼"}</span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.component}
                  aria-selected={selectedRow === row.component}
                  tabIndex={0}
                  onClick={() => setSelectedRow(row.component)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedRow(row.component);
                    }
                  }}
                >
                  <td>{row.component}</td>
                  <td>{row.status}</td>
                  <td>{row.owner}</td>
                  <td>{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Fieldset legend="Recent activity" className="activity-panel">
          <ul role="listbox" aria-label="Recent activity">
            {activities.map(([id, icon, label, time]) => (
              <li
                key={id}
                role="option"
                aria-selected={selectedActivity === id}
                tabIndex={0}
                onClick={() => setSelectedActivity(id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedActivity(id);
                  }
                }}
              >
                <span>{icon}</span> {label} <time>{time}</time>
              </li>
            ))}
          </ul>
        </Fieldset>
      </div>
    </section>
  );
}

function FeedbackPanel() {
  const [scrollPosition, setScrollPosition] = useState(50);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLSpanElement>(null);
  const dragOffsetRef = useRef(0);

  const clampScrollPosition = (value: number) => Math.min(100, Math.max(0, value));
  const moveScrollbar = (delta: number) => {
    setScrollPosition((current) => clampScrollPosition(current + delta));
  };
  const updateScrollbarFromPointer = (clientX: number, dragOffset: number) => {
    const track = scrollTrackRef.current;
    if (!track) return;
    const bounds = track.getBoundingClientRect();
    const thumbWidth = scrollThumbRef.current?.getBoundingClientRect().width ?? bounds.width * 0.27;
    const travel = bounds.width - thumbWidth;
    if (travel <= 0) return;
    setScrollPosition(clampScrollPosition(((clientX - bounds.left - dragOffset) / travel) * 100));
  };
  const handleScrollbarKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    let nextPosition: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextPosition = scrollPosition - 10;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") nextPosition = scrollPosition + 10;
    else if (event.key === "PageDown") nextPosition = scrollPosition + 25;
    else if (event.key === "PageUp") nextPosition = scrollPosition - 25;
    else if (event.key === "Home") nextPosition = 0;
    else if (event.key === "End") nextPosition = 100;
    if (nextPosition === null) return;
    event.preventDefault();
    setScrollPosition(clampScrollPosition(nextPosition));
  };

  return (
    <section id="panel-feedback" role="tabpanel" aria-labelledby="tab-feedback" className="two-column">
      <Fieldset legend="Progress indicators">
        <div className="progress-stack">
          <label>Upload progress</label>
          <div className="progress-track" role="progressbar" aria-label="Upload progress" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}>
            <span className="progress-fill" style={{ width: "72%" }} />
            <span className="progress-value">72%</span>
          </div>
          <label>Background task</label>
          <div className="progress-track indeterminate" role="progressbar" aria-label="Background task in progress">
            <span className="progress-indeterminate-pattern" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
            </span>
          </div>
          <label>Horizontal scroll bar</label>
          <div className="fake-scrollbar" role="group" aria-label="Horizontal scrollbar">
            <button
              className="scroll-arrow scroll-arrow-left"
              aria-label="Scroll left"
              disabled={scrollPosition === 0}
              onClick={() => moveScrollbar(-10)}
            >
              <span aria-hidden="true">◀</span>
            </button>
            <div
              className="scroll-track"
              ref={scrollTrackRef}
              onPointerDown={(event) => {
                event.preventDefault();
                const bounds = event.currentTarget.getBoundingClientRect();
                const thumbWidth = scrollThumbRef.current?.getBoundingClientRect().width ?? bounds.width * 0.27;
                updateScrollbarFromPointer(event.clientX, thumbWidth / 2);
              }}
            >
              <span
                className="scroll-thumb"
                ref={scrollThumbRef}
                role="slider"
                tabIndex={0}
                aria-label="Horizontal scroll position"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(scrollPosition)}
                style={{
                  left: `${scrollPosition}%`,
                  transform: `translateX(-${scrollPosition}%)`,
                }}
                onKeyDown={handleScrollbarKeyDown}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  dragOffsetRef.current = event.clientX - event.currentTarget.getBoundingClientRect().left;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    updateScrollbarFromPointer(event.clientX, dragOffsetRef.current);
                  }
                }}
                onPointerUp={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
              />
            </div>
            <button
              className="scroll-arrow scroll-arrow-right"
              aria-label="Scroll right"
              disabled={scrollPosition === 100}
              onClick={() => moveScrollbar(10)}
            >
              <span aria-hidden="true">▶</span>
            </button>
          </div>
          <p className="muted-copy">Determinate, indeterminate and scroll feedback use the native Nimbus orange accent.</p>
        </div>
      </Fieldset>
      <Fieldset legend="Messages">
        <div className="notice-stack">
          {notices.map((notice) => (
            <article className={`notice notice-${notice.tone}`} key={notice.title}>
              <h3><span>{notice.icon}</span> {notice.title}</h3>
              <p>{notice.detail}</p>
            </article>
          ))}
        </div>
      </Fieldset>
    </section>
  );
}

function DialogsPanel({ openDialog, openContext }: { openDialog: (id: Exclude<DialogId, null>) => void; openContext: () => void }) {
  return (
    <section id="panel-dialogs" role="tabpanel" aria-labelledby="tab-dialogs" className="two-column">
      <Fieldset legend="Dialog & menu samples">
        <p>Each button opens a web recreation of a standard Nimbus dialog.</p>
        <div className="dialog-buttons">
          <NimbusButton onClick={() => openDialog("info")}>Information message</NimbusButton>
          <NimbusButton onClick={() => openDialog("confirm")}>Confirmation message</NimbusButton>
          <NimbusButton onClick={() => openDialog("file")}>Open file chooser</NimbusButton>
          <NimbusButton onClick={() => openDialog("color")}>Open color chooser</NimbusButton>
          <NimbusButton onClick={openContext}>Open context menu</NimbusButton>
        </div>
        <p className="muted-copy">Tip: right-click the table in Data views for the same context menu.</p>
      </Fieldset>
      <Fieldset legend="Internal windows" className="desktop-fieldset">
        <div className="internal-desktop">
          <article className="internal-window inspector-window">
            <header><button aria-label="Window menu">▼</button><strong>Inspector</strong><span>— □ ×</span></header>
            <div><p>Selected: <b>Primary action</b></p><p>State: Default</p><label className="check-row"><input type="checkbox" defaultChecked /><span>Visible</span></label></div>
          </article>
          <article className="internal-window preview-window">
            <header><button aria-label="Window menu">▼</button><strong>Preview</strong><span>— □ ×</span></header>
            <div><p>Mini preview</p><div className="progress-track"><span className="progress-fill" style={{ width: "60%" }} /><span className="progress-value">60%</span></div></div>
          </article>
        </div>
      </Fieldset>
    </section>
  );
}

function NimbusDialog({
  type,
  accent,
  setAccent,
  restoreFocusTo,
  onClose,
}: {
  type: Exclude<DialogId, null>;
  accent: string;
  setAccent: (value: string) => void;
  restoreFocusTo: HTMLElement | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target =
        dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        dialogRef.current;
      target?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frame);
      restoreFocusTo?.focus();
    };
  }, [restoreFocusTo]);

  const trapFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => !element.hasAttribute("hidden"));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const titles = { info: "Nimbus Gallery", confirm: "Confirmation", file: "Open a mockup file", color: "Choose an accent color" };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className={`nimbus-dialog dialog-${type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        data-testid={`dialog-${type}`}
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={trapFocus}
      >
        <header><span id="dialog-title">{titles[type]}</span><button onClick={onClose} aria-label="Close dialog">×</button></header>
        {type === "info" && (
          <div className="message-dialog-body"><span className="info-orb">i</span><p>This is an information message.</p></div>
        )}
        {type === "confirm" && (
          <div className="message-dialog-body"><span className="question-orb">?</span><p>Would you like to continue viewing this design system?</p></div>
        )}
        {type === "file" && (
          <div className="file-dialog-body">
            <div className="look-in"><label>Look in:</label><div><span className="folder-icon" /> Documents <b>▼</b></div><NimbusButton>⌂</NimbusButton><NimbusButton>▦</NimbusButton></div>
            <div className="file-grid">
              {["Design tokens", "Nimbus references", "Component specs", "Archived", "Exports", "Java sources", "Web assets", "Research notes"].map((folder) => (
                <button key={folder}><span className="folder-icon" />{folder}</button>
              ))}
            </div>
            <label className="file-field"><span>File name:</span><input className="nimbus-input" /></label>
            <label className="file-field"><span>Files of type:</span><NimbusSelect><option>All files</option><option>PNG images</option><option>Java source</option></NimbusSelect></label>
          </div>
        )}
        {type === "color" && (
          <div className="color-dialog-body">
            <div className="color-preview" style={{ backgroundColor: accent }}><span>{accent.toUpperCase()}</span></div>
            <div className="color-options">
              {["#33628C", "#39698A", "#73A4D1", "#BF6204", "#2A7849", "#9D3A3A"].map((color) => (
                <button
                  key={color}
                  aria-label={`Choose ${color}`}
                  aria-pressed={accent === color}
                  style={{ backgroundColor: color }}
                  onClick={() => setAccent(color)}
                />
              ))}
            </div>
            <label>Custom color <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
          </div>
        )}
        <footer>
          {type === "confirm" && <NimbusButton onClick={onClose}>No</NimbusButton>}
          {type === "file" && <NimbusButton onClick={onClose}>Cancel</NimbusButton>}
          <NimbusButton data-autofocus className="dialog-default" onClick={onClose}>{type === "file" ? "Open" : "OK"}</NimbusButton>
        </footer>
      </section>
    </div>
  );
}
