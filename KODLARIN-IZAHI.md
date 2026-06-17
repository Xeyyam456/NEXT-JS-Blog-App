# Layihədəki Bütün Kodların İzahı

Bu fayl layihədəki **hər bir kod faylının** nə üçün var olduğunu, nə işlədiyini, hansı digər fayllara qoşulduğunu və data-nın haradan haraya hərəkət etdiyini izah edir. Məqsəd budur ki, kodu hər oxuyan adam (hətta yeni başlayan) bu faylı oxuyub layihəni başa düşsün.

> Qeyd: Bu sənədi yazmadan əvvəl bir neçə yerdə kod sadələşdirildi (iç-içə ternary-lər və `.map().filter()` zəncirləri sadə `for` dövrələrinə çevrildi), ona görə kod indi bu sənəddə göstərilənlə eynidir.

---

## 0. Layihə nədir, ümumi məntiq necədir?

Bu, **"Pulse Press"** adlı sadə bir blog tətbiqidir. İstifadəçi post yarada, oxuya, redaktə edə və silə bilər (CRUD). Amma bir neçə vacib xüsusiyyəti var:

1. **Öz database-i yoxdur.** Bütün postlar `https://blog-api-t6u0.onrender.com/posts` ünvanındaki **xarici, paylaşılan** bir API-da saxlanılır. Bu API-ya hamı (bu layihəni kim işlədirsə) eyni zamanda yazır.
2. **Login/auth yoxdur.** Amma "mənim postlarım" funksiyası var. Bu necə işləyir? — Hər post yaradılanda onun ID-si brauzerin **cookie**-sinə yazılır. Sən hansı post ID-lərini yaratmısansa, yalnız onlar sənin ekranında görünür. Başqası yaratdığı post API-da var, amma sənin cookie-ndə olmadığı üçün sənə görünmür.
3. **Server + Client qarışığı.** Next.js-in "App Router"ı istifadə olunur: oxuma (list/detail) əməliyyatları server tərəfdə olur, yazma (create/update/delete) əməliyyatları isə brauzerdə (client component) baş verir.

Kod 4 əsas qatdan ibarətdir:

```
services/        → xarici API ilə danışan funksiyalar (həm server, həm client tərəfdən çağırılır)
shared/          → layihənin hər yerində istifadə olunan ümumi alətlər (UI komponentləri, hook-lar, köməkçi funksiyalar)
features/posts/  → məhz "post" mövzusuna aid biznes məntiqi (hook-lar + komponentlər)
app/              → Next.js-in route (səhifə) qovluğu — URL-lər bura uyğun gəlir
```

---

## 1. Konfiqurasiya faylları

### `package.json`
Layihənin "şəxsiyyət vəsiqəsi"dir. Hansı paketlərin (axios, next, react, sonner) quraşdırıldığını və hansı terminal əmrlərinin mövcud olduğunu göstərir (`npm run dev`, `npm run build`, `npm run start`, `npm run lint`). Yeni bir kitabxana əlavə edəndə bu fayl avtomatik yenilənir.

### `next.config.js`
Next.js-ə layihə üçün xüsusi tənzimləmə demək üçündür. Hazırda boşdur (`{}`) — heç bir xüsusi parametr yoxdur, sadəcə Next.js-in default davranışı işləyir.

### `jsconfig.json`
Bir qısayol təyin edir: `@/` işarəsi həmişə layihənin kök qovluğuna işarə edir. Ona görə fayllarda `../../../shared/ui` kimi uzun yollar yazmaq əvəzinə `@/shared/ui` yaza bilirik.

### `eslint.config.mjs`
Kod yazarkən səhv/səliqəsizlik axtaran "ESLint" alətinin qaydalarını təyin edir (`npm run lint` bu faylı oxuyur). `.next`, `out`, `build` qovluqlarını yoxlamadan kənarda saxlayır.

---

## 2. `services/` — Xarici API ilə əlaqə qatı

Bu qovluqdakı fayllar **yalnız** xarici API-ya sorğu göndərmək və cavabı "təmiz" formaya salmaqla məşğuldur. Heç bir UI (görünüş) kodu yoxdur.

