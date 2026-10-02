# COLOR CALENDAR

Initial prototype for the personal iPhone calendar project.

## Locked design rules

- One complete month visible without vertical scrolling.
- Current month opens by default.
- Previous/next month buttons.
- Swipe left/right changes month.
- Date tap cycle: Normal → Green → Red → Normal.
- The date number itself stays black.
- Green/red color is applied to the background/surface behind the number.
- Status is saved locally on the device with localStorage.
- No login, account, server, or internet is required for calendar data.
- Today receives a subtle neutral outline.
- Monthly Green/Red/Unmarked summary is shown when space permits.
- Approved 3D glossy calendar icon is included for Home Screen/PWA use.

## GitHub Pages

This is a static web/PWA project. Upload all files in this folder to the repository root and enable GitHub Pages from the repository settings.

For iPhone:
1. Open the GitHub Pages URL in Safari.
2. Use Share → Add to Home Screen.
3. The included icon and standalone settings are used by the PWA where supported.

## Prototype scope

This package intentionally contains only the agreed basic calendar. Visual refinements such as more advanced 3D effects and animations can be added in the next stage without changing the core data model.
