# Layihədəki Bütün Kodların İzahı

Bu fayl layihədəki **hər bir kod faylının** nə üçün var olduğunu, nə işlədiyini, hansı digər fayllara qoşulduğunu və data-nın (həm dəyərin, həm də onun **tipinin**) haradan haraya hərəkət etdiyini izah edir. Məqsəd budur ki, kodu hər oxuyan adam (hətta yeni başlayan, hətta TypeScript-i ilk dəfə görən) bu faylı oxuyub layihəni tam başa düşsün.

> Qeyd: CSS faylları burada sətir-sətir izah olunmur (bax bölmə 10) — yalnız `.ts`/`.tsx` (əsl kod məntiqi) sətir-sətir izah olunur, çünki dəyər/tip axını yalnız oradadır.

---

## 0. Layihə nədir, ümumi məntiq necədir?

Bu, **"Pulse Press"** adlı sadə bir blog tətbiqidir. İstifadəçi post yarada, oxuya, redaktə edə və silə bilər (CRUD). Amma bir neçə vacib xüsusiyyəti var:

1. **Öz database-i yoxdur.** Bütün postlar `https://blog-api-t6u0.onrender.com/posts` ünvanındaki **xarici, paylaşılan** bir API-da saxlanılır. Bu API-ya hamı (bu layihəni kim işlədirsə) eyni zamanda yazır.
2. **Login/auth yoxdur.** Amma "mənim postlarım" funksiyası var. Bu necə işləyir? — Hər post yaradılanda onun ID-si brauzerin **cookie**-sinə yazılır. Sən hansı post ID-lərini yaratmısansa, yalnız onlar sənin ekranında görünür. Başqası yaratdığı post API-da var, amma sənin cookie-ndə olmadığı üçün sənə görünmür.
3. **Server + Client qarışığı.** Next.js-in "App Router"ı istifadə olunur: oxuma (list/detail) əməliyyatları server tərəfdə olur, yazma (create/update/delete) əməliyyatları isə brauzerdə (client component) baş verir.
4. **TypeScript ilə yazılıb.** Dəyərlərin (post, API cavabı, props və s.) "şəklini" (shape) compile vaxtı (kod işə düşməzdən əvvəl) yoxlamaq üçün bütün kod TypeScript-dədir. Tiplərin hamısı **ayrıca, mərkəzi `types/` qovluğunda** saxlanılır — bu, aşağıda öz bölməsində ətraflı izah olunur.

Kod 5 əsas qatdan ibarətdir:

```
types/           → bütün TypeScript tipləri (props, domain modelləri, API cavab formaları) — mənbə ağacını güzgüləyir
services/        → xarici API ilə danışan funksiyalar (həm server, həm client tərəfdən çağırılır)
shared/          → layihənin hər yerində istifadə olunan ümumi alətlər (UI komponentləri, hook-lar, köməkçi funksiyalar)
features/posts/  → məhz "post" mövzusuna aid biznes məntiqi (hook-lar + komponentlər)
app/             → Next.js-in route (səhifə) qovluğu — URL-lər bura uyğun gəlir
```

**Niyə tiplər ayrıca qatdır, kod ilə yanaşı deyil?** Çünki bir tipi (məs. `Post`) bir neçə fayl eyni zamanda istifadə edir (`services/posts.ts`, `PostCard`, `PostForm`, `app/posts/[id]/page.tsx`...). Əgər tip hər dəfə həmin faylın daxilində yazılsaydı, eyni şəkli neçə dəfə təkrarlamalı olardıq və biri dəyişəndə hamısını tapıb dəyişmək lazım gələrdi. Tək bir mərkəzi yerdə saxlamaq "Single Source of Truth" (Vahid Həqiqət Mənbəyi) prinsipidir.

---

## 1. Konfiqurasiya faylları

### `package.json`
Layihənin "şəxsiyyət vəsiqəsi"dir. İki hissəyə bölünür:
- `dependencies` — proqram **işləyərkən** (runtime-da) həqiqətən lazım olan kitabxanalar: `axios` (HTTP sorğuları), `next`, `react`, `react-dom`, `sonner` (toast bildirişləri).
- `devDependencies` — yalnız **inkişaf zamanı** (kodu yazıb yoxlayanda) lazım olan alətlər: `typescript` (tip yoxlayıcı/compiler), `@types/node`, `@types/react`, `@types/react-dom` (Node.js, React və React-DOM-un öz tip təsvirləri — bunlar olmasa TypeScript `document`, `useState`, `process` kimi şeyləri "tanımaz"), `eslint` + `eslint-config-next`, `tailwindcss` + `@tailwindcss/postcss`.

Həmçinin hansı terminal əmrlərinin mövcud olduğunu göstərir: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`. Yeni bir kitabxana quraşdırılanda (`npm install paket-adı`) bu fayl avtomatik yenilənir.

### `tsconfig.json`
Bu, **TypeScript compiler-inə** (`tsc`-yə, və Next.js-in öz daxili tip-yoxlayıcısına) necə işləməli olduğunu deyən fayldır. Köhnə `jsconfig.json`-un yerinə keçib (TypeScript-də onun adı belədir). Vacib sahələr:

- `"strict": true` — TypeScript-in **bütün** ciddi yoxlamalarını açır (məs. `null`/`undefined` üçün xəbərdarlıq, funksiya parametrlərinin tipini "any" buraxmamaq və s.). Bu, ən çox xəta tutan rejimdir.
- `"paths": { "@/*": ["./*"] }` — `jsconfig.json`-dakı eyni qısayolu davam etdirir: `@/shared/ui` yazmaq `./shared/ui`-a (layihənin kökünə nisbətən) bərabərdir, uzun `../../../shared/ui` yolları yazmağa ehtiyac qalmır.
- `"jsx": "react-jsx"` — JSX sintaksisini (`<div>...</div>`) necə tərcümə edəcəyini deyir (React 17+-ın yeni JSX transform-u, `import React` yazmağa ehtiyac qalmır).
- `"moduleResolution": "bundler"` — modulların necə tapılacağını Next.js-in öz bundler-i (Turbopack/Webpack) məntiqinə uyğunlaşdırır.
- `"plugins": [{ "name": "next" }]` — Next.js-in öz VS Code/IDE əlavə tip-yoxlamalarını (məs. `"use client"` düzgün yerdə yazılıb-yazılmayıb) aktivləşdirir.
- `"include"` siyahısında `next-env.d.ts`, `.next/types/**/*.ts` və `**/*.ts`/`**/*.tsx` var — bu, "hansı fayllara baxılsın" deməkdir. `.next/types` Next.js-in **özünün avtomatik yaratdığı** köməkçi tip fayllarıdır (məs. route adlarının tipini yoxlamaq üçün).
- `"exclude": ["node_modules"]` — başqalarının kitabxana kodlarına tip yoxlaması aparılmır (vaxt itkisinin qarşısı alınır).

### `next-env.d.ts`
Bu fayl **əl ilə yazılmır** — Next.js `next dev` və ya `next build` işə düşəndə onu özü yaradır/yeniləyir. İçində Next.js-in öz qlobal tiplərinə (məs. şəkil/CSS importlarının tipi) istinad var. `.gitignore`-a salınıb, çünki avtomatik yaradılır, git-də saxlamağa ehtiyac yoxdur.

### `next.config.ts`
Next.js-ə layihə üçün xüsusi tənzimləmə demək üçündür. Əvvəllər `next.config.js` idi, indi TypeScript versiyasıdır:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```
`import type { NextConfig }` — bu, **yalnız tip** importudur (runtime-da heç bir kod gətirmir, sadəcə "bu obyektin şəkli belə olmalıdır" deyir). Hazırda obyekt boşdur (`{}`) — heç bir xüsusi parametr yoxdur, sadəcə Next.js-in default davranışı işləyir. Amma indi, məsələn, `experimental: {...}` kimi bir parametr əlavə etsən, TypeScript səhv yazılmış açar adını (`typo`) dərhal qırmızı xətt ilə göstərəcək — bu, sadə `.js` faylda mümkün deyildi.

### `.env.example` və `.env.local`
İkisi də tək bir sətirdən ibarətdir: `NEXT_PUBLIC_API_BASE_URL=https://blog-api-t6u0.onrender.com/posts`. Fərq: `.env.example` git-ə yüklənir (sadəcə **nümunə**, real dəyəri başqası da görə bilər, burada məxfi heç nə yoxdur), `.env.local` isə `.gitignore`-dadır (hər kompüterdə fərqli ola bilər deyə, prinsipcə şəxsi sayılır). Layihəni yeni açan adam `cp .env.example .env.local` etməlidir (bax `README.md`). Bu dəyər `services/http.ts`-də `process.env.NEXT_PUBLIC_API_BASE_URL` ilə oxunur — ətraflı izah bölmə 3-də.

### `eslint.config.mjs`
Kod yazarkən səhv/səliqəsizlik axtaran "ESLint" alətinin qaydalarını təyin edir (`npm run lint` bu faylı oxuyur). `eslint-config-next/core-web-vitals` həm JavaScript, həm TypeScript fayllarını avtomatik tanıyıb müvafiq qaydaları tətbiq edir. `.next`, `out`, `build`, `next-env.d.ts` qovluqlarını/faylını yoxlamadan kənarda saxlayır.

---

## 2. `types/` — TypeScript tipləri qatı (MƏRKƏZİ)

Bu, layihənin TypeScript-ə keçməsi ilə yaranan **tamamilə yeni** bir qovluqdur. Qayda çox sadədir: **heç bir komponent, hook və ya səhifə faylının içində tip (interface/type) yazılmır.** Hər tip bu qovluqda, mənbə faylının yerini **eynilə güzgüləyən** bir yolda saxlanılır.

### Niyə "güzgüləmə" (mirroring)?

Məsələn `shared/ui/Button/index.tsx` komponentinin prop tipi haradadır? Cavab: `types/shared/ui/Button.ts`-də. Qayda budur:

```
mənbə fayl:                                    →  tip faylı:
shared/ui/Button/index.tsx                     →  types/shared/ui/Button.ts
features/posts/hooks/useSavePost.ts            →  types/features/posts/hooks/useSavePost.ts
app/posts/[id]/page.tsx                        →  types/app/posts/[id]/page.ts
app/layout.tsx                                 →  types/app/layout.ts
```

Yəni `types/` qovluğunun daxili strukturu, `app/`, `features/`, `shared/` qovluqlarının strukturunu **sətir-sətir təkrarlayır**. Bu sayədə "bu komponentin tipi haradadır?" sualının cavabı həmişə proqnozlaşdırıla bilər — fayl adına və yoluna baxıb tapırsan, axtarmırsan.

