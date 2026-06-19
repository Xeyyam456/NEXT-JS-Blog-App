# CLAUDE.md

Bu fayl Claude Code-a (claude.ai/code) bu repo üzərində işləyərkən bələdçilik etmək üçündür. Kodun hər sətrinin sadə dildə, başlanğıc səviyyəsində izahı üçün `KODLARIN-IZAHI.md`-yə bax (CSS xaric, bütün `.ts`/`.tsx` faylları sətir-sətir izah olunur).

@AGENTS.md

## Əmrlər

- `npm run dev` — dev server-i başladır (http://localhost:3000)
- `npm run build` — production build yaradır
- `npm run start` — production build-i işə salır
- `npm run lint` — ESLint (flat config, `eslint-config-next/core-web-vitals`)

Bu repoda test suite/framework konfiqurasiya olunmayıb.

**Bilinən qəribəlik:** bəzən `styles/globals.css` dəyişikliyi (məs. yeni bir CSS dəyişən/seçici) dev server işləyərkən, hətta server yenidən başladılsa da, compile olunmuş CSS-ə düşmür — Turbopack-ın `.next/` daxilindəki disk cache-i köhnəlmiş qalır. Belə görünürsə (CSS dəyişikliyi kodda var, amma brauzerdə təsiri yoxdur), `.next` qovluğunu silib (`rm -rf .next` / Windows-da `Remove-Item -Recurse -Force .next`) `npm run dev`-i təzədən başlat.

## Arxitektura

Bu "Pulse Press" adlı, Next.js App Router əsaslı blog CRUD tətbiqidir. Layihənin **öz database-i və auth-u yoxdur** — bütün post datası paylaşılan, xarici (üçüncü tərəf) bir API-da saxlanılır.

- `services/http.ts` — tək axios instansı, `baseURL` `NEXT_PUBLIC_API_BASE_URL` env dəyişənindən oxunur (bax `.env.example`; default qiymət `https://blog-api-t6u0.onrender.com/posts`, bu repo-nun nəzarət etmədiyi, bütün istifadəçilər tərəfindən paylaşılan üçüncü tərəf API). Client-side mutasiyalardan da çağırıldığı üçün dəyişən `NEXT_PUBLIC_` prefiksi ilə işarələnib.
- `services/request-handlers.ts` — `successHandler(response)` / `errorHandler(error)` istənilən axios cavabını/xətasını `{ data, status, result }` formasına salır (`result` boolean-dır, tiplər `types/api.ts`-dəki `ApiSuccess`/`ApiFailure`/`ApiResult`-dır).
- `services/posts.ts` — API-ya qarşı CRUD funksiyaları (`readPost`, `createPost`, `updatePost`, `deletePost`), yuxarıdakı handler-lərin üzərində qurulub. Hər funksiya HƏMİŞƏ `ApiResult<Post>` (və ya `ApiResult<null>`) qaytarır (heç vaxt throw etmir) — çağıran tərəf `result.result`-a görə qərar verir. `normalizePost` hər funksiyanın data-sına `id`-ni güzgüləyən `displayId` sahəsi əlavə edir.
- `services/posts.server.ts` — yalnız server tərəfdə işləyir (`next/headers`-dən `cookies()` istifadə edir); bütün səhifələr oxuma üçün bunu import edir, `services/posts.ts`-i birbaşa YOX.

**Ownership modeli:** xarici API-da istifadəçi konsepti olmadığı üçün "sənin postların" anlayışı tamamilə client-side simulyasiya olunur. Post yaradılanda onun id-si bir cookie-yə əlavə olunur (`pulse-owned-post-ids`, bax `shared/lib/tracked-posts.ts`) və bu cookie həmin browser-ə aid postların yeganə qeydidir. `services/posts.server.ts#getPosts`/`getPost` bu cookie-ni oxuyub filtrləyir/qoruyur — paylaşılan API-da mövcud olan, amma cookie-də olmayan post "tapılmadı" sayılır (`notFound()` çağırılır). `shared/hooks/useTrackedPosts.ts` create/delete axınlarında cookie-ni sinxron saxlamaq üçün client-side güzgüdür. API-da created-at sahəsi olmadığı üçün cookie-dəki ID sırası (yeni ID-lər sona əlavə olunur) xronologiyanın yeganə mənbəyidir — `getPosts` bunu newest-first feed üçün tərsinə çevirir.

**Route/komponent bölgüsü:** `app/` altındakı səhifələr (`app/page.tsx`, `app/posts/page.tsx`, `app/posts/[id]/page.tsx`, `app/posts/[id]/edit/page.tsx`, `app/create/page.tsx`) server komponentlərdir, `dynamic = "force-dynamic"` ixrac edir və `services/posts.server.ts` vasitəsilə data çəkir. Bütün mutasiya UI-si `features/posts/` altında `"use client"` komponent/hook-lara təcrid olunub (`PostForm`, `DeletePostButton`, `useSavePost`, `useDeletePost`) — bunlar `services/posts.ts`-i birbaşa çağırır, uğur olduqda `useTrackedPosts` ilə tracked-posts cookie-sini sinxronlaşdırır və xətaları local state-ə qaytarır (qlobal error/store yoxdur). Post yaradılandan sonra istifadəçi detallar səhifəsinə yox, birbaşa home-a yönləndirilir.

**Modal-lar üçün vacib qeyd:** `shared/ui/Modal` `createPortal` ilə birbaşa `document.body`-yə render olunur. Səbəb: modal CSS `transform`-u olan bir ata elementin (məs. hover-də transform alan kart) daxilində render olunsaydı, `position: fixed` overlay viewport-a yox, o transformlu elementə görə mövqelənərdi — bu, "mouse kənara çıxanda modalın sıçraması" kimi bug-lara səbəb olurdu. Fixed-overlay tələb edən hər yeni komponent də portal ilə render olunmalıdır.

**Shared layer:** `shared/ui` server və client komponentlər arasında paylaşılan görünüş kitidir (`Button`, `Modal`, `ConfirmModal`, `EmptyState`, `StatusPanel`, `Kicker`, `LoadingState`, `EditorialFormLayout`, `ThemeToggle`). `shared/providers` `app/layout.tsx`-də quraşdırılan tətbiq-geniş wrapper-ləri saxlayır: `AppToaster` (sonner əsaslı toast-lar, `richColors` + aktiv temaya bağlı `theme` propu ilə; `shared/lib/notifications.ts`-dəki `notifySuccess`/`notifyError`/`notifyInfo` uyğun olaraq yaşıl/qırmızı/sarı rənglənir) və `ThemeInitializer` (görünüşsüz, mount-da Zustand tema store-unu DOM-dakı həqiqi `data-theme` ilə sinxronlaşdırır). `shared/stores/useThemeStore.ts` — tək Zustand store-u, dark/light temayı saxlayır. Render xətaları Next-in öz `app/error.tsx`/`app/not-found.tsx` segment boundary-ləri ilə idarə olunur — əlavə manual error-boundary komponenti yoxdur.

**Dizayn sistemi:** `styles/globals.css`-dəki CSS dəyişənləri (`--background`, `--foreground`, `--accent` və s.) `:root`-da tünd (dark) defolt, `[data-theme="light"]` seçicisi altında isə açıq (light) ekvivalentlərini təyin edir — minimal "premium SaaS" görünüşü hər iki temada saxlanılır (tək indigo aksent rəngi, saç tükü qədər nazik sərhədlər, yumşaq kölgələr — Linear/Vercel/Stripe tərzi). Aktiv tema `<html data-theme>` atributu ilə idarə olunur: `shared/stores/useThemeStore.ts`-dəki Zustand store dəyəri `localStorage`-da (`pulse-theme` açarı) saxlayır və DOM atributunu birbaşa yazır; `app/layout.tsx`-də `beforeInteractive` strategiyalı bir inline `<Script>` səhifə render olunmazdan əvvəl bu atributu `localStorage`-dan oxuyub qoyur (FOUC-un qarşısını almaq üçün), `ThemeInitializer` isə store-un yaddaşını bu həqiqi dəyərlə bir dəfə sinxronlaşdırır. Toggle düyməsi (`shared/ui/ThemeToggle`) header-də, nav-ın yanındadır. `app/layout.tsx`-dəki header `position: sticky` ilə yuxarıda qalır (tam opak fon, arxasında heç nə görünmür) və səhifənin sonunda brand/naviqasiya/status məlumatlı bir footer var; `body` flex-column + `.frame { flex: 1 }` ilə qısa səhifələrdə footer aşağıda "yapışıb" qalır. Favicon `app/icon.svg`-dir (Next.js-in fayl-konvensiyası ilə avtomatik `<link rel="icon">` yaradılır, əlavə config lazım deyil) — indigo aksent fonunda "pulse" (ürək döyüntüsü) xətti, brendi əks etdirir. `public/` qovluğu boşdur — `create-next-app`-in default SVG-ləri (heç yerdə istifadə olunmurdu) silinib.

## TypeScript

Layihə tam TypeScript-ə keçirilib (`.ts`/`.tsx`). Tip strategiyası: **bütün tiplər mərkəzi `types/` qovluğunda saxlanılır**, heç bir komponent/hook/səhifə faylının içinə yazılmır və colocated `*.types.ts` faylı da yoxdur.

- `types/` qovluğu `app/`, `features/`, `shared/` mənbə ağacını **eynilə güzgüləyir**: məs. `shared/ui/Button/index.tsx`-in prop tipi `types/shared/ui/Button.ts`-dədir (`ButtonProps`), `features/posts/hooks/useSavePost.ts`-in tipi `types/features/posts/hooks/useSavePost.ts`-dədir (`UseSavePostParams`/`UseSavePostReturn`), `app/posts/[id]/page.tsx`-in params tipi `types/app/posts/[id]/page.ts`-dədir (`PostDetailPageProps`).
- Komponent/hook/səhifə faylı öz tipini həmişə `@/types/...` path alias-ı ilə import edir (məs. `import type { ButtonProps } from "@/types/shared/ui/Button"`), heç vaxt nisbi `./X.types` yolu ilə YOX.
- `types/post.ts` və `types/api.ts` — `types/` kökündə qalan domain tipləri (`Post`, `PostFormData`, `ApiResult`, `PostId` və s.), çünki bunlar tək bir modulun deyil, bütöv layihənin paylaşılan domain konseptidir.
- Yeni komponent/hook/səhifə əlavə edəndə: əvvəlcə `types/` altında mənbə yoluna uyğun fayl yarat, sonra mənbə faylından `@/types/...` ilə import et. Heç vaxt tipi mənbə faylının içinə yazma və heç vaxt mənbə qovluğunda colocated `*.types.ts` yaratma.
- `useSavePost` və `PostForm` sadə flat tip istifadə edir (`{ mode: PostFormMode; postId?: PostId }` / `{ mode: PostFormMode; post?: Post }`) — discriminated union deyil, oxunaqlılıq üçün qəsdən sadələşdirilib. `mode === "edit"` olduqda `postId`/`post`-un mövcud olması runtime-da `PostForm` çağıran tərəfin məsuliyyətidir, TS bunu məcburi etmir.
- `next.config.ts`, `tsconfig.json` (`@/*` → kök, əvvəlki `jsconfig.json`-un əvəzinə) və `next-env.d.ts` (auto-generated, git-ə commit olunmur) standart Next.js TS quraşdırılmasıdır.

Path alias: `@/*` layihə kökünə (`tsconfig.json`) işarə edir.
