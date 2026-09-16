"use client";

// A plain <a href="#main-content"> is not reachable via Tab in Safari/WebKit
// unless the user has "Full Keyboard Access" enabled, since that browser
// excludes links (but not buttons) from the default tab order. A button
// that focuses the target programmatically works everywhere.
export function SkipLink() {
  return (
    <button
      type="button"
      className="skip-link"
      onClick={() => {
        const target = document.getElementById("main-content");
        target?.focus();
        target?.scrollIntoView();
      }}
    >
      Skip to content
    </button>
  );
}