Mənbə fayl öz tipini **həmişə `@/types/...` alias-ı ilə** import edir, **heç vaxt** nisbi (`./X.types`) yol ilə yox:
```ts
// shared/ui/Button/index.tsx daxilində:
import type { ButtonProps } from "@/types/shared/ui/Button";
```
`import type` — yenə "yalnız tip" importudur, build zamanı bu sətir nəticə kodundan **tamamilə silinir** (heç bir runtime izi qalmır), çünki tiplər yalnız compile-time üçündür, brauzerdə "tip" deyilən bir şey mövcud deyil.

### `types/api.ts` — Ümumi API/Domain tipləri

```ts
export type PostId = number | string;

export type ApiErrorPayload = {
  message?: string;
  [key: string]: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  status: number;
  result: true;
};

export type ApiFailure = {
  data: ApiErrorPayload | null;
  status: number;
  result: false;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
```

Burada bir neçə vacib TypeScript anlayışı var:

- **`PostId = number | string`** — "union type" (birləşmə tipi). Post ID-si bəzən rəqəm (`5`), bəzən URL-dən gələn mətn (`"5"`) ola bilir (Next.js-də dinamik route parametrləri **həmişə** mətn kimi gəlir). Bu tip hər iki halı qəbul etməyə icazə verir, amma "obyekt" və ya "massiv" kimi mənasız dəyərlərin qarşısını alır.
- **`ApiSuccess<T>`** — `<T>` bir **generic**-dir, yəni "bu tip, daxilindəki `data`-nın **hansı** tip olduğunu sonradan deyəcəm" deməkdir. Məsələn `ApiSuccess<Post>` desən, `data` sahəsi `Post` tipində olur; `ApiSuccess<null>` desən (silmə əməliyyatında, çünki silinəndə geri "data" yoxdur), `data` sahəsi `null` olur. Bu, **eyni formanı** (uğur cavabının ümumi şəklini) müxtəlif data tipləri üçün təkrar-təkrar yazmadan istifadə etməyə imkan verir.
- **`result: true`** (yalnız `true`, `boolean` yox!) — bu, "literal type" adlanır. Bunun sayəsində TypeScript **"discriminated union"** (ayırıcı sahəyə görə birləşmə) qura bilir: `ApiResult<T>` `ApiSuccess<T>` **və ya** `ApiFailure`-dir, və kompüter `result`-un dəyərinə baxaraq **hansı** olduğunu bilir. Kodda `if (result.result) { ... result.data is T ... } else { ... result.data is ApiErrorPayload | null ... }` yazsan, TypeScript hər iki qolda `data`-nın **doğru** tipini avtomatik tanıyır — bu, "type narrowing" (tipin dəqiqləşdirilməsi) adlanır və aşağıda `useSavePost`-da daha geniş izah olunur.
- **`[key: string]: unknown`** (`ApiErrorPayload`-da) — "index signature": "bu obyektin `message`-dən başqa, adını bilmədiyim əlavə sahələri də ola bilər, amma onların tipini dəqiq bilmirəm" deməkdir. `unknown` `any`-dən fərqli olaraq, həmin dəyəri istifadə etməzdən əvvəl TypeScript səni mütləq yoxlamaya (tip yoxlamasına) məcbur edir — bu daha təhlükəsizdir.

### `types/post.ts` — "Post" domain modeli

```ts
export type Post = {
  id: number;
  displayId?: number;
  title: string;
  body: string;
  imageUrl?: string;
};

export type PostFormData = {
  title: string;
  body: string;
  imageUrl: string;
};

export type PostFormMode = "create" | "edit";
```

- `Post` — API-dan gələn **əsl** post obyektinin şəklidir. `displayId?` və `imageUrl?` sonundaki `?` işarəsi "bu sahə **olmaya da bilər** (optional)" deməkdir — yəni `undefined` ola bilər.
- `PostFormData` — formadakı 3 input-un (`title`, `body`, `imageUrl`) şəklidir. Diqqət: `Post`-dan **fərqlidir** — burada `id` yoxdur (çünki forma doldurulanda hələ ID yoxdur, server onu yaradır) və `imageUrl` məcburidir (formada həmişə bir mətn, boş da olsa, var — `undefined` ola bilməz, çünki `useState`-in başlanğıc dəyəri həmişə mətndir).
- `PostFormMode = "create" | "edit"` — yalnız bu iki sözdən biri ola bilən bir tip (literal union). Bu, `mode="yarat"` kimi səhv yazılışların qarşısını compile zamanı alır.

### `types/` qalan fayllarının siyahısı (qısa baxış)

| Tip faylı | Daxilindəki tip(lər) | Hansı mənbə faylı istifadə edir |
|---|---|---|
| `types/shared/hooks/useDisclosure.ts` | `UseDisclosureReturn` | `shared/hooks/useDisclosure.ts` |
| `types/shared/hooks/useModalLifecycle.ts` | `UseModalLifecycleParams` | `shared/hooks/useModalLifecycle.ts` |
| `types/shared/hooks/useTrackedPosts.ts` | `UseTrackedPostsReturn` | `shared/hooks/useTrackedPosts.ts` |
| `types/shared/ui/Button.ts` | `ButtonProps` | `shared/ui/Button/index.tsx` |
| `types/shared/ui/Kicker.ts` | `KickerProps` | `shared/ui/Kicker/index.tsx` |
| `types/shared/ui/Modal.ts` | `ModalProps` | `shared/ui/Modal/index.tsx` |
| `types/shared/ui/ConfirmModal.ts` | `ConfirmModalProps` | `shared/ui/ConfirmModal/index.tsx` |
| `types/shared/ui/EmptyState.ts` | `EmptyStateProps` | `shared/ui/EmptyState/index.tsx` |
| `types/shared/ui/LoadingState.ts` | `LoadingStateProps` | `shared/ui/LoadingState/index.tsx` |
| `types/shared/ui/StatusPanel.ts` | `StatusPanelProps` | `shared/ui/StatusPanel/index.tsx` |
| `types/shared/ui/EditorialFormLayout.ts` | `EditorialFormLayoutProps` | `shared/ui/EditorialFormLayout/index.tsx` |
| `types/features/posts/hooks/useDeletePost.ts` | `UseDeletePostReturn` | `features/posts/hooks/useDeletePost.ts` |
| `types/features/posts/hooks/useSavePost.ts` | `UseSavePostParams`, `UseSavePostReturn` | `features/posts/hooks/useSavePost.ts` |
| `types/features/posts/components/DeletePostButton.ts` | `DeletePostButtonProps` | `features/posts/components/DeletePostButton/index.tsx` |
| `types/features/posts/components/PostCard.ts` | `PostCardProps` | `features/posts/components/PostCard/index.tsx` |
| `types/features/posts/components/PostForm.ts` | `PostFormProps` | `features/posts/components/PostForm/index.tsx` |
| `types/features/posts/hooks/usePostSearch.ts` | `UsePostSearchReturn` | `features/posts/hooks/usePostSearch.ts` |
| `types/features/posts/components/PostsGrid.ts` | `PostsGridProps` | `features/posts/components/PostsGrid/index.tsx` |
| `types/app/layout.ts` | `RootLayoutProps` | `app/layout.tsx` |
| `types/app/error.ts` | `ErrorPageProps` | `app/error.tsx` |
| `types/app/posts/[id]/page.ts` | `PostDetailPageProps` | `app/posts/[id]/page.tsx` |
| `types/app/posts/[id]/edit/page.ts` | `EditPostPageProps` | `app/posts/[id]/edit/page.tsx` |

Hər birinin **konkret nə üçün belə yazıldığı** aşağıda, müvafiq mənbə faylının izahında ətraflı göstərilir.

**İstisna: `shared/hooks/useDebounce.ts`-in tip faylı yoxdur.** Bu hook `(value: T, delayMs: number) => T` formasındadır — heç bir "obyekt şəkli" (props kimi) qəbul etmir, sadəcə iki sadə (generic) parametr alır. Güzgüləmə qaydası "bu komponentin/hook-un **prop obyektinin** şəkli haradadır" sualına cavab vermək üçündür; burada belə bir obyekt yoxdur ki, ayrıca tipə çıxarılsın, ona görə generic funksiya imzası birbaşa `useDebounce.ts`-in öz daxilində yazılıb.

### Bilərəkdən seçilmiş sadə tip: `useSavePost`, `PostForm`, `Button`

Bu üç yerdə əvvəlcə daha "ağıllı" tiplər (discriminated union — "ayırıcı sahəyə görə birləşmə") yazılmışdı, sonra **bilərəkdən sadələşdirildi**, çünki layihə sahibi oxunaqlılığı tip-təhlükəsizlikdən üstün tutdu. Bunu görmək öyrədicidir, ona görə hər iki versiyanı göstərək.

**`useSavePost` üçün indi (sadə, flat) versiya:**
```ts
// types/features/posts/hooks/useSavePost.ts
export type UseSavePostParams = {
  mode: PostFormMode;
  postId?: PostId;
};
```
Bu, "həm `mode`, həm `postId` (ola bilər, olmaya da bilər) olan sadə bir obyekt" deyir. **Diqqət:** bu tip özlüyündə "edit rejimində `postId` mütləq olmalıdır" qaydasını **məcbur etmir** — bunu indi insan (kodu yazan) yadda saxlamalıdır, TypeScript yox. Bunun əvəzində kodda belə yazılıb (`features/posts/hooks/useSavePost.ts`):
```ts
const result = isEditMode
  ? await updatePost(params.postId!, formData)
  : await createPost(formData);
```
`params.postId!` — sonundaki **`!`** işarəsi "non-null assertion" adlanır, mənası: "bilirəm ki, bu, `undefined` ola bilər kimi görünür, amma mən səndən (TypeScript-dən) xahiş edirəm, mənə inan, bura çatanda bu mütləq mövcud olacaq, xəbərdarlıq vermə". Bu, məsuliyyəti tip sistemindən insanın öz nəzarətinə keçirir — daha sadə kod, amma bir az daha az "avtomatik qoruma".

**Əvvəlki (daha "ağıllı") versiya belə idi, müqayisə üçün:**
```ts
export type UseSavePostParams =
  | { mode: "edit"; postId: PostId }
  | { mode: "create"; postId?: PostId };
```
Bu versiyada TypeScript **özü** bilirdi ki, `mode === "edit"` yazılan qolda `postId` mütləq mövcuddur (`!` yazmağa ehtiyac qalmırdı) — bu, "type narrowing" (tipin dəqiqləşdirilməsi) adlanır. Amma bunun bir "tələsi" var idi: əgər `const { mode, postId } = params;` kimi əvvəlcədən **destructure** (parçalama) etsəydin, TypeScript bu əlaqəni itirirdi — `params.mode`/`params.postId` (obyektin özü üzərindən, parçalamadan) yazmaq **məcburi** idi. Bu incəlik adi gözlə görünmür və yeni başlayan üçün çətin başa düşülür — məhz buna görə layihə sahibi bunu sadələşdirməyi seçdi.

