---

# 🧪 Examination Angular Project

This is an Angular 16 project designed to provide a comprehensive development experience. It includes Material Design for modern UI components, Bootstrap styling for responsive layouts, rich text editing for content creation, countdown timers for time-sensitive features, device detection for adaptive functionality, infinite scrolling for seamless user experience, and file saving for data management and export capabilities.

---

## 🚀 Project Setup

### 📦 Prerequisites

* [Node.js (v16+)](https://nodejs.org/)
* [Angular CLI (v16)](https://angular.io/cli)
* [npm (Package Manager)](https://www.npmjs.com/)

---

## 📂 Installation

```bash
npm install
```

---

## 🧪 Development Server

```bash
npm start
```

Runs the app in development mode. Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

> **Troubleshooting:** If automatic reload does not work, ensure that:
> * The Angular CLI is running without errors in the terminal.
> * The file changes are saved correctly.
> * Check the browser console for errors or warnings.
> * Restart the development server if necessary.

---

The build artifacts will be stored in the `dist/` directory, which contains the optimized and compiled files ready for deployment to a production environment.

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

---

## 👀 Watch Mode (Auto Build)

```bash
npm run watch
```

Builds the app in watch mode using the development configuration.

---

## 📦 Technologies & Libraries Used

* **Angular 16** (core framework)
* **Angular Material** – UI components
* **Bootstrap 5** – Styling
* **Moment.js**, **date-fns** – Date handling
* **Quill.js** via `ngx-quill` – Rich text editor
* **SweetAlert2** – Alerts
* **Prettier** – Code formatting
* **Karma + Jasmine** – Testing
* **ngx-bootstrap**, **ngx-toastr**, **ngx-mat-timepicker**, **ngx-infinite-scroll**
* **Agora RTC SDK** – Real-time communication
* **Grammarly Editor SDK**
* **xlsx** – Excel export
* **jquery**, **public-ip**, **rxjs**

---

## 📁 Folder Structure (Typical)

```
src/
 ┣ app/
 ┃ ┗ feature/
 ┃   ┣ components/      → UI components specific to the feature
 ┃   ┣ services/        → Services related to feature logic or API calls
 ┃   ┣ models/          → TypeScript interfaces or models used in the module
 ┃   ┣ requests/        → API request/response payloads or helper functions
 ┃   ┗ feature.module.ts
 ┣ assets/              → Static assets like images, icons, fonts
 ┣ environments/        → Environment configuration files
 ┗ index.html           → Entry point HTML file

```

---

## 📌 Notes

* This project uses [**Angular Split**](https://github.com/angular-split/angular-split) for responsive layouts.
* Timezone-aware features are powered by [**Moment.js**](https://momentjs.com/).
* File saving and export supported via [**ngx-filesaver**](https://github.com/cnunciato/ngx-filesaver) and [**xlsx**](https://github.com/SheetJS/sheetjs).
* Internet detection via [**ngx-device-detector**](https://github.com/KoderLabs/ngx-device-detector).
