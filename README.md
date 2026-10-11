# Marketplace de Alojamientos

## Description

Frontend web application developed in Angular for Inversiones LR, which allows guests to browse accommodations, filter them, view details, get a price quote, and register a simulated booking.

## Team Members

* CESAR DAVID CARDENAS PEÑA
* ANGEL DANIEL AYA PAEZ
* DANIEL ZAPATA PIRAZAN
* ANDRES FELIPE NEISA MORENO

## Technologies Used

*  Angular 21 (standalone components and signals) with TypeScript 5.9
*  RxJS 7.8
*  Bootstrap 5.3 (CSS only) and Font Awesome Free 7
*  Kaisei HarunoUmi typeface (Google Fonts)
*  Vitest 4 for unit tests
*  Git and GitHub for version control, and Figma for the prototypes

## Prerequisites

*  Node.js ^20.19.0, ^22.12.0 or ^24.0.0 (the versions supported by Angular 21)
*  npm (it comes with Node.js; the project was developed with npm 11)
*  Git
*  An internet connection, because the typeface is loaded from Google Fonts

## Installation Instructions

Using Bash:

git clone https://github.com/DWBstudent/marketplace-alojamientos.git
cd marketplace-alojamientos
npm install

## Running Instructions

Using Bash:

npm start
Then open http://localhost:4200/ in the browser.

Other useful commands:

bash
npm test                    # unit tests in watch mode
npm test -- --watch=false   # unit tests, a single run
npm run build               # production build in the dist folder

## Main Features

* **Home:** name and slogan of the platform, a short description, the "Los imperdibles" section with the best rated lodgings, and access to the search.
* **Lodging list:** cards with photo, name, city, type, capacity, services, price per night and rating, with loading, error and "no results" states.
* **Filters:** city, lodging type, number of guests (lodgings with enough capacity) and maximum price (inclusive). They work together, update the list immediately and can be cleared with one button.
* **Lodging detail:** photos, description, city and location, type, capacity, rooms, beds, bathrooms, price per night, services, house rules, rating and reviews.
* **Quote:** arrival and departure dates and number of guests, with a validation message under each field. It shows nights, subtotal, cleaning fee, service fee (10 % of the subtotal) and total before booking. Dates are read as UTC, so the local time zone never changes the number of nights.
* **Simulated booking:** guest name and email. The "Reservar" button is enabled only after a valid quote, and the booking is checked again before it is saved with the state `CONFIRMADA`.
* **My bookings:** list of the saved bookings (lodging, city, dates, guests, total and state), or a message when there are none. Bookings are stored in `localStorage`, so they remain after reloading the page.
* **Navigation and layout:** responsive navigation bar with a mobile menu, footer, and Angular routes between all the pages.

### Business rules

* The departure date must be later than the arrival date.
* The arrival date cannot be before today.
* The number of guests must be greater than zero and cannot exceed the capacity of the lodging.
* The price per night must be greater than zero.
* A quote is only generated when the dates are valid, and a booking is only made after a valid quote.
* The service fee is 10 % of the subtotal.
* Inactive lodgings (`activo: false`) are never shown.
* When a search finds no results, the user is told.

## Application routes

| Route | Page | Description |
|---|---|---|
| `/` | `Inicio` | Home with the featured lodgings |
| `/alojamientos` | `ListadoAlojamientos` | Lodging list with filters |
| `/alojamientos/:id` | `DetalleAlojamiento` | Detail, quote and booking of one lodging |
| `/mis-reservas` | `MisReservas` | Bookings made in the application |
| any other route | | Redirects to `/` |

## Data

The application has no backend. `public/data/marketplace-data.json` contains the lodgings and their reviews, and it is read only through `AlojamientoService`. The file includes an inactive lodging on purpose to check that it never reaches the interface. The bookings are saved in the browser under the `marketplace-reservas` key of `localStorage`.

## General Project Structure

```
src/app/
├── components/                  Reusable pieces
│   ├── navbar, footer           Navigation bar and page footer
│   ├── alojamiento-card         Lodging card used by the home and the list
│   ├── filtros-alojamientos     Filters panel (city, type, guests, maximum price)
│   ├── detalle-caracteristicas  Capacity, rooms, beds, bathrooms and price
│   ├── detalle-servicios-reglas Services and house rules
│   ├── resenas-alojamiento      Rating and reviews
│   ├── formulario-cotizacion    Dates and guests form of the quote
│   └── formulario-huesped       Guest name and email form (Reservar button)
├── pages/                       Screens loaded by a route
│   ├── inicio
│   ├── listado-alojamientos
│   ├── detalle-alojamiento
│   └── mis-reservas
├── services/                    Data access and business logic
│   ├── alojamiento.service            Reads the JSON, hides inactive lodgings, loading and error state
│   ├── filtro-alojamientos.service    Applies the search filters
│   ├── validacion-cotizacion.service  Validates dates and guests
│   ├── cotizacion.service             Calculates nights, subtotal, fees and total
│   ├── creacion-reserva.service       Builds and validates a booking before saving it
│   └── reserva.service                Stores the bookings in localStorage
├── models/                      TypeScript interfaces (alojamiento, resena, filtro-busqueda,
│                                estancia, cotizacion, huesped, reserva)
├── app.ts / app.html            Root component
├── app.config.ts                Application providers
└── app.routes.ts                Routes
public/
├── data/marketplace-data.json   Initial data of the application
└── assets/images/               Lodging photos and the Kuppo logo
docs/                            Project documentation
```

Pages use components and services. Components receive data through inputs and send events through outputs. All the data goes through services: no component reads the JSON file directly, and the bookings are only read and written by `ReservaService`.

## Documentation

* [Project conventions](docs/project-conventions.md): team agreements (language, naming, styles, Git workflow).
* [Requirements and business rules](docs/requirements.md): functional requirements, business rules and where each one is implemented.
* [Components and navigation](docs/components-and-navigation.md): identification of the components and structure of the navigation.

## Design prototypes (Figma)

https://www.figma.com/design/AXTL2B8ZQ4pfiNHUVvRUno/Prototypes?t=B39f3hhGm47gNkG8-1

The file has three pages: "Home & Listado", "Detalle & Cotización" and "Reserva & Mis reservas", each one in desktop and mobile versions, plus the color palette and typography standards.