Eyni dəyişiklik **`PostForm`**-da da edilib (aşağıda, bölmə 8-də) və **`Button`**-da da (aşağıda, bölmə 6-da) — hər ikisi əvvəllər union idi, indi flat (sadə, vahid) tipdir.

**Nəticə (qayda kimi yadda saxla):** Bu layihədə **defolt seçim** sadə, flat tip yazmaqdır. Yalnız əgər TypeScript-in özü konkret bir səhvin qarşısını real şəkildə alırsa (sadəcə nəzəri ehtimal yox), union/discriminated-union kimi mürəkkəb tiplərə əl atılır.

---

## 3. `services/` — Xarici API ilə əlaqə qatı

Bu qovluqdakı fayllar **yalnız** xarici API-ya sorğu göndərmək və cavabı "təmiz" formaya salmaqla məşğuldur. Heç bir UI (görünüş) kodu yoxdur.

### `services/http.ts`
```ts
import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default http;
```
Bu, "axios" kitabxanasından hazırlanmış tək bir HTTP müştəri (client) obyektidir. `baseURL` sayəsində hər sorğuda tam ünvanı yazmaq lazım deyil — `http.get("/5")` yazsan, əslində `baseURL + "/5"`-ə sorğu gedir.

`process.env.NEXT_PUBLIC_API_BASE_URL` — ünvan kodun içində **yazılmır**, layihə kökündəki `.env.local` faylından oxunur (həmin faylda `NEXT_PUBLIC_API_BASE_URL=https://blog-api-t6u0.onrender.com/posts` yazılıb). `process.env.X` — "X adlı mühit dəyişənini oxu" deməkdir. Niyə kodun içinə yazmırıq? Çünki ünvan dəyişəndə (məs. başqa bir API-a keçəndə, və ya kompüterdən-kompüterə fərqli ünvan istəsən) kodu dəyişdirmədən, sadəcə `.env.local`-i dəyişdirmək kifayət edir — bu, "12-factor" adlanan, konfiqurasiyanı koddan ayırma prinsipidir. `NEXT_PUBLIC_` prefiksi **məcburidir**: Next.js-də normal mühit dəyişənləri yalnız serverdə oxuna bilir, amma bu fayl həm serverdə (`services/posts.server.ts` üzərindən), həm də brauzerdə (`features/posts/hooks/useSavePost.ts`, `useDeletePost.ts` birbaşa çağırır) işlədiyi üçün, dəyişən brauzerə də "görünməlidir" — `NEXT_PUBLIC_` prefiksi məhz bunu təmin edir.

`.env.local` `.gitignore`-dadır (git-ə yüklənmir, çünki mühitə görə fərqli ola bilər), amma `.env.example` faylı (eyni dəyərlə) git-ə yüklənib — yeni kompüterdə layihəni açan adam `cp .env.example .env.local` edib işə başlaya bilər (bax `README.md`).

`timeout: 15000` — 15 saniyə ərzində cavab gəlməsə, sorğu avtomatik xəta ilə kəsilir (proqram əbədi "gözləmədə" qalmasın deyə). Bütün digər `services/` faylları bu obyekti idxal edib (`import http from "./http"`) istifadə edir. Bu faylda ayrıca tip lazım deyil — axios öz tiplərini özü gətirir (`AxiosInstance`).

### `services/request-handlers.ts`
```ts
import axios, { type AxiosResponse } from "axios";
import type { ApiFailure, ApiSuccess } from "@/types/api";

export const successHandler = <T>(response: AxiosResponse<T>): ApiSuccess<T> => ({
  data: response.data,
  status: response.status,
  result: true,
});

export const errorHandler = (error: unknown): ApiFailure => {
  if (axios.isAxiosError(error)) {
    return {
      data: error.response?.data ?? null,
      status: error.response?.status ?? 500,
      result: false,
    };
  }

  return { data: null, status: 500, result: false };
};
```
İki funksiya var. Məqsədləri: axios-dan gələn cavabı (həm uğurlu, həm xəta) **eyni formaya** salmaq — yuxarıda izah olunan `ApiResult` formasına.

- **`successHandler<T>`** — özü də generic-dir. `response: AxiosResponse<T>` yazıldığı üçün, məsələn `successHandler(responseOfPost)` çağırılanda, TypeScript `T`-ni avtomatik `Post` kimi "tutur" (infer edir) və nəticə `ApiSuccess<Post>` olur. Bunu **özümüz** demədən TypeScript özü hesablayır.
- **`errorHandler(error: unknown)`** — `catch` blokunda tutulan xəta TypeScript-də həmişə `unknown` tipindədir (`strict` rejimdə "useUnknownInCatchVariables" defolt aktivdir) — çünki nəzəri olaraq **istənilən** dəyər `throw` edilə bilər (mətn, rəqəm, hər şey), ona görə kompüter "bu mütləq Error-dur" deyə fərz etmir. `axios.isAxiosError(error)` bir **type guard**-dır — `true` qaytarsa, TypeScript o bloqun daxilində `error`-u avtomatik `AxiosError` kimi tanıyır (yəni `error.response` artıq mövcuddur, əlavə yoxlamaya ehtiyac yoxdur). Əgər axios xətası deyilsə (məs. kodun özündə bir səhv olub), ümumi `{ data: null, status: 500, result: false }` qaytarılır — proqram heç vaxt naməlum formalı xəta ilə çökmür.

### `services/posts.ts`
Burada 4 funksiya var: `readPost`, `createPost`, `updatePost`, `deletePost`. Hər biri eyni qəlibdədir, sadəcə `readPost`-u ətraflı izah edək:
```ts
export async function readPost(id: PostId): Promise<ApiResult<Post>> {
  try {
    const response = await http.get<Post>(`/${id}`);
    const result = successHandler(response);
    result.data = normalizePost(result.data);
    return result;
  } catch (error) {
    return errorHandler(error);
  }
}
```
- **`(id: PostId): Promise<ApiResult<Post>>`** — bu funksiyanın "müqaviləsi"dir: parametr kimi `PostId` (rəqəm və ya mətn) qəbul edir, nəticədə isə "gec-tezdir, sonda bir `ApiResult<Post>` qaytaracam" (`Promise<...>` = "vədə" deməkdir, çünki funksiya `async`-dır, dərhal deyil, gələcəkdə cavab verir) deyir.
- `http.get<Post>(...)` — axios-a "bu sorğunun cavabının `data` sahəsi `Post` formasında olacaq" deyilir; bunun sayəsində aşağıdaki bütün dəyişənlər (`response.data`, `result.data`) avtomatik `Post` kimi tanınır, hər addımda yenidən tip yazmağa ehtiyac qalmır.
- Addım-addım axın: `http.get` ilə API-ya sorğu gedir → uğurlu olsa `successHandler` cavabı `{data: Post, status, result: true}`-a çevirir → `normalizePost` post obyektinə `displayId` sahəsi əlavə edir (aşağıda izah olunur) → nəticə qaytarılır. Xəta olsa (internet kəsilsə, server 404/500 qaytarsa) `catch` bloku işə düşür və `errorHandler` çağırılır.

**Çox vacib qayda:** bu fayldakı funksiyalar **heç vaxt `throw` etmir** — uğursuz olanda da normal şəkildə `{ result: false, ... }` formasında obyekt **qaytarır**. Bunu çağıran kod həmişə `if (!result.result)` yoxlaması ilə xətanı tutmalıdır (və TypeScript, `ApiResult`-un discriminated union olduğu üçün, bu yoxlamadan sonra `result.data`-nın hansı tip olduğunu **özü** bilir).

`normalizePost` funksiyası:
```ts
function normalizePost(post: Post): Post {
  if (!post || typeof post !== "object") return post;
  return { ...post, displayId: post.id };
}
```
Bu, post obyektinə `displayId` adlı yeni sahə əlavə edir (dəyəri `id` ilə eynidir). Niyə lazımdır? Çünki UI-da "Post #7" kimi göstərəndə birbaşa `post.id`-dən asılı olmaq əvəzinə ayrıca `displayId` adı saxlamaq, gələcəkdə "görünən nömrə" ilə "əsl id"-ni ayırmaq istəsək asanlıq yaradır. (Diqqət: tipin özü `post: Post` dediyi üçün `post` heç vaxt `null`/obyekt-olmayan ola bilməz, amma runtime-da real API-dan gələn data həmişə tipin dediyi kimi "təmiz" olmaya bilər — ona görə bu müdafiə yoxlaması bilərəkdən saxlanılıb, tip sistemi 100% qarantiya vermir, sadəcə **ehtimalı** çox azaldır.)

`createPost`, `updatePost`, `deletePost` da eyni qəlibdədir, sadəcə fərqli HTTP metodları (`post`, `put`, `delete`) və fərqli generic tiplər (`createPost`/`updatePost` → `ApiResult<Post>`, `deletePost` → `ApiResult<null>`, çünki silinəndə geri "data" gəlmir) işlədir.

### `services/posts.server.ts`
Bu fayl **yalnız serverdə** işləyir (çünki `next/headers`-dən `cookies()` istifadə edir — bu, brauzerdə mövcud deyil). İki funksiya ixrac edir: `getPosts()` (siyahı üçün) və `getPost(id)` (tək post üçün). Bunlar `app/` qovluğundakı **bütün səhifələr** tərəfindən çağırılır — heç bir səhifə `services/posts.ts`-i birbaşa oxumaq üçün çağırmır, mütləq bu faylın üzərindən keçir.

```ts
async function getTrackedPostIds(): Promise<number[]> {
  const cookieStore = await cookies();
  const trackedIdsValue = cookieStore.get(TRACKED_POST_IDS_COOKIE)?.value;
  return parseTrackedPostIds(trackedIdsValue);
}
```
Bu köməkçi funksiya brauzerin göndərdiyi cookie-ni oxuyur və "sənin yaratdığın post ID-lərinin siyahısı"nı (`number[]`, məs. `[3, 7, 12]`) qaytarır. `cookieStore.get(...)?.value` — `?.` (optional chaining) "cookie tapılmasa, xəta vermə, sadəcə `undefined` qaytar" deməkdir.

```ts
export async function getPosts(): Promise<Post[]> {
  const trackedPostIds = await getTrackedPostIds();
  const posts: Post[] = [];

  // Tracked IDs are stored oldest-first (new IDs are appended), so reverse for a newest-first feed.
  for (const postId of [...trackedPostIds].reverse()) {
    const result = await readPost(postId);
    if (result.result) {
      posts.push(result.data);
    }
  }

  return posts;
}
```
Sadə dillə: "əvvəlcə cookie-dəki ID-ləri al, sonra hər ID üçün API-dan o postu oxu, uğurlu alınanları bir siyahıya yığ, siyahını qaytar". `if (result.result)` yoxlamasından **sonra**, TypeScript artıq bilir ki, `result` `ApiSuccess<Post>`-dur, ona görə `result.data` heç bir əlavə yoxlama tələb etmədən `Post` kimi `posts.push(...)`-a verilə bilir — bu, "type narrowing"in əməli faydasıdır. Əgər hansısa post API-dan silinibsə (məs. başqa yolla), o sadəcə siyahıya əlavə olunmur, proqram çökmür.

