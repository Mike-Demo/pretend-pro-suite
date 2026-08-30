# Reorder onboarding: OS first, with Desktop / Mobile tabs

## What changes

1. **Step order swaps.** Step 1 becomes "Which system do you want to pretend in?" (OS edition). Step 2 becomes "How are you planning to pretend to work?" (the 11 fake work options).

2. **Mobile gets its own tab.** Instead of two stacked sections, the OS step shows a two-tab control:
   - **Desktop** — Fruit, Apperture, BufferiumOS
   - **Mobile** — Android, fOS

3. **Defaults to the viewing device.** The tab opens on Mobile for phone-sized viewports and Desktop otherwise, and the matching default edition for that device is pre-selected so Continue is immediately available. Switching tabs clears the selection to the tab's default edition so the choice always matches the visible tab.

4. Back button on step 2 returns to the OS step. Fullscreen checkbox, locale picker, appearance toggle, and footer stay where they are.

## Technical notes

- `src/components/pretendpro/Onboarding.tsx`: swap step content, add `deviceKind` state (`"desktop" | "mobile"`) initialized from `useIsMobile()` after hydration, render the tabs with shadcn `Tabs` (`@/components/ui/tabs`), and keep route navigation on the final step (`localeThemeRoutes[style]` with `search: { app: work }`).
- Route prefetching moves to the OS step (preload with `app: work ?? "docufaker"`), and the work step preloads the chosen edition with the highlighted app.
- `src/lib/i18n/strings.ts`: add `deviceTabDesktop` / `deviceTabMobile` labels to `onboarding` for all six locales (Klingon included); reuse existing `questionWork` / `questionStyle` / `subtitle*` strings, only swapping which step shows them. `recommendedHeading` becomes unused and is removed from the type and every locale.
- No backend, routing, or styling-system changes; `stepLabel` still reads "Step N of 2".
