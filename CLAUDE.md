# CLAUDE.md

Bu fayl Claude Code-a (claude.ai/code) bu repo üzərində işləyərkən bələdçilik etmək üçündür.

@AGENTS.md

## Əmrlər

- `npm run dev` — dev server-i başladır (http://localhost:3000)
- `npm run build` — production build yaradır
- `npm run start` — production build-i işə salır
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals`)

Bu repoda test suite/framework konfiqurasiya olunmayıb.

## Arxitektura

Bu "Pulse Press" adlı, Next.js App Router əsaslı blog CRUD tətbiqidir. Layihənin **öz database-i və auth-u yoxdur** — bütün post datası paylaşılan, xarici (üçüncü tərəf) bir API-da saxlanılır.

- `services/http.js` — tək axios instansı, `baseURL` `https://blog-api-t6u0.onrender.com/posts`-a yönəlib (bu repo-nun nəzarət etmədiyi, bütün istifadəçilər tərəfindən paylaşılan üçüncü tərəf API).
- `services/request-handlers.js` — `successHandler(response)` / `errorHandler(error)` istənilən axios cavabını/xətasını `{ data, status, result }` formasına salır (`result` boolean-dır).
- `services/posts.js` — API-ya qarşı CRUD funksiyaları (`readPost`, `createPost`, `updatePost`, `deletePost`), yuxarıdakı handler-lərin üzərində qurulub. Hər funksiya HƏMİŞƏ `{ data, status, result }` obyektini qaytarır (heç vaxt throw etmir) — çağıran tərəf `result.result`-a görə qərar verir. `normalizePost` hər funksiyanın data-sına `id`-ni güzgüləyən `displayId` sahəsi əlavə edir.
- `services/posts.server.js` — yalnız server tərəfdə işləyir (`next/headers`-dən `cookies()` istifadə edir); bütün səhifələr oxuma üçün bunu import edir, `services/posts.js`-i birbaşa YOX.

**Ownership modeli:** xarici API-da istifadəçi konsepti olmadığı üçün "sənin postların" anlayışı tamamilə client-side simulyasiya olunur. Post yaradılanda onun id-si bir cookie-yə əlavə olunur (`pulse-owned-post-ids`, bax `shared/lib/tracked-posts.js`) və bu cookie həmin browser-ə aid postların yeganə qeydidir. `services/posts.server.js#getPosts`/`getPost` bu cookie-ni oxuyub filtrləyir/qoruyur — paylaşılan API-da mövcud olan, amma cookie-də olmayan post "tapılmadı" sayılır (`notFound()` çağırılır). `shared/hooks/useTrackedPosts.js` create/delete axınlarında cookie-ni sinxron saxlamaq üçün client-side güzgüdür.

**Route/komponent bölgüsü:** `app/` altındakı səhifələr (`app/page.jsx`, `app/posts/page.jsx`, `app/posts/[id]/page.jsx`, `app/posts/[id]/edit/page.jsx`, `app/create/page.jsx`) server komponentlərdir, `dynamic = "force-dynamic"` ixrac edir və `services/posts.server.js` vasitəsilə data çəkir. Bütün mutasiya UI-si `features/posts/` altında `"use client"` komponent/hook-lara təcrid olunub (`PostForm`, `DeletePostButton`, `useSavePost`, `useDeletePost`) — bunlar `services/posts.js`-i birbaşa çağırır, uğur olduqda `useTrackedPosts` ilə tracked-posts cookie-sini sinxronlaşdırır və xətaları local state-ə qaytarır (qlobal error/store yoxdur). Post yaradılandan sonra istifadəçi detallar səhifəsinə yox, birbaşa home-a yönləndirilir.

**Modal-lar üçün vacib qeyd:** `shared/ui/Modal` `createPortal` ilə birbaşa `document.body`-yə render olunur. Səbəb: modal CSS `transform`-u olan bir ata elementin (məs. hover-də transform alan kart) daxilində render olunsaydı, `position: fixed` overlay viewport-a yox, o transformlu elementə görə mövqelənərdi — bu, "mouse kənara çıxanda modalın sıçraması" kimi bug-lara səbəb olurdu. Fixed-overlay tələb edən hər yeni komponent də portal ilə render olunmalıdır.

**Shared layer:** `shared/ui` server və client komponentlər arasında paylaşılan görünüş kitidir (`Button`, `Modal`, `ConfirmModal`, `EmptyState`, `StatusPanel`, `Kicker`, `LoadingState`, `EditorialFormLayout`). `shared/providers` `app/layout.jsx`-də quraşdırılan tətbiq-geniş wrapper-ləri saxlayır: `AppToaster` (sonner əsaslı toast-lar, `richColors` + `theme="dark"` ilə; `shared/lib/notifications.js`-dəki `notifySuccess`/`notifyError`/`notifyInfo` uyğun olaraq yaşıl/qırmızı/sarı rənglənir). Render xətaları Next-in öz `app/error.jsx`/`app/not-found.jsx` segment boundary-ləri ilə idarə olunur — əlavə manual error-boundary komponenti yoxdur.

**Dizayn sistemi:** `styles/globals.css`-dəki CSS dəyişənləri (`--background`, `--foreground`, `--accent` və s.) tünd, minimal "premium SaaS" görünüşünü təyin edir (tək indigo aksent rəngi, saç tükü qədər nazik sərhədlər, yumşaq kölgələr — Linear/Vercel/Stripe tərzi). `app/layout.jsx`-dəki header `position: sticky` ilə yuxarıda qalır (tam opak fon, arxasında heç nə görünmür) və səhifənin sonunda brand/naviqasiya/status məlumatlı bir footer var; `body` flex-column + `.frame { flex: 1 }` ilə qısa səhifələrdə footer aşağıda "yapışıb" qalır.

Path alias: `@/*` layihə kökünə (`jsconfig.json`) işarə edir.