**`[...trackedPostIds].reverse()` nə üçündür?** API-da postun "nə vaxt yaradıldığı" sahəsi (tarix) yoxdur. Amma `shared/lib/tracked-posts.ts`-dəki `addTrackedPostId` funksiyası yeni ID-ni həmişə siyahının **sonuna** əlavə edir — deməli cookie-dəki sıra, sənin postları yaratdığın sıra ilə **eynidir** (köhnədən yeniyə). `[...trackedPostIds]` əvvəlcə bu siyahının bir **kopyasını** çıxarır (`...` — "spread", əsl siyahıya toxunmadan eynisini yeni bir massivə köçürür), sonra `.reverse()` onu tərsinə çevirir. Nəticədə **ən yeni yaradılan post birinci** göstərilir — adi bloq kimi. Kopya çıxarmaq vacibdir, çünki `.reverse()` JavaScript-də massivi **özü** dəyişdirir (in-place) — kopya olmasa, `trackedPostIds`-in özü də tərsinə dönərdi, bu da başqa yerdə (məs. `getPost`-da) gözlənilməz nəticəyə səbəb ola bilərdi.

```ts
export async function getPost(id: PostId): Promise<Post> {
  const trackedPostIds = await getTrackedPostIds();
  const numericId = Number(id);

  if (!trackedPostIds.includes(numericId)) {
    notFound();
  }

  const result = await readPost(id);

  if (!result.result) {
    if (result.status === 404) notFound();
    throw new Error("Unable to load post.");
  }

  return result.data;
}
```
Burada əvvəlcə yoxlanılır: "bu ID mənim cookie-mdə var mı?" — yoxdursa, hətta API-da mövcud olsa belə, Next.js-in `notFound()` funksiyası çağırılır (bu, istifadəçiyə 404 səhifəsi göstərir). Cookie-də varsa, API-dan real datanı çəkməyə çalışır; alına bilməsə, ya 404 göstərilir, ya da ümumi xəta atılır (bu xəta `app/error.tsx`-ə gedib çıxır). Diqqət: funksiyanın elan olunan qaytarış tipi `Promise<Post>`-dur (`Promise<Post | undefined>` yox!) — çünki `notFound()` və `throw` "heç vaxt qayıtmayan" yollardır (TypeScript bunu bilir), ona görə kodun sonuna **çatan** hər yol artıq `result.result === true` təmin edilmiş olur və `return result.data` təhlükəsizdir.

---

## 4. `shared/lib/` — Hər yerdə işlədilən köməkçi funksiyalar

### `shared/lib/tracked-posts.ts`
Bu fayl, yuxarıda bəhs edilən **"cookie-də ID saxlamaq"** məntiqinin bütün detallarını saxlayır. Çox kiçik, təkrar istifadə oluna bilən funksiyalardan ibarətdir, hamısı `PostId` (`@/types/api`-dən) tipini qəbul edir:

- `normalizePostId(postId: PostId): number | null` — gələn dəyəri rəqəmə çevirir; əgər mənasız dəyərdirsə (mənfi, kəsr, mətn və s.) `null` qaytarır.
- `uniquePostIds(postIds: number[]): number[]` — siyahıdaki təkrarları silir:
  ```ts
  function uniquePostIds(postIds: number[]): number[] {
    const uniqueIds: number[] = [];
    for (const postId of postIds) {
      if (!uniqueIds.includes(postId)) {
        uniqueIds.push(postId);
      }
    }
    return uniqueIds;
  }
  ```
  Yəni boş bir siyahı açırıq (`const uniqueIds: number[] = []` — burda tipi əl ilə yazmaq lazımdır, çünki boş massiv-dən TypeScript özü "bu `number[]`-dir" çıxara bilməz), gələn ID-ləri tək-tək yoxlayırıq, əgər artıq siyahıda yoxdursa əlavə edirik.
- `parseTrackedPostIds(rawValue?: string): number[]` — cookie-dən gələn mətni (məs. `"3,7,12"`) götürüb, vergüllə bölür, hər parçanı rəqəmə çevirir, səhv olanları kənarlaşdırır və son nəticədə təkrarsız bir rəqəm siyahısı qaytarır. Parametrin yanındaki `?` (`rawValue?: string`) "bu arqument verilməyə də bilər" deməkdir — çağıran yerdə `parseTrackedPostIds()` (heç bir arqumentsiz) yazmaq da düzgündür.
- `addTrackedPostId(postIds: number[], postId: PostId): number[]` / `removeTrackedPostId(...)` — mövcud siyahıya bir ID əlavə edir / çıxarır.
- `serializeTrackedPostIds(postIds: number[]): string` — rəqəm siyahısını yenidən cookie-yə yazılacaq mətnə (`"3,7,12"`) çevirir.
- `readBrowserCookie` / `writeBrowserCookie` / `clearBrowserCookie` (hamısı `(name: string) => string` və ya `(name: string, value: string) => void`) — brauzerin `document.cookie`-si ilə birbaşa işləyən aşağı-səviyyəli funksiyalar. `typeof document === "undefined"` yoxlaması var, çünki bu funksiyalar bəzən serverdə də import oluna bilər — server-də `document` obyekti mövcud olmadığı üçün bu yoxlama proqramın çökməsinin qarşısını alır. (TypeScript-in `lib: ["dom", ...]` tənzimləməsi `document`-i tanıyır, amma bu, "runtime-da mövcuddur" demək deyil — server kodunda mövcud olmaya bilər, ona görə yoxlama hələ də lazımdır.)
- `readTrackedPostIdsFromBrowser(): number[]` / `trackPostInBrowser(postId: PostId): void` / `untrackPostInBrowser(postId: PostId): void` — yuxarıdakı bütün kiçik funksiyaları birləşdirib, "brauzerdə bir post-u izlə/izləməni dayandır" kimi hazır əməliyyatlar təqdim edir. Bunları çağıran yer: `shared/hooks/useTrackedPosts.ts`.

**Niyə bu qədər kiçik funksiyaya bölünüb?** Hər funksiya tək bir işi görür (Single Responsibility) — bu, həm test etməyi, həm də səhv tapmağı asanlaşdırır.

### `shared/lib/notifications.ts`
Ekranın küncündə çıxan balaca bildiriş qutucuqlarını (toast) idarə edir, "sonner" kitabxanasının üzərindən:
```ts
"use client";

import { toast } from "sonner";

export function notifySuccess(message: string, description?: string): void {
  toast.success(message, { description });
}
export function notifyError(message: string, description?: string): void { ... }
export function notifyInfo(message: string, description?: string): void { ... }
```
- `notifySuccess` → yaşıl rəngli uğur bildirişi.
- `notifyError` → qırmızı rəngli xəta bildirişi.
- `notifyInfo` → daxildə əslində `toast.warning` çağırır, ona görə sarı/kəhrəba rəngdə çıxır (məs. "Delete cancelled" mesajı bu tipdəndir).
- `description?: string` — açıqlama mətni verilməsə də funksiya işləyir, sadəcə toast-da əlavə sətir görünmür.

Bu funksiyalar `features/posts/hooks/useSavePost.ts` və `useDeletePost.ts` tərəfindən çağırılır.

---

## 5. `shared/hooks/` — Ümumi React hook-ları

### `shared/hooks/useDisclosure.ts`
Açıq/bağlı (boolean) vəziyyəti idarə edən çox sadə bir hook — adı "disclosure" (açma-bağlama) buradan gəlir:
```ts
export default function useDisclosure(initialOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);
  function open() { setIsOpen(true); }
  function close() { setIsOpen(false); }
  function toggle() { setIsOpen((v) => !v); }
  return { isOpen, open, close, toggle, setIsOpen };
}
```
Qaytarılan obyektin tipi (`UseDisclosureReturn`, `types/shared/hooks/useDisclosure.ts`-də) belədir:
```ts
export type UseDisclosureReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
```
`Dispatch<SetStateAction<boolean>>` — React-in öz tipidir, `useState`-in qaytardığı "set" funksiyasının tam tipidir (həm `setIsOpen(true)`, həm də `setIsOpen((cari) => !cari)` formalarını qəbul edən funksiya). Modal/popup açıb-bağlamaq lazım olan **hər yerdə** bu hook işlədilir (məs. `DeletePostButton`-da silmə modalını açmaq üçün).

### `shared/hooks/useModalLifecycle.ts`
Modal açıq olanda iki kiçik "yan təsir" (side effect) idarə edir:
```ts
export default function useModalLifecycle({ isOpen, onClose }: UseModalLifecycleParams): void {
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
}
```
`{ isOpen, onClose }: UseModalLifecycleParams` — funksiyanın tək parametri bir obyektdir, tipi `types/shared/hooks/useModalLifecycle.ts`-dəki `{ isOpen: boolean; onClose: () => void }`-dur. `event: KeyboardEvent` — bu, brauzerin öz daxili (DOM) tipidir, `event.key`-in mətn olduğunu TypeScript-ə bildirir.

1. Modal açılanda səhifənin scroll-unu kilidləyir (`overflow: hidden`) ki, arxa fon sürüşməsin.
2. `Escape` düyməsinə basılanda modalı bağlayır.
3. Modal bağlananda (və ya komponent silinəndə) hər ikisini geri "təmizləyir" (cleanup) — bu, `useEffect`-in qaytardığı funksiyadır.

### `shared/hooks/useTrackedPosts.ts`
`shared/lib/tracked-posts.ts`-dəki "xam" funksiyaları React state-i ilə birləşdirir:
```ts
export default function useTrackedPosts(): UseTrackedPostsReturn {
  const [trackedPostIds, setTrackedPostIds] = useState(() => readTrackedPostIdsFromBrowser());

  function trackPost(postId: PostId) {
    trackPostInBrowser(postId);                                   // cookie-ni yenilə
    setTrackedPostIds((ids) => addTrackedPostId(ids, postId));     // React state-i yenilə
  }
  // untrackPost, isTracked oxşar şəkildə...
}
```
`useState(() => readTrackedPostIdsFromBrowser())` — funksiya formasında başlanğıc dəyər vermək, TypeScript-ə `trackedPostIds`-in tipini `number[]` kimi **çıxarmasına** (infer) imkan verir, əl ilə `useState<number[]>(...)` yazmağa ehtiyac qalmır. Niyə iki yerdə yenilənir (`trackPostInBrowser` **və** `setTrackedPostIds`)? Çünki cookie brauzer yaddaşıdır (səhifə yenilənəndə də qalır), `trackedPostIds` state-i isə yalnız bu komponentin ekranda "canlı" görünüşü üçündür. İkisini sinxron saxlamaq lazımdır. Bu hook `useSavePost` (post yaradılanda `trackPost`) və `useDeletePost`-da (post silinəndə `untrackPost`) çağırılır.

