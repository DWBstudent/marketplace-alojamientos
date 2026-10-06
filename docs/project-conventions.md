# Project Conventions

Team agreements for the **Marketplace de Alojamientos** project (Angular 21, frontend only). Every team member must read this document before opening their first branch.

## 1. Language rules

| Where | Language |
|---|---|
| Commit messages, README, this document, code comments | English |
| Domain and code identifiers (classes, interfaces, services, components, properties) | Spanish, following the brief and the JSON (`Alojamiento`, `Reserva`, `Resena`, `precioNoche`) |
| Text shown to the user in the interface | Spanish |

- No accents or `ñ` in identifiers, file names or folder names (`Resena`, `banos`, not `Reseña`, `baños`).
- Text visible to the user may use accents (`"Mis reservas"`, `"Máximo 8 huéspedes"`).

## 2. Folder structure

The code is organized by type, following the reference architecture of the course.

```
src/app/
├── components/    Reusable pieces used by several pages (navbar, footer, alojamiento-card)
├── pages/         Screens loaded by a route (inicio, listado-alojamientos, detalle-alojamiento, mis-reservas)
├── services/      Data access and business logic (alojamiento, reserva)
├── models/        TypeScript interfaces (alojamiento, reserva, resena, filtro-busqueda)
├── app.ts         Root component (app.html, app.css)
├── app.config.ts  Application providers
└── app.routes.ts  Routes
public/            Static files copied as-is to the root of the app (data JSON, images)
docs/              Project documentation and prototypes
```

Rules:

- A **page** is whatever a route points to. Anything reused by more than one page is a **component**.
- Pages and components get their own folder (`pages/inicio/inicio.ts`). Services and models are single files.
- Generate pages and components with the CLI: `ng generate component pages/<name>` or `ng generate component components/<name>`.
- Interface code never imports the JSON file directly. All data goes through an Angular service (requirement of the brief).
- Lodgings with `activo: false` must never reach the interface. The service filters them out.
- Static files go in `public/`, not in `src/assets/`.

## 3. Naming conventions

| Element | Convention | Example |
|---|---|---|
| Files and folders | kebab-case | `listado-alojamientos.ts` |
| Classes and interfaces | PascalCase | `Alojamiento`, `ListadoAlojamientos` |
| Methods and variables | camelCase (methods start with a verb) | `getAlojamientos()`, `precioNoche` |
| Constants | UPPER_SNAKE_CASE | `TARIFA_SERVICIO` |
| CSS classes | kebab-case | `alojamiento-card` |

