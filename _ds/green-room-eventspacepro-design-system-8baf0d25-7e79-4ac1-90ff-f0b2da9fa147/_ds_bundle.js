/* @ds-bundle: {"format":4,"namespace":"GreenRoomEventSpaceProDesignSystem_8baf0d","components":[{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"EventCard","sourcePath":"components/data-display/EventCard.jsx"},{"name":"ProjectCard","sourcePath":"components/data-display/ProjectCard.jsx"},{"name":"ToolbarButton","sourcePath":"components/editor/ToolbarButton.jsx"},{"name":"Panel","sourcePath":"components/feedback/Panel.jsx"},{"name":"PanelItem","sourcePath":"components/feedback/Panel.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"}],"sourceHashes":{"components/data-display/Badge.jsx":"b6d094ef3689","components/data-display/EventCard.jsx":"30317eadafef","components/data-display/ProjectCard.jsx":"97ac28b34921","components/editor/ToolbarButton.jsx":"9cbbea60b0b2","components/feedback/Panel.jsx":"11d7ff00fc1b","components/forms/Button.jsx":"394f8e899485","components/forms/Input.jsx":"c7603286d8de","components/navigation/SidebarNav.jsx":"7c39a9d94f02"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GreenRoomEventSpaceProDesignSystem_8baf0d = window.GreenRoomEventSpaceProDesignSystem_8baf0d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data-display/Badge.jsx
try { (() => {
function Badge({
  tone = "neutral",
  children,
  icon
}) {
  const tones = {
    neutral: {
      background: "rgba(39,34,53,0.06)",
      color: "var(--ink-900)"
    },
    accent: {
      background: "var(--accent)",
      color: "#fff"
    },
    success: {
      background: "var(--mint-100)",
      color: "#0d6b45"
    },
    dark: {
      background: "rgba(0,0,0,0.5)",
      color: "#fff"
    },
    favorite: {
      background: "rgba(255,255,255,0.85)",
      color: "#eab308"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 11,
      backdropFilter: tone === "dark" || tone === "favorite" ? "blur(4px)" : "none",
      ...t
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/EventCard.jsx
try { (() => {
function EventCard({
  title = "Annual Dinner Gala",
  date = "Sept 15, 2025",
  meta = "250/300 Guests · $8,000 of $10,000",
  favorited = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 24,
      background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(102,102,102,0.02) 100%)",
      boxShadow: "var(--shadow-card)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      width: 300,
      boxSizing: "border-box",
      position: "relative"
    }
  }, favorited && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "favorite"
  }, "\u2605")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 14,
      color: "var(--ink-900)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Upcoming Event"), /*#__PURE__*/React.createElement("span", null, date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: "-0.03em",
      color: "var(--ink-900)"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, meta)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: "none",
      borderRadius: 999,
      background: "var(--accent)",
      color: "#fff",
      padding: "10px 20px",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 14
    }
  }, "View Details"), /*#__PURE__*/React.createElement("button", {
    style: {
      border: "none",
      borderRadius: 999,
      background: "var(--ink-900)",
      color: "#fff",
      padding: "10px 20px",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 14
    }
  }, "Edit")));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/ProjectCard.jsx
try { (() => {
function ProjectCard({
  name = "Untitled Project",
  eventCount = 0,
  updated = "Today"
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 12,
      border: "1px solid var(--line-300)",
      overflow: "hidden",
      cursor: "pointer",
      boxShadow: hover ? "var(--shadow-dropdown)" : "none",
      borderColor: hover ? "var(--blue-500)" : "var(--line-300)",
      transition: "box-shadow 150ms ease, border-color 150ms ease",
      width: 280,
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140,
      background: "var(--surface-sunken-2)",
      borderBottom: "1px solid var(--line-100)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 16,
      color: "#111827"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: 12,
      color: "var(--gray-500)",
      marginTop: 4
    }
  }, eventCount, " ", eventCount === 1 ? "event" : "events", " \xB7 Updated ", updated)));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/editor/ToolbarButton.jsx