### `shared/hooks/useDebounce.ts`
"Debounce" — bir dəyər **tez-tez** dəyişəndə, hər dəyişiklikdə deyil, yalnız "bir az sakitlik" olandan sonra reaksiya vermək deməkdir. Məsələn axtarış qutusuna yazanda, hər hərfdə deyil, yazı dayanandan 500 millisaniyə sonra axtarış etmək istəyirik (yoxsa hər hərfdə lazımsız iş görülər).
```ts
"use client";

import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
```
- `<T>` — bu hook **generic**-dir, istənilən tipdə dəyərlə işləyə bilər (mətn, rəqəm, obyekt...). `useDebounce<string>("salam", 500)` çağırılsa, `T` avtomatik `string` kimi tutulur.
- `useState(value)` — "gecikdirilmiş" (debounced) dəyəri öz state-ində saxlayır, başlanğıcda əsl dəyərlə eynidir.
- `useEffect(..., [value, delayMs])` — `value` (məs. axtarış qutusunun hər hərfdə dəyişən dəyəri) **hər dəyişdikdə** bu effekt yenidən işə düşür.
- `setTimeout(() => setDebouncedValue(value), delayMs)` — "`delayMs` (məs. 500) millisaniyə sonra, `debouncedValue`-nu yenilə" — bir **gözləmə taymeri** qurur.
- `return () => clearTimeout(timeoutId);` — bu, `useEffect`-in **təmizləmə (cleanup)** funksiyasıdır. Niyə vacibdir? Çünki istifadəçi yazmaqda davam edirsə, `value` təkrar-təkrar dəyişir, hər dəyişiklikdə **köhnə** taymer ləğv edilir (`clearTimeout`) və **yeni** bir taymer qurulur. Yalnız istifadəçi 500ms ərzində heç nə yazmasa, son taymer "yetişir" və `debouncedValue` yenilənir. Bu sayədə `debouncedValue` yalnız "yazı dayanandan sonra" dəyişir, hər hərfdə yox.
- Hook `debouncedValue`-nu qaytarır — çağıran kod (`usePostSearch`, aşağıda bölmə 8-də) bu **gecikdirilmiş** dəyərə əsasən filtr edir, ani (hər hərfdəki) dəyərə yox.

Bu hookun ayrıca tip faylı olmadığını yuxarıda (bölmə 2-də) izah etmişdik — generic funksiya imzası `(value: T, delayMs: number) => T` heç bir "obyekt şəkli" daşımır.

### `shared/hooks/index.ts`
Sadəcə "barrel file" — yəni bu qovluqdaki hook-ları bir yerdən idxal etməyə imkan verir:
```ts
export { default as useDebounce } from "./useDebounce";
export { default as useDisclosure } from "./useDisclosure";
export { default as useModalLifecycle } from "./useModalLifecycle";
export { default as useTrackedPosts } from "./useTrackedPosts";
```
Bu sayədə başqa fayllarda `import { useDisclosure } from "@/shared/hooks"` yazmaq kifayətdir, hər hook üçün ayrıca tam yol yazmaq lazım deyil. (Diqqət: bu, **tip** faylı deyil — sadəcə dəyərləri (funksiyaları) yenidən ixrac edir, ona görə `types/` qovluğunda qarşılığı yoxdur.)

---

## 6. `shared/ui/` — Təkrar istifadə olunan görünüş (UI) komponentləri

Bu qovluqdakı komponentlərin heç biri "post" sözünü bilmir — onlar tamamilə ümumi, istənilən layihədə işlənə bilən "tikinti hissələri"dir (Button, Modal və s.).

### `shared/ui/Button/index.tsx`
**İki rolda** işləyir: ya `<a>` linki, ya da `<button>` — `href` versən link, verməsən button olur. Tipi (`types/shared/ui/Button.ts`):
```ts
export type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "xsmall";
  className?: string;
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>, "href">;
```
Sadə dillə: "bu obyektdə öz sahələrimiz (`href`, `variant`, `size`, `className`, `children`) var, **və əlavə olaraq** (`&` — intersection, "kəsişmə" işarəsi) bir `<a>`-nın **və** bir `<button>`-un bütün mümkün atributları (`onClick`, `disabled`, `type`, `target`, `rel`...) da ola bilər". `AnchorHTMLAttributes<HTMLAnchorElement>` və `ButtonHTMLAttributes<HTMLButtonElement>` — React-in özünün hazır DOM atribut tipləridir. `Omit<..., "href">` — "bu birləşmiş tipin hər şeyini götür, amma `href`-i çıxar" (çünki `href`-i özümüz yuxarıda artıq, `string`-dən fərqli olaraq **optional** (`?`) şəkildə elan etmişik).

Bu, əvvəlki versiyadan **bilərəkdən sadələşdirilib** (əvvəlki versiya `ButtonAsLink | ButtonAsButton` adlı iki ayrı discriminated union qolu idi — "əgər `href` versən, mütləq `<a>` atributları, verməsən, mütləq `<button>` atributları" qaydasını TypeScript səviyyəsində **məcbur edirdi**). İndiki flat (vahid) versiya bunu məcbur etmir — nəzəri olaraq `href` ilə yanaşı `type="submit"` (button-a aid bir atribut) da yazıla bilər, TypeScript bunu indi qadağan etmir. Amma komponentin öz daxili məntiqi (`if (href) { ...link... } else { ...button... }`) real DOM-da hansının işlədiyini düzgün seçdiyi üçün, praktikada problem yaratmır — sadəcə "səhv yazılışı compile vaxtı tutmaq" qarantiyası bir az azalıb, əvəzində tip daha qısa və oxunaqlıdır.

Komponentin daxilində:
```ts
const VARIANT_CLASS_NAMES = { primary: styles.primary, secondary: styles.secondary, danger: styles.danger };
const SIZE_CLASS_NAMES = { small: styles.small, xsmall: styles.xsmall };
```
Bu iki obyekt, sadəcə "açar → CSS class" lüğətidir. `variant="danger"` deyilsə, `VARIANT_CLASS_NAMES["danger"]` ilə düzgün rəngli class tapılır — `variant`-ın tipi `"primary" | "secondary" | "danger"` olduğu üçün TypeScript "bəlkə bu açar lüğətdə yoxdur" narahatlığını compile vaxtı aradan götürür.
```ts
const mergedClassName = [styles.button, styles.fullWidthMobile, variantClassName, sizeClassName, className]
  .filter(Boolean)
  .join(" ");
```
Bu sətir bir neçə class adını bir mətndə birləşdirir, amma əvvəlcə `.filter(Boolean)` ilə boş/`undefined` olanları çıxarır (məsələn `size` verilməyibsə `sizeClassName` boş mətndir, bu boş mətn nəticəyə qarışmasın deyə filtrlənir). Komponent həm `<a>` (link, `href` verilibsə, Next.js-in `Link`-i ilə) həm də `<button>` kimi işləyə bilir.

### `shared/ui/Kicker/index.tsx`
Kiçik, rəngli "etiket" yazısıdır (məs. "Post #7"). `tone="muted"` versiyası daha solğun rəngdədir. Tipi sadədir: `{ children: ReactNode; tone?: "default" | "muted"; className?: string }`. Daxili məntiqi `Button` ilə demək olar eynidir (class adlarını birləşdirmək).

### `shared/ui/Modal/index.tsx`
Ekranın ortasında çıxan popup pəncərəsinin "skeleti"dir (başlıq, bağlama düyməsi, açıqlama, sərbəst məzmun yeri `children`, alt düymələr `footer`). Tipi: `{ isOpen: boolean; onClose: () => void; title: string; description?: string; children?: ReactNode; footer?: ReactNode }`.
```ts
if (!isOpen) return null;

return createPortal(
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
      ...
    </div>
  </div>,
  document.body
);
```
İki vacib detal:
1. **`isOpen` `false`-dursa, heç nə render olunmur** (`return null`) — modal yalnız lazım olanda DOM-a girir.
2. **`createPortal(..., document.body)`** — modal HTML-də harada yazılıbsa yazılsın (məs. bir kartın içində), React onu **birbaşa `<body>`-nin sonuna** "köçürür". Bu çox vacibdir: əgər köçürülməsəydi, modal valideyn elementin (məs. hover-də "böyüyən" kart) daxilində qalardı, və həmin valideyndə CSS `transform` varsa, modalın `position: fixed`-i pozulurdu (bu, real layihədə tutulan bir bug idi — "siçanı kənara çıxaranda modal sıçrayır" şəklində özünü göstərirdi). Portal bu problemi tam həll edir.

`overlay`-ə klikləmək `onClose`-u çağırır (kənara klik = bağla), amma `panel`-ə klikləmək `event.stopPropagation()` ilə bu klikin `overlay`-ə "sızmasının" qarşısını alır — yoxsa panelin içinə klikləmək də modalı bağlayardı. `useId()` React-in hook-udur, hər render üçün unikal bir ID yaradır — bu, `aria-labelledby` ilə `h2`-ni bir-birinə bağlamaq üçün işlədilir (ekran oxuyucuları üçün, əlçatımlılıq/accessibility).

### `shared/ui/ConfirmModal/index.tsx`
`Modal`-ın üzərinə qurulmuş, "Təsdiq et / İmtina et" formatlı xüsusi versiyadır:
```tsx
<Modal
  isOpen={isOpen}
  onClose={isPending ? () => {} : onClose}
  ...
  footer={<>...iki Button...</>}
/>
```
`isPending` (məs. silinmə davam edirsə) `true`-dursa, `onClose` boş bir funksiya ilə əvəz olunur — yəni **silinmə davam edərkən istifadəçi modalı bağlaya bilmir** (təsadüfən iki dəfə silmə sorğusu göndərməsinin qarşısı alınır). `confirmVariant?: "primary" | "secondary" | "danger"` tipi sayəsində bu prop-a yalnız `Button`-un da qəbul etdiyi 3 dəyərdən biri verilə bilər — uyğunsuzluq compile vaxtı tutulur.

### `shared/ui/EmptyState/index.tsx`, `StatusPanel/index.tsx`, `LoadingState/index.tsx`
Üçü də oxşar məntiqdədir — fərqli "vəziyyət ekranları":
- `EmptyState` — siyahı boşdursa göstərilir ("Hələ post yoxdur" və bir düymə).
- `StatusPanel` — xəta (`app/error.tsx`) və 404 (`app/not-found.tsx`) səhifələrində işlədilir.
- `LoadingState` — `app/loading.tsx`-də, səhifə yüklənərkən "skeleton" (boz, parlaq animasiyalı kart kontur) göstərir:
  ```tsx
  {Array.from({ length: skeletonCount }).map((_, index) => (
    <div key={index} className={styles.skeletonCard} />
  ))}
  ```
  `Array.from({ length: 4 })` — uzunluğu 4 olan boş bir massiv yaradır, sonra onu "4 dənə skeleton kart çək" demək üçün `.map()` ilə gəzirik (içindəki dəyərlər boş olduğu üçün `_` adlandırılıb, bizə yalnız `index` lazımdır). `skeletonCount?: number` tipi sayəsində bu prop verilməsə defolt `4` işlədilir.

