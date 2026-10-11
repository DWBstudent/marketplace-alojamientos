# Components and Navigation

## Identification of the components

The statement asks for a clear separation of responsibilities. This is how the application is divided.

| Responsibility              | Elements                                                                                                                                                                                |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Presentation of information | `alojamiento-card`, `detalle-caracteristicas`, `detalle-servicios-reglas`, `resenas-alojamiento`, and the pages `inicio`, `listado-alojamientos`, `detalle-alojamiento`, `mis-reservas` |
| Navigation                  | `navbar`, `footer`, `app.routes.ts`                                                                                                                                                     |
| Data access                 | `AlojamientoService` (reads the JSON and hides inactive lodgings)                                                                                                                       |
| Forms                       | `filtros-alojamientos`, `formulario-cotizacion`, `formulario-huesped`                                                                                                                   |
| Business logic              | `FiltroAlojamientosService`, `ValidacionCotizacionService`, `CotizacionService`                                                                                                         |
| Booking management          | `CreacionReservaService`, `ReservaService` (localStorage), page `mis-reservas`                                                                                                          |
| Models                      | `Alojamiento`, `Resena`, `FiltroBusqueda`, `DatosEstancia`, `Cotizacion`, `DatosHuesped`, `Reserva`                                                                                     |

## Component tree

```
App
├── Navbar
├── <router-outlet>
│   ├── Inicio
│   │   └── AlojamientoCard (featured lodgings)
│   ├── ListadoAlojamientos
│   │   ├── FiltrosAlojamientos
│   │   └── AlojamientoCard (one per lodging)
│   ├── DetalleAlojamiento
│   │   ├── DetalleCaracteristicas
│   │   ├── DetalleServiciosReglas
│   │   ├── ResenasAlojamiento
│   │   ├── FormularioCotizacion
│   │   └── FormularioHuesped
│   └── MisReservas
└── Footer
```

## Navigation structure

| Route               | Page                  | How the user gets there                                                          |
|---------------------|-----------------------|----------------------------------------------------------------------------------|
| `/`                 | `Inicio`              | Logo, "Inicio" link, any unknown route                                           |
| `/alojamientos`     | `ListadoAlojamientos` | "Alojamientos" link, "Explorar alojamientos" button, "Volver a los alojamientos" |
| `/alojamientos/:id` | `DetalleAlojamiento`  | A lodging card (home or list)                                                    |
| `/mis-reservas`     | `MisReservas`         | "Mis reservas" link, and automatically after a booking is made                   |

## Main flow

```
Inicio → Alojamientos (filters) → Detalle → Quote → Guest data → Reserve → Mis reservas
```

1. The user opens the home page and goes to the list of lodgings.
2. The user filters the list and opens a lodging.
3. In the detail, the user enters the dates and the guests and gets the quote.
4. With a valid quote, the user enters name and email and reserves.
5. The application saves the booking and opens "Mis reservas".
