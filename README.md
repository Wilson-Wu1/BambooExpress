# BambooExpress

Marketing site for Bamboo Express (Richmond, BC). Built with React, Vite, and Chakra UI.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```

Other scripts: `npm run lint`, `npm run preview` (serve the production build locally).

## Menu page: Chinese text on or off

The full menu is rendered by `MenuSection` (`src/components/sections/MenuSection.jsx`). It accepts an optional boolean prop:

| Prop           | Effect |
|----------------|--------|
| `hideChinese`  | When `true`, Chinese copy is not shown (English-only UI for sections, items, dinner combos, nav, and search results). |
| *(omitted or `false`)* | Chinese lines appear as usual next to English. |

**Disable Chinese** (current setup on the dedicated menu route): in `src/pages/MenuPage.jsx`, pass the flag:

```jsx
<MenuSection hideChinese />
```

**Enable Chinese again:** remove the prop or set it explicitly to `false`:

```jsx
<MenuSection />
```

or

```jsx
<MenuSection hideChinese={false} />
```

Search still uses Chinese strings in the data for matching when the user types; only visible labels are hidden when `hideChinese` is enabled.