### `shared/ui/EditorialFormLayout/index.tsx`
"Create" və "Edit" səhifələrinin hər ikisinin istifadə etdiyi ortaq tərtibatdır (sol tərəfdə başlıq+açıqlama, sağ tərəfdə forma qutusu). Props vasitəsilə fərqli mətn göstərir, amma struktur eynidir. Tipi `{ introKicker: string; title: string; description: string; endpoint: string; endpointSummary: string; children: ReactNode }`-dur — bütün sahələr **məcburidir** (`?` yoxdur), çünki bu layout-u çağıran hər iki səhifə (`app/create/page.tsx`, `app/posts/[id]/edit/page.tsx`) onların hamısını verir.

### `shared/ui/index.ts`
Yenə bir "barrel file" — bütün `shared/ui` komponentlərini tək yerdən idxal etməyə imkan verir (`import { Button, Modal } from "@/shared/ui"`).

---

## 7. `shared/providers/`

### `shared/providers/AppToaster.tsx`
```tsx
"use client";

<Toaster richColors closeButton theme="dark" position="top-right" toastOptions={{ className: styles.toast }} />
```
Bu, "sonner" kitabxanasının özünün hazır komponentidir — bütün toast bildirişlərinin harada (yuxarı-sağ), necə rənglənəcəyini (`richColors` + `theme="dark"` → uğur=yaşıl, xəta=qırmızı, xəbərdarlıq=sarı) və hansı əlavə stili daşıyacağını (`styles.toast`) təyin edir. Heç bir props qəbul etmədiyi üçün ayrıca tip faylı yoxdur. `app/layout.tsx`-də **bir dəfə** çağırılır, bütün tətbiq üçün kifayətdir.

### `shared/providers/index.ts`
Barrel file — `export { default as AppToaster } from "./AppToaster";`.

---

## 8. `features/posts/` — Post mövzusuna aid biznes məntiqi

`shared/` qovluğundan fərqli olaraq, bura "post" sözünü bilən kod yığılır.

### `features/posts/hooks/useSavePost.ts`
"Create" və "Edit" formalarının **hər ikisinin** istifadə etdiyi hook. Parametri yuxarıda (bölmə 2-də) izah edilən sadə, flat tipdir (`UseSavePostParams`):
```ts
export default function useSavePost(params: UseSavePostParams): UseSavePostReturn {
  const isEditMode = params.mode === "edit";

  async function savePost(formData: PostFormData) {
    setError(""); setIsSubmitting(true);
    try {
      const result = isEditMode
        ? await updatePost(params.postId!, formData)
        : await createPost(formData);

      if (!result.result) {
        throw new Error(result.data?.message || "Unable to save the post.");
      }

      const savedPost = result.data;          // TypeScript bilir: bura Post tipindədir
      if (!isEditMode) trackPost(savedPost.id);

      notifySuccess(...);
      router.push("/");
      router.refresh();
      return result;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to save the post.";
      setError(message);
      notifyError("Request failed", message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { error, isEditMode, isSubmitting, savePost };
}
```
Addım-addım data axını:
1. **`isEditMode ? ... : ...`** — `params.mode === "edit"` nəticəsi əvvəlcədən `isEditMode` dəyişəninə yazılıb, sonra hər yerdə bu istifadə olunur. `updatePost(params.postId!, ...)`-dəki `!` işarəsi "bu mütləq mövcuddur, inan mənə" deyir — çünki tip artıq `postId`-ni "ola bilər, olmaya da bilər" elan edib (bax bölmə 2, "Bilərəkdən seçilmiş sadə tip").
2. `isEditMode`-a görə `services/posts.ts`-dəki `updatePost` və ya `createPost` çağırılır.
3. Cavab `result.result === false`-dursa, əl ilə bir `Error` yaradılıb "atılır" (`throw`) — bunu elə bu funksiyanın öz `catch` bloku tutur. (Diqqət: `services/posts.ts` heç vaxt throw etmir, amma bu hook nəticəni yoxlayıb **özü** throw edir ki, aşağıdaki bir `catch` bloku ilə bütün xəta hallarını **tək yerdə** idarə etsin.)
4. `catch (requestError)` blokunda `requestError`-un tipi `unknown`-dur (yenə "useUnknownInCatchVariables" qaydası) — ona görə `requestError instanceof Error` ilə əvvəlcə yoxlanılır, yalnız bundan sonra `.message`-ə icazə verilir.
5. Uğurlu olsa: əgər yeni post yaradılıbsa, `trackPost` ilə onun ID-si cookie-yə əlavə olunur (`shared/hooks/useTrackedPosts.ts`); uğur bildirişi göstərilir; `router.push("/")` istifadəçini ana səhifəyə yönləndirir; `router.refresh()` Next.js-ə "server-dən datanı təzədən çək" deyir (yoxsa yeni post siyahıda görünməzdi, çünki səhifə əvvəlcədən render olunmuş ola bilər).
6. `finally` bloku **hər halda** (uğur da, xəta da olsa) işləyir — `isSubmitting`-i yenidən `false` edir ki, düymə təkrar basıla bilsin.

### `features/posts/hooks/useDeletePost.ts`
Eyni naxış, sadəcə silmə üçün: `deletePost(postId: PostId)` çağırır (`postId` birbaşa funksiyanın parametridir, discriminated union-a ehtiyac yoxdur, çünki silmənin "rejimi" yoxdur), uğur olsa `untrackPost` ilə cookie-dən ID-ni çıxarır, `router.push("/")` edir. Qaytarış tipi `UseDeletePostReturn` → `{ error: string; isDeleting: boolean; handleDelete: () => Promise<ApiResult<null> | null> }` (`null` qayıdır, əgər xəta olsa, çünki bu halda `catch` bloku `return null` edir).

### `features/posts/hooks/usePostSearch.ts`
`/posts` səhifəsindəki axtarış qutusunun məntiqi. `shared/hooks/useDebounce.ts`-i istifadə edir:
```ts
"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks";
import type { Post } from "@/types/post";
import type { UsePostSearchReturn } from "@/types/features/posts/hooks/usePostSearch";

export default function usePostSearch(posts: Post[]): UsePostSearchReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredPosts = useMemo(() => {
    const normalizedTerm = debouncedSearchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return posts;
    }

    return posts.filter((post) => post.title.toLowerCase().includes(normalizedTerm));
  }, [posts, debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, filteredPosts };
}
```
Tipi (`UsePostSearchReturn`, `types/features/posts/hooks/usePostSearch.ts`): `{ searchTerm: string; setSearchTerm: (value: string) => void; filteredPosts: Post[] }`.

- `posts: Post[]` — hook parametr kimi **bütün** postların siyahısını alır (bu artıq serverdə `getPosts()` ilə çəkilib, hooka hazır gəlir).
- `searchTerm` — istifadəçinin **bu an** yazdığı mətn, hər hərfdə dəyişir (`<input>`-un `onChange`-i birbaşa bunu yeniləyir).
- `debouncedSearchTerm = useDebounce(searchTerm, 500)` — yuxarıda izah olunan hookdan istifadə edərək, "istifadəçi 500ms ərzində heç nə yazmasa" dəyişən bir versiya əldə edir.
- `useMemo(() => {...}, [posts, debouncedSearchTerm])` — `useMemo` React-in **yaddaşda saxlama (memoization)** hookudur: "bu hesablamanı yalnız `posts` və ya `debouncedSearchTerm` dəyişəndə yenidən et, başqa hallarda **köhnə nəticəni** istifadə et" deyir. Niyə lazımdır? Çünki `PostsGrid` hər render olunanda (məs. başqa bir state dəyişəndə) bu filtri **təkrar-təkrar** hesablamaq lazımsızdır — `useMemo` performans üçün təkrarın qarşısını alır.
- Filtr məntiqi: `debouncedSearchTerm.trim().toLowerCase()` — başda/sonda boşluqları silir, kiçik hərfə salır (`"Salam"` ilə `"salam"` eyni nəticə versin deyə). Boşdursa (`!normalizedTerm`), **bütün** postlar qaytarılır (axtarış yoxdur deməkdir). Doludursa, `posts.filter(...)` ilə yalnız **başlığında** bu mətn olan postlar saxlanılır (`.includes(normalizedTerm)`).
- Hook `{ searchTerm, setSearchTerm, filteredPosts }` qaytarır — `searchTerm`/`setSearchTerm` `<input>`-u idarə etmək üçün, `filteredPosts` isə ekranda göstəriləcək **son** siyahıdır.

### `features/posts/components/PostsGrid/index.tsx`
`/posts` səhifəsindəki axtarış qutusu + nəticə sayı + kartların grid-ini birləşdirən **client komponent**. Bunun client component olması məcburidir, çünki `<input onChange>` kimi interaktivlik tələb edir — `app/posts/page.tsx`-in özü server component olduğu üçün bunu birbaşa edə bilməz, ona görə bu hissə ayrıca, kiçik bir client komponentə "təcrid" olunub.
```tsx
"use client";

import PostCard from "../PostCard";
import { usePostSearch } from "@/features/posts/hooks";
import { EmptyState } from "@/shared/ui";
import styles from "./PostsGrid.module.css";
import type { PostsGridProps } from "@/types/features/posts/components/PostsGrid";

export default function PostsGrid({ posts }: PostsGridProps) {
  const { searchTerm, setSearchTerm, filteredPosts } = usePostSearch(posts);

  return (
    <>
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title..."
        className={styles.search}
        aria-label="Search posts by title"
      />

      <p className={styles.resultCount}>
        {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"} found
      </p>

      {filteredPosts.length === 0 ? (
        <EmptyState
          kicker="No matches"
          title="No posts match your search"
          description="Try a different title, or clear the search to see your full archive."
        />
      ) : (
        <div className={styles.postGrid}>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
```
- Tipi (`PostsGridProps`): `{ posts: Post[] }` — komponent yalnız "bütün postlar" siyahısını alır, axtarışın özü `usePostSearch` hooku daxilində idarə olunur (komponent özü axtarış **məntiqini** bilmir, sadəcə hookun nəticəsini göstərir — "məntiqi hookda saxla, komponenti sadə saxla" prinsipi).
- `value={searchTerm}` + `onChange={(event) => setSearchTerm(event.target.value)}` — bu, React-də **"controlled input"** (idarə olunan input) adlanır: input-un göstərdiyi mətn həmişə React state-indən (`searchTerm`) gəlir, istifadəçi yazanda `onChange` state-i yeniləyir, dəyişiklik isə dərhal ekranda görünür. `event.target.value` — brauzerin verdiyi hadisə (event) obyektindən, input-un **indiki** mətnini çıxarır.
- `aria-label="Search posts by title"` — ekran oxuyucusu (görmə qüsuru olan istifadəçilər üçün proqram) bu input-un nə üçün olduğunu bilsin deyə (əlçatımlılıq/accessibility), çünki bu inputun yanında görünən bir `<label>` mətni yoxdur.
- Nəticə sayı sətri (`{filteredPosts.length} ... found`) — `===1 ? "result" : "results"` ilə tək/cəm fərqini düzgün yazır (1 nəticə üçün "1 result", 2+ üçün "2 results").
- `filteredPosts.length === 0` olduqda axtarışa uyğun **xüsusi** bir boş-vəziyyət mesajı göstərilir ("No posts match your search") — bu, "ümumiyyətlə heç postun olmaması" mesajından fərqlidir (o, `app/posts/page.tsx`-də, `posts.length === 0` yoxlamasında göstərilir).

