# Requirements and Business Rules

Requirements of the course project statement (sections 3 and 4) and where each one is implemented.

## Functional requirements

| Id    | Requirement                                                                                                                                       | Section | Implemented in                                                                                            |
|-------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------------------------------------------------------------------------------------------------------|
| RF-01 | Home page with the platform name, a short description, featured lodgings and access to the search                                                 | 3       | `pages/inicio`, `AlojamientoService.getDestacados`                                                        |
| RF-02 | List of the available lodgings with image, name, city, type, capacity, price per night, rating and services                                       | 3.1     | `pages/listado-alojamientos`, `components/alojamiento-card`                                               |
| RF-03 | Filters by city, guests, type and maximum price that update the list dynamically, and an option to clear them                                     | 3.2     | `components/filtros-alojamientos`, `FiltroAlojamientosService`                                            |
| RF-04 | Lodging detail with name, description, city, location, type, capacity, rooms, beds, bathrooms, price, services, rules, rating, reviews and images | 3.3     | `pages/detalle-alojamiento`, `detalle-caracteristicas`, `detalle-servicios-reglas`, `resenas-alojamiento` |
| RF-05 | Quote from the detail page: arrival, departure and guests, showing nights, subtotal, cleaning fee, service fee and total                          | 3.4     | `formulario-cotizacion`, `ValidacionCotizacionService`, `CotizacionService`                               |
| RF-06 | Simulated booking after a valid quote, asking for guest name and email, with the state `CONFIRMADA`                                               | 3.5     | `formulario-huesped`, `CreacionReservaService`, `ReservaService`                                          |
| RF-07 | "Mis reservas" with lodging, city, dates, guests, total and state, and a message when there are no bookings                                       | 3.6     | `pages/mis-reservas`, `ReservaService`                                                                    |
| RF-08 | Navigation between the pages with the Angular router                                                                                              | 3.3     | `app.routes.ts`, `components/navbar`                                                                      |
| RF-09 | Data in a JSON file read through an Angular service                                                                                               | 5       | `public/data/marketplace-data.json`, `AlojamientoService`                                                 |

## Business rules

| Id    | Rule                                                           | Implemented in                                             | Tests                                                                       |
|-------|----------------------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------------|
| RN-01 | The departure date must be later than the arrival date         | `ValidacionCotizacionService`, `CotizacionService`         | `validacion-cotizacion.service.spec.ts`, `cotizacion.service.spec.ts`       |
| RN-02 | The arrival date cannot be before today                        | `ValidacionCotizacionService`                              | `validacion-cotizacion.service.spec.ts`                                     |
| RN-03 | The number of guests must be greater than zero                 | `ValidacionCotizacionService`, `CreacionReservaService`    | `validacion-cotizacion.service.spec.ts`, `creacion-reserva.service.spec.ts` |
| RN-04 | The number of guests cannot exceed the capacity of the lodging | `ValidacionCotizacionService`, `CreacionReservaService`    | `validacion-cotizacion.service.spec.ts`, `creacion-reserva.service.spec.ts` |
| RN-05 | The price per night must be greater than zero                  | `CotizacionService.cotizar`                                | `cotizacion.service.spec.ts`                                                |
| RN-06 | A quote is only generated when the dates are valid             | `ValidacionCotizacionService`, `CotizacionService.cotizar` | `cotizacion.service.spec.ts`                                                |
| RN-07 | A booking is only made after a valid quote                     | `CreacionReservaService.reservar`, `formulario-huesped`    | `creacion-reserva.service.spec.ts`                                          |
| RN-08 | The service fee is 10 % of the subtotal                        | `CotizacionService.calcular`                               | `cotizacion.service.spec.ts`                                                |
| RN-09 | Inactive lodgings are never shown                              | `AlojamientoService`                                       | `alojamiento.service.spec.ts`                                               |
| RN-10 | When a search finds no results, the user is told               | `pages/listado-alojamientos`                               | `listado-alojamientos.spec.ts`                                              |

## Calculation of the quote

- nights = days between the departure and the arrival (the dates `YYYY-MM-DD` are read as UTC)
- subtotal = nights × price per night
- cleaning fee = the one defined by the lodging
- service fee = 10 % of the subtotal, rounded to whole pesos
- total = subtotal + cleaning fee + service fee
