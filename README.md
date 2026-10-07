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

The application is a frontend only: there is no backend, and the data comes from a JSON file.

* Navigation bar with a mobile menu, and footer
* Home page with the slogan, a short description and access to the search
* Data service that reads the active lodgings from the JSON file, with loading and error states
* Lodging card with photo, city, type, capacity, services, price and rating
* Featured lodgings on the home page
* Lodging list with filters: city and type are done, guests and maximum price are pending
* Lodging detail with photos, services, rules and reviews
* Quotation (nights, subtotal, cleaning fee, service fee and total)
* Simulated reservation and the "Mis reservas" page

## General Project Structure

src/app/
├── components/   Reusable pieces (navbar, footer, ...)
├── pages/        Screens loaded by a route (inicio, listado-alojamientos, detalle-alojamiento, mis-reservas)
├── services/     Data access and business logic (alojamiento, reserva, ...)
└── models/       TypeScript interfaces (alojamiento, resena, reserva, filtro-busqueda)
public/
├── data/         marketplace-data.json, the initial data of the application
└── assets/images/  Lodging photos and the Kuppo logo
docs/             Conventions, requirements and prototypes

The user interface never reads the JSON file directly: all the data goes through AlojamientoService. The team agreements are described in docs/project-conventions.md.
## Design prototypes (Figma)

https://www.figma.com/design/AXTL2B8ZQ4pfiNHUVvRUno/Prototypes?t=B39f3hhGm47gNkG8-1