### `features/posts/hooks/index.ts`
Barrel file: `useSavePost`, `useDeletePost` və `usePostSearch`-u bir yerdən ixrac edir.

### `features/posts/components/PostCard/index.tsx`
Ana səhifədə və `/posts` səhifəsində hər bir post üçün göstərilən kartdır. Tipi sadədir: `{ post: Post }`. `post` obyektini prop kimi alır, şəkil (varsa), başlıq, qısa məzmun (CSS ilə 3 sətirdən sonra "..." edilir) və 3 düymə göstərir: "Open Story" (detal səhifəsinə link), "Edit" (redaktə səhifəsinə link), və `DeletePostButton` komponenti. `post.imageUrl ? (...) : null` — `imageUrl` `Post` tipində `optional` (`?`) olduğu üçün, TypeScript bu yoxlamanı (şərti render-i) demək olar **məcburi** kimi tələb edir, çünki `imageUrl`-i yoxlamadan birbaşa `<Image src={post.imageUrl}>` yazsan, `imageUrl`-in `undefined` ola biləcəyini bildiyi üçün TypeScript xəbərdarlıq verər.

### `features/posts/components/PostForm/index.tsx`
Həm "Create", həm "Edit" səhifəsində işlədilən forma. Tipi (`PostFormProps`) sadə, flat bir tipdir (əvvəllər discriminated union idi, bax bölmə 2, "Bilərəkdən seçilmiş sadə tip"):
```ts
export type PostFormProps = {
  mode: PostFormMode;
  post?: Post;
};
```
Diqqət: bu tip **özlüyündə** "edit rejimində `post` mütləq verilməlidir" qaydasını məcbur etmir (`post` həmişə optional-dır, `mode` nə olursa olsun). Bu qaydaya əməl etmək indi insanın öhdəsindədir — `app/posts/[id]/edit/page.tsx` həmişə `<PostForm mode="edit" post={post} />` yazır, `app/create/page.tsx` isə `<PostForm mode="create" />` (post-suz).

```ts
export default function PostForm(props: PostFormProps) {
  const { mode, post } = props;
  const [formData, setFormData] = useState({
    title: post?.title || EMPTY_FORM.title,
    ...
  });
  const { error, isEditMode, isSubmitting, savePost } = useSavePost({ mode, postId: post?.id });
```
`post?.title` yazılışı (optional chaining) — "`post` mövcuddursa onun `title`-ını al, yoxdursa `undefined` qaytar" deməkdir. `useSavePost({ mode, postId: post?.id })` — `post?.id` da eyni şəkildə: `post` varsa onun `id`-si, yoxdursa `undefined` ötürülür. Tip flat olduğu üçün, bu sətirdə artıq əvvəlki versiyadaki kimi `props.mode`/`props.post` (destructure-suz) yazmağa **ehtiyac yoxdur** — sadə destructure edilmiş `mode`/`post` dəyişənləri birbaşa işlədilə bilər, çünki narrowing-dən asılı bir şərt qalmayıb.

```ts
function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  const { name, value } = event.target;
  setFormData((currentData) => ({ ...currentData, [name]: value }));
}
```
`ChangeEvent<HTMLInputElement | HTMLTextAreaElement>` — React-in öz tipidir, "bu, ya bir `<input>`-un, ya da bir `<textarea>`-nın dəyişmə hadisəsidir" deyir (forma həm `<input>`, həm `<textarea>` daşıdığı üçün ikisi də union ilə qəbul olunur). Hər input-un `onChange`-i bu funksiyaya bağlıdır. `[name]: value` — input-un `name` atributuna görə (`"title"`, `"body"`, `"imageUrl"`) formData-nın düzgün sahəsini yeniləyir; yəni 3 input üçün 3 ayrı funksiya yazmaq lazım deyil, tək bu funksiya hamısına xidmət edir.

```ts
function getSubmitLabel() {
  if (isSubmitting && isEditMode) return "Saving edits...";
  if (isSubmitting) return "Publishing...";
  if (isEditMode) return "Save Changes";
  return "Publish Post";
}
```
Bu funksiya "Submit" düyməsinin üzərindəki yazını seçir — 4 mümkün hal var (göndərilir/göndərilmir × edit/create), hər biri ayrı `if` ilə yoxlanılır (iç-içə ternary yazmaqdan daha çox oxunaqlıdır).

### `features/posts/components/DeletePostButton/index.tsx`
"Sil" düyməsi + təsdiq modalı. Tipi: `{ postId: PostId; buttonLabel?: string; buttonSize?: "small" | "xsmall"; showInlineError?: boolean }`.
```ts
const { isOpen, open, close } = useDisclosure();                    // modal açıq/bağlıdır
const { error, isDeleting, handleDelete } = useDeletePost(postId);  // əsl silmə məntiqi

async function handleConfirmDelete() {
  const result = await handleDelete();
  if (result) close();   // silmə uğurlu olduqda modalı bağla
}
```
Düyməyə basanda `open()` çağırılır → `ConfirmModal` görünür → "Confirm Delete"ə basanda `handleConfirmDelete` işə düşür → bu da `useDeletePost`-dakı əsl `handleDelete`-i çağırır. `result` `ApiResult<null> | null` tipindədir; `if (result)` yoxlaması burada sadəcə "`null` deyilmi" yoxlamasıdır (uğursuzluqda `handleDelete` `null` qaytarır). Modalı bağlamaq istəyəndə (`onClose`), əgər silmə **hələ davam edirsə** (`isDeleting`), heç nə olmur (bağlanmır) — bu, yarımçıq qalan sorğunun qarşısını alır.

### `features/posts/components/index.ts`
Barrel file: `PostCard`, `PostForm`, `DeletePostButton`, `PostsGrid`-i bir yerdən ixrac edir.

---

## 9. `app/` — Səhifələr (Next.js Router)

Next.js-də `app/` qovluğunun içindəki **qovluq strukturu = URL strukturu**dur. Hər `page.tsx` faylı bir səhifədir.

### `app/layout.tsx`
**Bütün səhifələri əhatə edən** kök şablon. Tipi `RootLayoutProps` → `{ children: ReactNode }`. Burada:
- `import "../styles/globals.css"` — bütün tətbiq üçün ümumi stillər bir dəfə yüklənir.
- `export const metadata: Metadata = { title: "Pulse Press", ... }` — `Metadata` Next.js-in özünün tipidir, `<title>` və `<meta description>` kimi sahələrin **adlarını səhv yazmağın** qarşısını compile vaxtı alır.
- Header (logo + naviqasiya menyusu) — `position: sticky` sayəsində scroll edəndə yuxarıda qalır.
- `{children}` — bu, hazırkı səhifənin (`page.tsx`-in) məzmunudur; Next.js bunu avtomatik bura yerləşdirir (`children: ReactNode` tipi bunu təmin edir).
- Footer (brand, linklər, "API connection live" statusu).
- `<AppToaster />` — toast bildiriş sistemi, bir dəfə bura qoyulur, bütün səhifələrdə işləyir.

### `app/page.tsx` (Ana səhifə, URL: `/`)
```ts
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();   // posts: Post[]
  return ( ...hero bölməsi... postlar boşdursa <EmptyState/>, deyilsə kartların grid-i... );
}
```
Bu, bir **server komponentidir** (funksiya `async`-dır, və heç bir `"use client"` yoxdur). `dynamic = "force-dynamic"` Next.js-ə deyir ki, "bu səhifəni əvvəlcədən tikib saxlama (cache etmə), **hər sorğuda yenidən render et**" — çünki postlar dəyişə bilər, köhnəlmiş versiya göstərmək istəmirik. `getPosts()` `services/posts.server.ts`-dən gəlir, qaytardığı `Post[]`-u TypeScript artıq bilir, ona görə `posts.map((post) => <PostCard key={post.id} post={post} />)` yazılanda `post.id`, `post.title` və s. avtomatik tanınır, səhv sahə adı yazsan dərhal xəta görünür.

### `app/posts/page.tsx` (URL: `/posts`)
Ana səhifəyə bənzəyir, sadəcə hero bölməsi yoxdur — bütün postların siyahısıdır ("Full Archive"). Bu səhifə üçün ayrıca props tipi lazım deyil (heç bir parametr almır), ona görə `types/` qovluğunda qarşılığı yoxdur.

```tsx
{posts.length === 0 ? (
  <EmptyState ... />
) : (
  <PostsGrid posts={posts} />
)}
```
Diqqət: `app/page.tsx` (ana səhifə) postları **birbaşa** `posts.map((post) => <PostCard ... />)` ilə göstərir, amma `/posts` səhifəsi onun əvəzinə `<PostsGrid posts={posts} />` çağırır (bölmə 8-də izah olunan, axtarış qutusu + nəticə sayı + grid-i özündə birləşdirən client komponent). Niyə fərqli? Çünki axtarış funksiyası yalnız "Full Archive" (tam arxiv) səhifəsində mənalıdır — ana səhifə daha "vitrin" rolundadır, sadəcə bir neçə postu göstərir, ona görə axtarışa ehtiyac yoxdur.

### `app/posts/[id]/page.tsx` (URL: `/posts/5` kimi)
`[id]` qovluq adı — **dinamik route** deməkdir, `id` yerinə istənilən qiymət ola bilər. Tipi (`PostDetailPageProps`, `types/app/posts/[id]/page.ts`-də):
```ts
export type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};
```
**Diqqət: `params` bir `Promise`-dur, sadə obyekt yox!** Bu, Next.js-in son versiyalarının (15+) qərarıdır — dinamik route parametrləri artıq **asinxron** ötürülür (performans səbəbilə), ona görə hər yerdə `await params` yazmaq lazımdır:
```ts
export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPost(id);
    return { title: `${post.title} | Pulse Press`, description: post.body };
  } catch {
    return { title: "Post not found | Pulse Press" };
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = await getPost(id);
  ...
}
```
`generateMetadata` Next.js-in xüsusi funksiyasıdır — brauzer tab-ının başlığını (`<title>`) təyin edir, qaytarış tipi `Promise<Metadata>`-dır. Səhifənin əsas məzmunundan **əvvəl** çağırılır. `getPost(id)` cookie-də olmayan ID üçün avtomatik `notFound()` çağıracağı üçün, bu funksiyanın özündə əlavə yoxlamaya ehtiyac yoxdur.