### `services/http.js`
```js
const http = axios.create({
  baseURL: "https://blog-api-t6u0.onrender.com/posts",
  ...
});
```
Bu, "axios" kitabxanasından hazırlanmış tək bir HTTP müştəri (client) obyektidir. `baseURL` sayəsində hər sorğuda tam ünvanı yazmaq lazım deyil — `http.get("/5")` yazsan, əslində `https://blog-api-t6u0.onrender.com/posts/5`-ə sorğu gedir. Bütün digər `services/` faylları bu obyekti idxal edib (`import http from "./http"`) istifadə edir. Yəni API ünvanı dəyişəndə **yalnız bu fayl** dəyişdirilir.

### `services/request-handlers.js`
```js
export const successHandler = (response) => ({ data, status, result: true });
export const errorHandler = (error) => ({ data, status, result: false });
```
İki kiçik funksiya. Məqsədləri: axios-dan gələn cavabı (həm uğurlu, həm xəta) **eyni formaya** salmaq: `{ data, status, result }`. `result` `true`/`false`-dur — uğur olub-olmadığını bildirir. Bu sayədə bu fayllardan istifadə edən kod hər dəfə "bu axios cavabıdır, yoxsa axios xətasıdır?" deyə düşünməli olmur — həmişə eyni 3 sahəli obyektlə işləyir.

### `services/posts.js`
Burada 4 funksiya var: `readPost`, `createPost`, `updatePost`, `deletePost`. Hər biri eyni qəlibdədir:
```js
export async function readPost(id) {
  try {
    const response = await http.get(`/${id}`);
    const result = successHandler(response);
    result.data = normalizePost(result.data);
    return result;
  } catch (error) {
    return errorHandler(error);
  }
}
```
Addım-addım: `http.get` ilə API-ya sorğu gedir → uğurlu olsa `successHandler` cavabı `{data,status,result:true}`-a çevirir → `normalizePost` post obyektinə `displayId` sahəsi əlavə edir (aşağıda izah olunur) → nəticə qaytarılır. Xəta olsa (internet kəsilsə, server 404/500 qaytarsa) `catch` bloku işə düşür və `errorHandler` çağırılır.

**Çox vacib qayda:** bu fayldakı funksiyalar **heç vaxt `throw` etmir** — uğursuz olanda da normal şəkildə `{ result: false, ... }` formasında obyekt **qaytarır**. Bunu çağıran kod həmişə `if (!result.result)` yoxlaması ilə xətanı tutmalıdır.

`normalizePost` funksiyası:
```js
function normalizePost(post) {
  if (!post || typeof post !== "object") return post;
  return { ...post, displayId: post.id };
}
```
Bu, post obyektinə `displayId` adlı yeni sahə əlavə edir (dəyəri `id` ilə eynidir). Niyə lazımdır? Çünki UI-da "Post #7" kimi göstərəndə birbaşa `post.id`-dən asılı olmaq əvəzinə ayrıca `displayId` adı saxlamaq, gələcəkdə "görünən nömrə" ilə "əsl id"-ni ayırmaq istəsək asanlıq yaradır.

### `services/posts.server.js`
Bu fayl **yalnız serverdə** işləyir (çünki `next/headers`-dən `cookies()` istifadə edir — bu, brauzerdə mövcud deyil). İki funksiya ixrac edir: `getPosts()` (siyahı üçün) və `getPost(id)` (tək post üçün). Bunlar `app/` qovluğundakı **bütün səhifələr** tərəfindən çağırılır — heç bir səhifə `services/posts.js`-i birbaşa oxumaq üçün çağırmır, mütləq bu faylın üzərindən keçir.

```js
async function getTrackedPostIds() {
  const cookieStore = await cookies();
  const trackedIdsValue = cookieStore.get(TRACKED_POST_IDS_COOKIE)?.value;
  return parseTrackedPostIds(trackedIdsValue);
}
```
Bu köməkçi funksiya brauzerin göndərdiyi cookie-ni oxuyur və "sənin yaratdığın post ID-lərinin siyahısı"nı (massiv kimi, məs. `[3, 7, 12]`) qaytarır.

```js
export async function getPosts() {
  const trackedPostIds = await getTrackedPostIds();
  const posts = [];

  for (const postId of trackedPostIds) {
    const result = await readPost(postId);
    if (result.result) {
      posts.push(result.data);
    }
  }

  return posts;
}
```
Sadə dillə: "əvvəlcə cookie-dəki ID-ləri al, sonra hər ID üçün API-dan o postu oxu, uğurlu alınanları bir siyahıya yığ, siyahını qaytar". Əgər hansısa post API-dan silinibsə (məs. başqa yolla), o sadəcə siyahıya əlavə olunmur, proqram çökmür.