try { (() => {
function ToolbarButton({
  label,
  icon,
  active = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: label,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      border: "none",
      borderRadius: 8,
      padding: "8px 12px",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 13,
      cursor: "pointer",
      background: active ? "var(--accent)" : "#F3F4F6",
      color: active ? "#fff" : "#374151",
      transition: "background 120ms ease"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1
    }
  }, icon), label);
}
Object.assign(__ds_scope, { ToolbarButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/editor/ToolbarButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Panel.jsx
try { (() => {
function Panel({
  children,
  width = 320,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      borderRadius: 16,
      background: "#fff",
      boxShadow: "var(--shadow-dropdown)",
      border: "1px solid var(--line-100)",
      overflow: "hidden"
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid var(--line-100)",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 14,
      color: "var(--ink-900)"
    }
  }, title), /*#__PURE__*/React.createElement("div", null, children));
}
function PanelItem({
  children,
  icon,
  tone = "default",
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const color = tone === "danger" ? "#dc2626" : "#374151";
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 13,
      color,
      background: hover ? tone === "danger" ? "#fef2f2" : "#f9fafb" : "transparent"
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Panel, PanelItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Panel.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const sizes = {
  md: {
    padding: "12px 24px",
    fontSize: 18,
    height: 46
  },
  lg: {
    padding: "16px 24px",
    fontSize: 18,
    height: 54
  },
  sm: {
    padding: "8px 16px",
    fontSize: 14,
    height: 36
  }
};
const variants = {
  primary: {
    background: "var(--accent)",
    color: "var(--text-inverse)"
  },
  dark: {
    background: "var(--ink-900)",
    color: "var(--text-inverse)"
  },
  secondary: {
    background: "rgba(39,34,53,0.05)",
    color: "var(--ink-900)"
  },
  ghost: {
    background: "transparent",
    color: "var(--ink-900)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  onClick,
  style
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      border: "none",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      letterSpacing: "-0.02em",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "filter 150ms ease, box-shadow 150ms ease, transform 100ms ease",
      transform: hover && !disabled ? "translateY(-1px)" : "none",
      boxShadow: hover && !disabled && variant === "primary" ? "var(--shadow-btn-hover)" : "none",
      filter: hover && !disabled && variant !== "ghost" ? "brightness(0.94)" : "none",
      ...v,
      ...s,
      ...style
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      height: 54,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-input)",
      padding: "16px",
      boxSizing: "border-box",
      boxShadow: focused ? "0 0 0 1.5px var(--accent)" : "inset 0 0 0 0.5px var(--surface-input-border)",
      transition: "box-shadow 150ms ease"
    }
  }, icon, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      width: "100%",
      fontFamily: "var(--font-sans)",
      fontWeight: 500,
      fontSize: 18,
      letterSpacing: "-0.03em",
      color: "var(--ink-900)"
    }
  })));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
const items = [{
  icon: "SquaresFour",
  label: "Dashboard"
}, {
  icon: "DropboxLogo",
  label: "Projects"
}, {
  icon: "CalendarCheck",
  label: "Events"
}, {
  icon: "ChartScatter",
  label: "Analytics"
}, {
  icon: "Sparkle",
  label: "AI"
}, {
  icon: "BellRinging",
  label: "Notifications"
}, {
  icon: "CalendarDots",
  label: "Calendar"
}];
function SidebarNav({
  collapsed = false,
  active = "Dashboard",
  onSelect,
  base = "../../assets/icons/nav"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: collapsed ? 96 : 224,
      height: "100%",
      background: "var(--surface-page)",
      display: "flex",
      flexDirection: "column",
      alignItems: collapsed ? "center" : "stretch",
      padding: collapsed ? "36px 18px" : "32px 16px",
      boxSizing: "border-box",
      gap: 8,
      transition: "width 200ms ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: collapsed ? 40 : 34,
      height: collapsed ? 40 : 34,
      borderRadius: "50%",
      background: "var(--accent)",
      boxShadow: "var(--shadow-panel), inset 0 0 0 1.25px rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/logo-mark.svg",
    style: {
      width: "58%",
      filter: "brightness(0) invert(1)"
    }
  })), items.map(it => {
    const isActive = it.label === active;
    return /*#__PURE__*/React.createElement("div", {
      key: it.label,
      onClick: () => onSelect && onSelect(it.label),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px",
        borderRadius: 10,
        cursor: "pointer",
        background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
        justifyContent: collapsed ? "center" : "flex-start"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: `${base}/${it.icon}.svg`,
      style: {
        width: 20,
        height: 20
      }
    }), !collapsed && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        fontSize: 16,
        color: "var(--ink-900)"
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.ToolbarButton = __ds_scope.ToolbarButton;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.PanelItem = __ds_scope.PanelItem;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

})();