### `app/posts/[id]/edit/page.tsx` (URL: `/posts/5/edit`)
Tipi `EditPostPageProps` (`PostDetailPageProps` ilə eyni şəkildə, sadəcə fərqli ad — hər route-un öz, müstəqil tipi var, çünki gələcəkdə fərqlənə bilərlər). `getPost(id)` ilə mövcud post-u serverdə çəkir, sonra onu `<PostForm mode="edit" post={post} />`-a ötürür — formanın özü isə client tərəfdə doldurulmuş şəkildə açılır. Diqqət: `PostForm`-un tipi indi flat olduğu üçün (bax bölmə 8), `<PostForm mode="edit" />` yazılsa (post-suz), TypeScript bunu **artıq tutmur** (`post` hər iki rejimdə optional-dır) — bu səhvi tutmaq indi insanın diqqətinə qalıb, sadəcə bu səhifə həmişə düzgün yazdığı üçün praktikada problem yoxdur.

### `app/create/page.tsx` (URL: `/create`)
Ən sadə səhifədir — heç bir data çəkmir (`async` deyil), sadəcə boş bir `<PostForm mode="create" />` göstərir.

### `app/error.tsx`
Next.js-in **xüsusi adlı** faylıdır — əgər hər hansı səhifədə (server və ya client tərəfdə) gözlənilməz bir xəta atılsa, Next.js avtomatik olaraq bu komponenti göstərir. Tipi (`ErrorPageProps`):
```ts
export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
```
`Error & { digest?: string }` — "intersection type" (kəsişmə tipi): "bu, standart bir `Error`-dur, **və əlavə olaraq** üzərində bəzən `digest` (server-tərəfdə loglamaq üçün Next.js-in əlavə etdiyi unikal kod) sahəsi də ola bilər" deməkdir. `"use client"` olmalıdır, çünki `reset` funksiyası ilə "yenidən cəhd et" düyməsini işlətmək üçün React-in client-side imkanları lazımdır.

### `app/not-found.tsx`
Yenə Next.js-in xüsusi adlı faylı — `notFound()` funksiyası çağırılan **hər yerdə** (məs. `getPost` daxilində) bu komponent göstərilir. Heç bir prop almadığı üçün ayrıca tip lazım deyil.

### `app/loading.tsx`
Next.js-in xüsusi adlı faylı — səhifə (server komponent) data çəkərkən **avtomatik olaraq** bunu göstərir (React-in "Suspense" mexanizmi vasitəsilə), data gələn kimi əsl səhifə ilə əvəz olunur. Heç bir prop almadığı üçün ayrıca tip lazım deyil.

---

## 10. CSS faylları haqqında qısa qeyd

Hər komponentin yanında onunla **eyni adlı** bir `.module.css` faylı var (məs. `Button/index.tsx` ↔ `Button/Button.module.css`). Bu, "CSS Modules" adlanır: həmin fayldaki `.button` adlı class əslində tikinti zamanı unikal bir ada çevrilir (məs. `Button_button_a1b2c`), ona görə başqa faylda da `.button` adlı class yazsan, bir-birinə **toxunmazlar** (qarışmazlar).

TypeScript baxımından maraqlı bir detal: `import styles from "./Button.module.css"` yazanda, `styles.button`, `styles.primary` kimi sahələrin tipini haradan bilirik? Next.js-in özü (`@types/react` ilə yanaşı) qlobal bir bəyannamə (`declare module "*.module.css"`) gətirir ki, bütün `.module.css` importları "açar-mətn lüğəti" (`{ [className: string]: string }`) kimi tanınsın — bu, layihənin özündə əl ilə yazılan bir şey deyil, Next.js-in TypeScript dəstəyinin bir hissəsidir.

`styles/globals.css` isə bütün tətbiqdə keçərli olan **dəyişənləri** (`--background`, `--foreground`, `--accent` və s.) və `body`-ə aid ümumi stilləri saxlayır. Komponentlərin CSS-ləri rəng/ölçü üçün birbaşa bu dəyişənlərə istinad edir (`background: var(--panel)`), ona görə rəng sxemini dəyişmək istəsən, **yalnız `globals.css`-i** dəyişdirmək kifayətdir.

---

## 11. Hamısı bir yerdə: "Yeni post yaratmaq" nümunəsi ilə tam data (və tip) axını

1. İstifadəçi `/create` səhifəsinə girir → `app/create/page.tsx` → `<PostForm mode="create" />` göstərilir (`PostFormProps`-un "create" qoluna uyğun, `post` verilmir).
2. İstifadəçi sahələri doldurur → `PostForm`-dakı `handleChange(event: ChangeEvent<...>)` hər hərflə `formData` (`{ title, body, imageUrl }`, `useState`-dən infer olunmuş tip) state-ini yeniləyir.
3. "Publish Post" düyməsinə basır → `handleSubmit` → `useSavePost`-dan gələn `savePost(formData: PostFormData)` çağırılır.
4. `savePost` (içində) `params.mode === "create"` olduğu üçün `createPost(formData)`-ı çağırır — bu, `services/posts.ts`-dədir, qaytarış tipi `Promise<ApiResult<Post>>`.
5. `createPost` `http.post<Post>("", formData)` ilə əsl HTTP sorğusunu xarici API-ya göndərir (`services/http.ts`). Generic `<Post>` sayəsində axios-un qaytardığı `response.data` artıq `Post` kimi tanınır.
6. API cavab verir → `successHandler<Post>` (və ya xəta olsa `errorHandler`) cavabı `ApiResult<Post>`-a (`{ data: Post, status, result: true }` və ya `{ data, status, result: false }`) çevirir → `normalizePost` ID-yə `displayId` əlavə edir.
7. Nəticə `useSavePost`-a qayıdır. `if (!result.result) { throw ... }` yoxlamasından **sonra**, TypeScript artıq `result`-un `ApiSuccess<Post>` olduğunu bilir, ona görə `result.data` birbaşa `Post` kimi `savedPost`-a verilir. `trackPost(savedPost.id)` ilə yeni post-un ID-si (`number`) cookie-yə yazılır (`shared/lib/tracked-posts.ts` → brauzerin `document.cookie`-si).
8. `notifySuccess(...)` çağırılır → ekranın küncündə yaşıl bir toast çıxır (`shared/providers/AppToaster.tsx`).
9. `router.push("/")` istifadəçini ana səhifəyə göndərir, `router.refresh()` həmin səhifənin server tərəfini yenidən işə salır.
10. Ana səhifə (`app/page.tsx`) yenidən `getPosts(): Promise<Post[]>`-u çağırır → bu, `services/posts.server.ts`-də cookie-ni (indi yeni ID-ni də daxil edərək) oxuyub, hər ID üçün `readPost` çağırıb, uğurlu olanları bir `Post[]`-də toplayır.
11. Yeni post artıq siyahıda görünür, çünki onun ID-si bir addım əvvəl cookie-yə yazılmışdı. `posts.map((post) => <PostCard key={post.id} post={post} />)` — `PostCard`-ın `{ post: Post }` tipi sayəsində, əgər `services` qatında kimsə yanlışlıqla `Post`-un şəklini (məs. `title`-i silsə) dəyişsəydi, bu sətir compile zamanı **dərhal** xəta verərdi, hələ brauzerdə açmadan.

Bu zəncir, demək olar ki, layihədəki **bütün** qatların (həm dəyər, həm tip baxımından) necə bir-birinə bağlı işlədiyini göstərir: `app/` (səhifə) → `features/posts/` (forma + hook) → `services/` (API çağırışı) → `shared/lib/` (cookie idarəsi) → təkrar `app/` (yeni data ilə), bunların **hamısının üzərində** isə `types/` qatı dayanır və hər addımda "bu dəyərin şəkli nədir?" sualına compile vaxtı cavab verir — beləliklə bir səhv (məs. `post.titel` kimi səhv yazılmış sahə adı) brauzerə çatmadan, hətta `npm run build` mərhələsində tutulur.

---

## 12. Əlavə nümunə: "/posts" səhifəsində axtarış yazanda nə baş verir?

1. Səhifə (`app/posts/page.tsx`, server component) əvvəlcə `getPosts()` ilə **bütün** postları (artıq ən yenidən ən köhnəyə sıralanmış, bax bölmə 3-dəki `.reverse()` izahı) çəkir, `<PostsGrid posts={posts} />`-a ötürür.
2. `PostsGrid` (client component) açılan kimi `usePostSearch(posts)` çağırılır → `searchTerm = ""` (boş), ona görə `filteredPosts` elə `posts`-un özüdür (heç bir filtr yoxdur).
3. İstifadəçi axtarış qutusuna `"r"` yazır → `<input>`-un `onChange`-i `setSearchTerm("r")` çağırır → `searchTerm` dərhal `"r"` olur, **input dərhal** bunu göstərir (controlled input).
4. Amma `usePostSearch` daxilindəki `useDebounce(searchTerm, 500)` **dərhal** reaksiya vermir — 500ms-lik bir taymer başladır.
5. İstifadəçi davam edib `"re"`, `"rea"` yazır → hər hərfdə köhnə taymer ləğv olunur (`clearTimeout`), yeni bir taymer başlayır (bax bölmə 5-dəki `useDebounce` izahı).
6. İstifadəçi yazmağı dayandırır. 500ms keçir, heç bir yeni hərf gəlmir → taymer "yetişir" → `debouncedSearchTerm` nəhayət `"rea"` olur.
7. Bu, `usePostSearch`-dəki `useMemo`-nun **asılılıq siyahısını** (`[posts, debouncedSearchTerm]`) dəyişdirir → filtr **yenidən** hesablanır: `posts.filter((post) => post.title.toLowerCase().includes("rea"))`.
8. `filteredPosts` yenilənir → `PostsGrid` yenidən render olunur → nəticə sayı sətri (`"{N} results found"`) və kartların grid-i (və ya uyğun gəlməsə `EmptyState`) yeni nəticəyə görə yenilənir.

**Diqqət edilməli məqam:** addım 3–6 arasında, baxmayaraq ki istifadəçi 3 hərf yazıb (`r`, `re`, `rea`), **filtr əməliyyatı cəmi bir dəfə** (addım 7-də) işə düşür — debounce-un məhz məqsədi budur: lazımsız təkrar hesablamaların qarşısını almaq.