```js
export async function getPost(id) {
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
Burada əvvəlcə yoxlanılır: "bu ID mənim cookie-mdə var mı?" — yoxdursa, hətta API-da mövcud olsa belə, Next.js-in `notFound()` funksiyası çağırılır (bu, istifadəçiyə 404 səhifəsi göstərir). Cookie-də varsa, API-dan real datanı çəkməyə çalışır; alına bilməsə, ya 404 göstərilir, ya da ümumi xəta atılır (bu xəta `app/error.jsx`-ə gedib çıxır).

---

## 3. `shared/lib/` — Hər yerdə işlədilən köməkçi funksiyalar

### `shared/lib/tracked-posts.js`
Bu fayl, yuxarıda bəhs edilən **"cookie-də ID saxlamaq"** məntiqinin bütün detallarını saxlayır. Çox kiçik, təkrar istifadə oluna bilən funksiyalardan ibarətdir:

- `normalizePostId(postId)` — gələn dəyəri rəqəmə çevirir; əgər mənasız dəyərdirsə (mənfi, kəsr, mətn və s.) `null` qaytarır.
- `uniquePostIds(postIds)` — siyahıdaki təkrarları silir:
  ```js
  function uniquePostIds(postIds) {
    const uniqueIds = [];
    for (const postId of postIds) {
      if (!uniqueIds.includes(postId)) {
        uniqueIds.push(postId);
      }
    }
    return uniqueIds;
  }
  ```
  Yəni boş bir siyahı açırıq, gələn ID-ləri tək-tək yoxlayırıq, əgər artıq siyahıda yoxdursa əlavə edirik.
- `parseTrackedPostIds(rawValue)` — cookie-dən gələn mətni (məs. `"3,7,12"`) götürüb, vergüllə bölür, hər parçanı rəqəmə çevirir, səhv olanları kənarlaşdırır və son nəticədə təkrarsız bir rəqəm siyahısı qaytarır.
- `addTrackedPostId` / `removeTrackedPostId` — mövcud siyahıya bir ID əlavə edir / çıxarır.
- `serializeTrackedPostIds(postIds)` — rəqəm siyahısını yenidən cookie-yə yazılacaq mətnə (`"3,7,12"`) çevirir.
- `readBrowserCookie` / `writeBrowserCookie` / `clearBrowserCookie` — brauzerin `document.cookie`-si ilə birbaşa işləyən aşağı-səviyyəli funksiyalar. `typeof document === "undefined"` yoxlaması var, çünki bu funksiyalar bəzən serverdə də import oluna bilər — server-də `document` obyekti mövcud olmadığı üçün bu yoxlama proqramın çökməsinin qarşısını alır.
- `readTrackedPostIdsFromBrowser` / `trackPostInBrowser` / `untrackPostInBrowser` — yuxarıdakı bütün kiçik funksiyaları birləşdirib, "brauzerdə bir post-u izlə/izləməni dayandır" kimi hazır əməliyyatlar təqdim edir. Bunları çağıran yer: `shared/hooks/useTrackedPosts.js`.

**Niyə bu qədər kiçik funksiyaya bölünüb?** Hər funksiya tək bir işi görür (Single Responsibility) — bu, həm test etməyi, həm də səhv tapmağı asanlaşdırır.

### `shared/lib/notifications.js`
Ekranın küncündə çıxan balaca bildiriş qutucuqlarını (toast) idarə edir, "sonner" kitabxanasının üzərindən:
```js
export function notifySuccess(message, description) { toast.success(message, { description }); }
export function notifyError(message, description) { toast.error(message, { description }); }
export function notifyInfo(message, description) { toast.warning(message, { description }); }
```
- `notifySuccess` → yaşıl rəngli uğur bildirişi.
- `notifyError` → qırmızı rəngli xəta bildirişi.
- `notifyInfo` → daxildə əslində `toast.warning` çağırır, ona görə sarı/kəhrəba rəngdə çıxır (məs. "Delete cancelled" mesajı bu tipdəndir).

Bu funksiyalar `features/posts/hooks/useSavePost.js` və `useDeletePost.js` tərəfindən çağırılır.

---

## 4. `shared/hooks/` — Ümumi React hook-ları

### `shared/hooks/useDisclosure.js`
Açıq/bağlı (boolean) vəziyyəti idarə edən çox sadə bir hook — adı "disclosure" (açma-bağlama) buradan gəlir:
```js
const [isOpen, setIsOpen] = useState(initialOpen);
function open() { setIsOpen(true); }
function close() { setIsOpen(false); }
function toggle() { setIsOpen((v) => !v); }
```
Modal/popup açıb-bağlamaq lazım olan **hər yerdə** bu hook işlədilir (məs. `DeletePostButton`-da silmə modalını açmaq üçün).

### `shared/hooks/useModalLifecycle.js`
Modal açıq olanda iki kiçik "yan təsir" (side effect) idarə edir:
```js
useEffect(() => {
  if (!isOpen) return undefined;

  function handleKeyDown(event) {
    if (event.key === "Escape") onClose();
  }

  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [isOpen, onClose]);
```
1. Modal açılanda səhifənin scroll-unu kilidləyir (`overflow: hidden`) ki, arxa fon sürüşməsin.
2. `Escape` düyməsinə basılanda modalı bağlayır.
3. Modal bağlananda (və ya komponent silinəndə) hər ikisini geri "təmizləyir" (cleanup) — bu, `useEffect`-in qaytardığı funksiyadır.

### `shared/hooks/useTrackedPosts.js`
`shared/lib/tracked-posts.js`-dəki "xam" funksiyaları React state-i ilə birləşdirir:
```js
const [trackedPostIds, setTrackedPostIds] = useState(() => readTrackedPostIdsFromBrowser());

function trackPost(postId) {
  trackPostInBrowser(postId);                                   // cookie-ni yenilə
  setTrackedPostIds((ids) => addTrackedPostId(ids, postId));     // React state-i yenilə
}
```
Niyə iki yerdə yenilənir? Çünki cookie brauzer yaddaşıdır (səhifə yenilənəndə də qalır), `trackedPostIds` state-i isə yalnız bu komponentin ekranda "canlı" görünüşü üçündür. İkisini sinxron saxlamaq lazımdır. Bu hook `useSavePost` (post yaradılanda `trackPost`) və `useDeletePost`-da (post silinəndə `untrackPost`) çağırılır.

### `shared/hooks/index.js`
Sadəcə "barrel file" — yəni bu qovluqdaki hook-ları bir yerdən idxal etməyə imkan verir:
```js
export { default as useDisclosure } from "./useDisclosure";
export { default as useModalLifecycle } from "./useModalLifecycle";
export { default as useTrackedPosts } from "./useTrackedPosts";
```
Bu sayədə başqa fayllarda `import { useDisclosure } from "@/shared/hooks"` yazmaq kifayətdir, hər hook üçün ayrıca tam yol yazmaq lazım deyil.

---

## 5. `shared/ui/` — Təkrar istifadə olunan görünüş (UI) komponentləri

Bu qovluqdakı komponentlərin heç biri "post" sözünü bilmir — onlar tamamilə ümumi, istənilən layihədə işlənə bilən "tikinti hissələri"dir (Button, Modal və s.).

### `shared/ui/Button/index.jsx`
```js
const VARIANT_CLASS_NAMES = { primary: styles.primary, secondary: styles.secondary, danger: styles.danger };
const SIZE_CLASS_NAMES = { small: styles.small, xsmall: styles.xsmall };
```
Bu iki obyekt, sadəcə "açar → CSS class" lüğətidir. `variant="danger"` deyilsə, `VARIANT_CLASS_NAMES["danger"]` ilə düzgün rəngli class tapılır.
```js
const mergedClassName = [styles.button, styles.fullWidthMobile, variantClassName, sizeClassName, className]
  .filter(Boolean)
  .join(" ");
```
Bu sətir bir neçə class adını bir mətndə birləşdirir, amma əvvəlcə `.filter(Boolean)` ilə boş/`undefined` olanları çıxarır (məsələn `size` verilməyibsə `sizeClassName` boş mətndir, bu boş mətn nəticəyə qarışmasın deyə filtrlənir).
Komponent həm `<a>` (link, `href` verilibsə, Next.js-in `Link`-i ilə) həm də `<button>` kimi işləyə bilir — bu, "bir komponent, iki rol" nümunəsidir.

### `shared/ui/Kicker/index.jsx`
Kiçik, rəngli "etiket" yazısıdır (məs. "Post #7"). `tone="muted"` versiyası daha solğun rəngdədir. Daxili məntiqi `Button` ilə demək olar eynidir (class adlarını birləşdirmək).

### `shared/ui/Modal/index.jsx`
Ekranın ortasında çıxan popup pəncərəsinin "skeleti"dir (başlıq, bağlama düyməsi, açıqlama, sərbəst məzmun yeri `children`, alt düymələr `footer`).
```js
if (!isOpen) return null;

return createPortal(
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
      ...
    </div>
  </div>,
  document.body
);
```
İki vacib detal:
1. **`isOpen` `false`-dursa, heç nə render olunmur** (`return null`) — modal yalnız lazım olanda DOM-a girir.
2. **`createPortal(..., document.body)`** — modal HTML-də harada yazılıbsa yazılsın (məs. bir kartın içində), React onu **birbaşa `<body>`-nin sonuna** "köçürür". Bu çox vacibdir: əgər köçürülməsəydi, modal valideyn elementin (məs. hover-də "böyüyən" kart) daxilində qalardı, və həmin valideyndə CSS `transform` varsa, modalın `position: fixed`-i pozulurdu (bu, real layihədə tutulan bir bug idi — "siçanı kənara çıxaranda modal sıçrayır" şəklində özünü göstərirdi). Portal bu problemi tam həll edir.
3. `overlay`-ə klikləmək `onClose`-u çağırır (kənara klik = bağla), amma `panel`-ə klikləmək `event.stopPropagation()` ilə bu klikin `overlay`-ə "sızmasının" qarşısını alır — yoxsa panelin içinə klikləmək də modalı bağlayardı.
`useId()` React-in hook-udur, hər render üçün unikal bir ID yaradır — bu, `aria-labelledby` ilə `h2`-ni bir-birinə bağlamaq üçün işlədilir (ekran oxuyucuları üçün, əlçatımlılıq/accessibility).

### `shared/ui/ConfirmModal/index.jsx`
`Modal`-ın üzərinə qurulmuş, "Təsdiq et / İmtina et" formatlı xüsusi versiyadır:
```js
<Modal
  isOpen={isOpen}
  onClose={isPending ? () => {} : onClose}
  ...
  footer={<>...iki Button...</>}
/>
```
`isPending` (məs. silinmə davam edirsə) `true`-dursa, `onClose` boş bir funksiya ilə əvəz olunur — yəni **silinmə davam edərkən istifadəçi modalı bağlaya bilmir** (təsadüfən iki dəfə silmə sorğusu göndərməsinin qarşısı alınır).

### `shared/ui/EmptyState/index.jsx`, `StatusPanel/index.jsx`, `LoadingState/index.jsx`
Üçü də oxşar məntiqdədir — fərqli "vəziyyət ekranları":
- `EmptyState` — siyahı boşdursa göstərilir ("Hələ post yoxdur" və bir düymə).
- `StatusPanel` — xəta (`app/error.jsx`) və 404 (`app/not-found.jsx`) səhifələrində işlədilir.
- `LoadingState` — `app/loading.jsx`-də, səhifə yüklənərkən "skeleton" (boz, parlaq animasiyalı kart kontur) göstərir:
  ```js
  {Array.from({ length: skeletonCount }).map((_, index) => (
    <div key={index} className={styles.skeletonCard} />
  ))}
  ```
  `Array.from({ length: 4 })` — uzunluğu 4 olan boş bir massiv yaradır, sonra onu "4 dənə skeleton kart çək" demək üçün `.map()` ilə gəzirik (içindəki dəyərlər boş olduğu üçün `_` adlandırılıb, bizə yalnız `index` lazımdır).

### `shared/ui/EditorialFormLayout/index.jsx`
"Create" və "Edit" səhifələrinin hər ikisinin istifadə etdiyi ortaq tərtibatdır (sol tərəfdə başlıq+açıqlama, sağ tərəfdə forma qutusu). Props vasitəsilə fərqli mətn göstərir, amma struktur eynidir.

### `shared/ui/index.js`
Yenə bir "barrel file" — bütün `shared/ui` komponentlərini tək yerdən idxal etməyə imkan verir (`import { Button, Modal } from "@/shared/ui"`).

---

## 6. `shared/providers/`

### `shared/providers/AppToaster.jsx`
```jsx
<Toaster richColors closeButton theme="dark" position="top-right" toastOptions={{ className: styles.toast }} />
```
Bu, "sonner" kitabxanasının özünün hazır komponentidir — bütün toast bildirişlərinin harada (yuxarı-sağ), necə rənglənəcəyini (`richColors` + `theme="dark"` → uğur=yaşıl, xəta=qırmızı, xəbərdarlıq=sarı) və hansı əlavə stili daşıyacağını (`styles.toast`) təyin edir. `app/layout.jsx`-də **bir dəfə** çağırılır, bütün tətbiq üçün kifayətdir.

### `shared/providers/index.js`
Barrel file — `export { default as AppToaster } from "./AppToaster";`.

---

## 7. `features/posts/` — Post mövzusuna aid biznes məntiqi

`shared/` qovluğundan fərqli olaraq, bura "post" sözünü bilən kod yığılır.

### `features/posts/hooks/useSavePost.js`
"Create" və "Edit" formalarının **hər ikisinin** istifadə etdiyi hook (`mode` prop-u ilə fərqlənir):
```js
async function savePost(formData) {
  setError(""); setIsSubmitting(true);
  try {
    const result = isEditMode
      ? await updatePost(postId, formData)
      : await createPost(formData);

    if (!result.result) {
      throw new Error(result.data?.message || "Unable to save the post.");
    }

    const savedPost = result.data;
    if (!isEditMode) trackPost(savedPost.id);

    notifySuccess(...);
    router.push("/");
    router.refresh();
    return result;
  } catch (requestError) {
    setError(requestError.message);
    notifyError("Request failed", requestError.message);
    return null;
  } finally {
    setIsSubmitting(false);
  }
}
```
Addım-addım data axını:
1. `isEditMode`-a görə `services/posts.js`-dəki `updatePost` və ya `createPost` çağırılır.
2. Cavab `result.result === false`-dursa, əl ilə bir `Error` yaradılıb "atılır" (`throw`) — bunu elə bu funksiyanın öz `catch` bloku tutur. (Diqqət: `services/posts.js` heç vaxt throw etmir, amma bu hook nəticəni yoxlayıb **özü** throw edir ki, aşağıdaki bir `catch` bloku ilə bütün xəta hallarını **tək yerdə** idarə etsin.)
3. Uğurlu olsa: əgər yeni post yaradılıbsa, `trackPost` ilə onun ID-si cookie-yə əlavə olunur (`shared/hooks/useTrackedPosts.js`); uğur bildirişi göstərilir; `router.push("/")` istifadəçini ana səhifəyə yönləndirir; `router.refresh()` Next.js-ə "server-dən datanı təzədən çək" deyir (yoxsa yeni post siyahıda görünməzdi, çünki səhifə əvvəlcədən render olunmuş ola bilər).
4. `finally` bloku **hər halda** (uğur da, xəta da olsa) işləyir — `isSubmitting`-i yenidən `false` edir ki, düymə təkrar basıla bilsin.

### `features/posts/hooks/useDeletePost.js`
Eyni naxış, sadəcə silmə üçün: `deletePost(postId)` çağırır, uğur olsa `untrackPost` ilə cookie-dən ID-ni çıxarır, `router.push("/")` edir.

### `features/posts/hooks/index.js`
Barrel file: `useSavePost` və `useDeletePost`-u bir yerdən ixrac edir.

### `features/posts/components/PostCard/index.jsx`
Ana səhifədə və `/posts` səhifəsində hər bir post üçün göstərilən kartdır. `post` obyektini prop kimi alır, şəkil (varsa), başlıq, qısa məzmun (CSS ilə 3 sətirdən sonra "..." edilir) və 3 düymə göstərir: "Open Story" (detal səhifəsinə link), "Edit" (redaktə səhifəsinə link), və `DeletePostButton` komponenti.

### `features/posts/components/PostForm/index.jsx`
Həm "Create", həm "Edit" səhifəsində işlədilən forma:
```js
const [formData, setFormData] = useState({
  title: post?.title || EMPTY_FORM.title,
  ...
});
```
Əgər `post` prop-u verilibsə (edit rejimi), input-lar onun məlumatları ilə "doldurulmuş" başlayır; verilməyibsə (create rejimi), boş başlayır. `post?.title` yazılışı — "`post` mövcuddursa onun `title`-ını al, yoxdursa `undefined` qaytar" deməkdir (optional chaining).
```js
function handleChange(event) {
  const { name, value } = event.target;
  setFormData((currentData) => ({ ...currentData, [name]: value }));
}
```
Hər input-un `onChange`-i bu funksiyaya bağlıdır. `[name]: value` — input-un `name` atributuna görə (`"title"`, `"body"`, `"imageUrl"`) formData-nın düzgün sahəsini yeniləyir; yəni 3 input üçün 3 ayrı funksiya yazmaq lazım deyil, tək bu funksiya hamısına xidmət edir.
```js
function getSubmitLabel() {
  if (isSubmitting && isEditMode) return "Saving edits...";
  if (isSubmitting) return "Publishing...";
  if (isEditMode) return "Save Changes";
  return "Publish Post";
}
```
Bu funksiya "Submit" düyməsinin üzərindəki yazını seçir — 4 mümkün hal var (göndərilir/göndərilmir × edit/create), hər biri ayrı `if` ilə yoxlanılır (əvvəllər bura iç-içə `? :` (ternary) yazılmışdı, daha çətin oxunurdu — indi sadələşdirilib).

### `features/posts/components/DeletePostButton/index.jsx`
"Sil" düyməsi + təsdiq modalı:
```js
const { isOpen, open, close } = useDisclosure();          // modal açıq/bağlıdır
const { error, isDeleting, handleDelete } = useDeletePost(postId);  // əsl silmə məntiqi

async function handleConfirmDelete() {
  const result = await handleDelete();
  if (result) close();   // silmə uğurlu olduqda modalı bağla
}
```
Düyməyə basanda `open()` çağırılır → `ConfirmModal` görünür → "Confirm Delete"ə basanda `handleConfirmDelete` işə düşür → bu da `useDeletePost`-dakı əsl `handleDelete`-i çağırır. Modalı bağlamaq istəyəndə (`onClose`), əgər silmə **hələ davam edirsə** (`isDeleting`), heç nə olmur (bağlanmır) — bu, yarımçıq qalan sorğunun qarşısını alır.

### `features/posts/components/index.js`
Barrel file: `PostCard`, `PostForm`, `DeletePostButton`-u bir yerdən ixrac edir.

---

## 8. `app/` — Səhifələr (Next.js Router)

Next.js-də `app/` qovluğunun içindəki **qovluq strukturu = URL strukturu**dur. Hər `page.jsx` faylı bir səhifədir.

### `app/layout.jsx`
**Bütün səhifələri əhatə edən** kök şablon. Burada:
- `import "../styles/globals.css"` — bütün tətbiq üçün ümumi stillər bir dəfə yüklənir.
- Header (logo + naviqasiya menyusu) — `position: sticky` sayəsində scroll edəndə yuxarıda qalır.
- `{children}` — bu, hazırkı səhifənin (`page.jsx`-in) məzmunudur; Next.js bunu avtomatik bura yerləşdirir.
- Footer (brand, linklər, "API connection live" statusu).
- `<AppToaster />` — toast bildiriş sistemi, bir dəfə bura qoyulur, bütün səhifələrdə işləyir.

### `app/page.jsx` (Ana səhifə, URL: `/`)
```js
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();
  return ( ...hero bölməsi... postlar boşdursa <EmptyState/>, deyilsə kartların grid-i... );
}
```
Bu, bir **server komponentidir** (funksiya `async`-dır, və heç bir `"use client"` yoxdur). `dynamic = "force-dynamic"` Next.js-ə deyir ki, "bu səhifəni əvvəlcədən tikib saxlama (cache etmə), **hər sorğuda yenidən render et**" — çünki postlar dəyişə bilər, köhnəlmiş versiya göstərmək istəmirik. `getPosts()` `services/posts.server.js`-dən gəlir.

### `app/posts/page.jsx` (URL: `/posts`)
Ana səhifəyə bənzəyir, sadəcə hero bölməsi yoxdur — bütün postların sadə bir siyahısıdır ("Full Archive").

### `app/posts/[id]/page.jsx` (URL: `/posts/5` kimi)
`[id]` qovluq adı — **dinamik route** deməkdir, `id` yerinə istənilən qiymət ola bilər.
```js
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const post = await getPost(id);
    return { title: `${post.title} | Pulse Press`, ... };
  } catch {
    return { title: "Post not found | Pulse Press" };
  }
}
```
`generateMetadata` Next.js-in xüsusi funksiyasıdır — brauzer tab-ının başlığını (`<title>`) təyin edir. Səhifənin əsas məzmunundan **əvvəl** çağırılır.
```js
export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  ...
}
```
`getPost(id)` cookie-də olmayan ID üçün avtomatik `notFound()` çağıracağı üçün, bu funksiyanın özündə əlavə yoxlamaya ehtiyac yoxdur.

### `app/posts/[id]/edit/page.jsx` (URL: `/posts/5/edit`)
`getPost(id)` ilə mövcud post-u serverdə çəkir, sonra onu `<PostForm mode="edit" post={post} />`-a ötürür — formanın özü isə client tərəfdə doldurulmuş şəkildə açılır.

### `app/create/page.jsx` (URL: `/create`)
Ən sadə səhifədir — heç bir data çəkmir (`async` deyil), sadəcə boş bir `<PostForm mode="create" />` göstərir.

### `app/error.jsx`
Next.js-in **xüsusi adlı** faylıdır — əgər hər hansı səhifədə (server və ya client tərəfdə) gözlənilməz bir xəta atılsa, Next.js avtomatik olaraq bu komponenti göstərir. `"use client"` olmalıdır, çünki `reset` funksiyası ilə "yenidən cəhd et" düyməsini işlətmək üçün React-in client-side imkanları lazımdır.

### `app/not-found.jsx`
Yenə Next.js-in xüsusi adlı faylı — `notFound()` funksiyası çağırılan **hər yerdə** (məs. `getPost` daxilində) bu komponent göstərilir.

### `app/loading.jsx`
Next.js-in xüsusi adlı faylı — səhifə (server komponent) data çəkərkən **avtomatik olaraq** bunu göstərir (React-in "Suspense" mexanizmi vasitəsilə), data gələn kimi əsl səhifə ilə əvəz olunur.

---

## 9. CSS faylları haqqında qısa qeyd

Hər komponentin yanında onunla **eyni adlı** bir `.module.css` faylı var (məs. `Button/index.jsx` ↔ `Button/Button.module.css`). Bu, "CSS Modules" adlanır: həmin fayldaki `.button` adlı class əslində tikinti zamanı unikal bir ada çevrilir (məs. `Button_button_a1b2c`), ona görə başqa faylda da `.button` adlı class yazsan, bir-birinə **toxunmazlar** (qarışmazlar).

`styles/globals.css` isə bütün tətbiqdə keçərli olan **dəyişənləri** (`--background`, `--foreground`, `--accent` və s.) və `body`-ə aid ümumi stilləri saxlayır. Komponentlərin CSS-ləri rəng/ölçü üçün birbaşa bu dəyişənlərə istinad edir (`background: var(--panel)`), ona görə rəng sxemini dəyişmək istəsən, **yalnız `globals.css`-i** dəyişdirmək kifayətdir.

---

## 10. Hamısı bir yerdə: "Yeni post yaratmaq" nümunəsi ilə tam data axını

1. İstifadəçi `/create` səhifəsinə girir → `app/create/page.jsx` → `<PostForm mode="create" />` göstərilir.
2. İstifadəçi sahələri doldurur → `PostForm`-dakı `handleChange` hər hərflə `formData` state-ini yeniləyir.
3. "Publish Post" düyməsinə basır → `handleSubmit` → `useSavePost`-dan gələn `savePost(formData)` çağırılır.
4. `savePost` (içində) `createPost(formData)`-ı çağırır — bu, `services/posts.js`-dədir.
5. `createPost` `http.post("", formData)` ilə əsl HTTP sorğusunu xarici API-ya göndərir (`services/http.js`).
6. API cavab verir → `successHandler` (və ya xəta olsa `errorHandler`) cavabı `{ data, status, result }`-a çevirir → `normalizePost` ID-yə `displayId` əlavə edir.
7. Nəticə `useSavePost`-a qayıdır. `result.result === true`-dursa: yeni post-un ID-si `trackPost` ilə cookie-yə yazılır (`shared/lib/tracked-posts.js` → brauzerin `document.cookie`-si).
8. `notifySuccess(...)` çağırılır → ekranın küncündə yaşıl bir toast çıxır (`shared/providers/AppToaster.jsx`).
9. `router.push("/")` istifadəçini ana səhifəyə göndərir, `router.refresh()` həmin səhifənin server tərəfini yenidən işə salır.
10. Ana səhifə (`app/page.jsx`) yenidən `getPosts()`-u çağırır → bu, `services/posts.server.js`-də cookie-ni (indi yeni ID-ni də daxil edərək) oxuyub, hər ID üçün `readPost` çağırıb, uğurlu olanları bir siyahıda toplayır.
11. Yeni post artıq siyahıda görünür, çünki onun ID-si bir addım əvvəl cookie-yə yazılmışdı.

Bu zəncir, demək olar ki, layihədəki **bütün** qatların necə bir-birinə bağlı işlədiyini göstərir: `app/` (səhifə) → `features/posts/` (forma + hook) → `services/` (API çağırışı) → `shared/lib/` (cookie idarəsi) → təkrar `app/` (yeni data ilə).
