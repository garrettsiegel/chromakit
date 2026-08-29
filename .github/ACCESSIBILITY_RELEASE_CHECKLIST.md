# Accessibility release checklist

Use this checklist before a public release that changes the site shell, picker,
documentation navigation, or interaction behavior. Automated checks are the
baseline; the manual items require a person using the named input or assistive
technology.

## Automated gate

- [x] Axe reports zero WCAG A/AA and best-practice violations on every
  indexable route in light and dark modes at mobile and desktop sizes.
- [x] The intentional 404 returns HTTP 404, includes `noindex`, and passes its
  Performance, Accessibility, and Best Practices Lighthouse assertions.
- [x] Every indexable route passes the pinned mobile and desktop Lighthouse
  assertions in `npm run test:lighthouse`.
- [x] The homepage and representative docs page reflow without horizontal
  overflow at 320, 375, 414, and 768 CSS pixels.
- [x] Keyboard regressions cover both color-area axes and alpha persistence.

## Manual sign-off

- [x] Complete the homepage picker with keyboard only: saturation, brightness,
  hue, alpha, format tabs, channel inputs, presets, copy controls, theme toggle,
  and navigation. Copy activation was reached and its fallback path is covered
  by the automated component tests; the local browser did not expose a
  clipboard, so the transient confirmation could not be observed here.
- [ ] Complete the same flow with VoiceOver and confirm names, values, state,
  announcements, focus order, and mobile navigation behavior.
- [x] Verify 200% and 400% zoom and 320 CSS pixel reflow without content loss or
  obscured focus.
- [x] Verify browser-emulated text spacing, reduced motion, increased contrast,
  and forced-colors behavior without color-only instructions or invisible
  controls.
- [ ] Verify native macOS increased contrast behavior without color-only
  instructions or invisible controls.
- [x] Verify 44 by 44 CSS pixel targets and pointer, touch, drag, click, numeric
  input, and keyboard alternatives on the local browser surface.

## Manual review log

- Date: 2026-08-28
- Browser/OS: Google Chrome 152.0.7977.64 on macOS 27.0
- Assistive technology: Chrome accessibility tree (AX API proxy); VoiceOver
  could not be toggled from this test environment.
- Verified: skip link and focus order, independent picker axes, alpha Home/End
  and drag, format-tab Enter/Space activation, numeric alpha editing, preset
  selection, theme-toggle state, mobile docs disclosure, 200%/400% zoom, 320px
  bounds, 44px controls, and browser-emulated spacing/motion/contrast modes.
- Remaining environment checks: native VoiceOver announcements and native macOS
  increased contrast.
- Release decision: accepted as browser-verified for this release. Native
  VoiceOver and macOS Increased Contrast remain deferred and must not be
  represented as completed manual checks.

Record the browser, operating system, assistive-technology version, date, and
tester alongside the release notes when the manual sign-off is complete.