- Components are standalone and keep the CLI default names (class `Inicio`, no `Component` suffix).
- Services use `@Injectable({ providedIn: 'root' })`.
- HTML uses semantic elements (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Avoid inline styles. Prefer the CSS file of the component.
- Code must be readable, with consistent indentation (the `.editorconfig` file defines it).

## 4. Angular 21 notes

- Angular 21 is **zoneless by default**. State that a template reads must live in **signals**. A plain property assigned from an HTTP response may not refresh the view.
- `HttpClient` is expected to be available without extra setup in Angular 21. The first service will confirm it.

## 5. Styling and interface

- **Visual library:** Bootstrap 5.3 (CSS only) and Font Awesome Free 7. Bootstrap's JavaScript is not loaded: interactive behavior, such as the mobile menu, is written in Angular with signals.
- **Prefer Bootstrap classes** (layout, spacing, and `fs-*` or `small` for text sizes) before writing custom CSS. Custom CSS goes in the `.css` file of the component.
- **Colors come from the palette variables** defined in `src/styles.css`: `--kuppo-yellow-light`, `--kuppo-yellow`, `--kuppo-red`, `--kuppo-wine` and `--kuppo-warm-gray`. Do not write hex colors inside components.
- **Primary action buttons** use `btn btn-kuppo`.
- **Typography:** Kaisei HarunoUmi from Google Fonts, loaded in `src/index.html` (weights 400 and 500). Heading sizes keep Bootstrap's defaults, which match the mockup.
- **Icons:** Font Awesome `fa-solid` classes, for example `fa-solid fa-house`.
- **Logo:** `public/assets/images/kuppo-logo.png`, referenced in templates as `assets/images/kuppo-logo.png`.
- **Page metadata:** `lang="es"` and the title `Kuppo` in `src/index.html`.
- **Number format:** prices in Colombian pesos with a thousands separator (`$180.000 / noche`) and ratings with a decimal comma (`4,8`). This requires registering the `es-CO` locale in Angular.
- **Reference design:** the Figma prototypes (link in the README). When the application intentionally differs from the design, update the design or its description so they do not contradict each other.

## 6. Testing

- Unit tests are a development aid to catch regressions. They are not a deliverable of the project.
- Run `ng test --watch=false` before every commit and before opening a Pull Request. All tests must pass.
- Keep tests small: a "should create" test and, when it is useful, one check of a requirement.
- Tests of components that use `routerLink` need `provideRouter([])` in `providers`.
- A failing test is fixed in the code or in the text it checks. A test is never edited only to make it pass.

## 7. Git workflow

- `main` is protected: nobody pushes directly. Every change goes through a Pull Request.
- One branch per task, created from an up-to-date `main`. Name format: `<type>/<short-description>`, for example `feature/lodging-filters`.
  - Types: `feature`, `fix`, `docs`, `chore`.
  - Lowercase, hyphen-separated, ASCII only (no accents or `ñ`). Copy and paste a branch name instead of retyping it.
  - The existing `docs/prototypes-details-checkQuote` is the only exception.
- Commit message format: `type: short description` in English, imperative mood.
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
  - Example: `feat: add city filter to lodging list`.
- Commit often. Every member makes at least one commit of their own on every working day. Small commits that each tell one thing are better than one large commit at the end.
- Pull Requests:
  - The title follows the commit format. The description lists what changed and how it was verified.
  - A teammate must approve it before merging.
  - Merge with **Create a merge commit** (not squash) so the individual commits stay visible.
  - Delete the branch after merging.
- Before opening a Pull Request: `ng serve` compiles and `ng test --watch=false` passes.
- Add files by name (`git add src/app/pages/inicio`), never with `git add .`, so a commit only contains what its message says.
- Chain the tests and the commit so a failing test blocks the commit: `ng test --watch=false && git add <files> && git commit -m "type: description"`.
- One Pull Request covers one topic.
- If you edit a file from the GitHub web interface, change the branch name that GitHub proposes before committing (names such as `patch-1` do not follow the convention).
- Git identity: use the email linked to your GitHub account (`git config --global user.email`). Otherwise your commits are not attributed to you. Commits count in the statistics only once they reach `main`.
- Never commit secrets, `node_modules/`, `.angular/` or `.idea/` (already ignored).

## 8. Business rules to keep in mind

- Quotation: nights × price per night = subtotal; cleaning fee defined by the lodging; service fee is 10% of the subtotal; total = subtotal + cleaning fee + service fee.
- The departure date must be after the arrival date, and the arrival date cannot be in the past.
- The number of guests must be greater than zero and cannot exceed the capacity of the lodging.
- A quotation is generated only with valid dates, and a reservation is allowed only after a valid quotation. Its initial status is `CONFIRMADA`.
- Show a message when a search has no results and when there are no reservations.

## 9. Decisions

### Decided

| Decision | Choice |
|---|---|
| Platform name | Kuppo |
| Folder structure | By type: `components`, `pages`, `services` and `models` |
| Visual library | Bootstrap 5.3 (CSS only) with Font Awesome 7 |
| Typography and palette | Kaisei HarunoUmi and the Kuppo palette as CSS variables |
| Mobile menu | Built with an Angular signal, without Bootstrap JavaScript |

### Still open

| Decision | When it is resolved |
|---|---|
| Suffix `Service` in service names (course convention) or the CLI default without suffix | When the first service is generated |
| Quotation inside the detail page (proposal) or in its own route | After the detail prototype |
| Final location of the data JSON inside `public/` (expected `public/data/marketplace-data.json`) | When the file is added and opened in the browser |
| Quick search bar and date fields on the home page (extra) | After the mandatory requirements are done |
