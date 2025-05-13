# Depressed Student Visualization

This is an [Observable Framework](https://observablehq.com/framework/) app for visualizing and predicting depression risk among students based on lifestyle and survey data.

## Live Demo

The app is publicly available at:  
**[https://dwr2118.github.io/dataviz-final/](https://dwr2118.github.io/dataviz-final/)**

> **Note:** The backend ML predictor server is hosted on [Render](https://render.com/). The first prediction request after a period of inactivity may take up to 10 seconds as the server "wakes up." Please be patient if your prediction takes a few moments to appear.

---

## Local Development

To install the required dependencies, run:

```sh
npm install
```

To start the local preview server, run:

```sh
npm run dev
```

Then visit <http://localhost:3000> to preview the main page on the app.

---

## Backend (ML Predictor)

The backend Flask server (ML predictor) is hosted on Render and is automatically called by the frontend when you request a prediction.  
If you want to run the backend locally for development:

1. Navigate to the `viz/server` directory.
2. Install Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Start the server:
   ```sh
   gunicorn server:app
   ```
   or for local testing:
   ```sh
   python server.py
   ```
4. Update the frontend fetch URL to `http://localhost:3005/save-profile` for local testing.

---

## Project structure

A typical Framework project looks like this:

```ini
.
├─ viz/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ data/
│  │  └─ index.md                 # the home page
│  ├─ server/                     # backend ML predictor
│  │  ├─ server.py
│  │  ├─ ml_model.py
│  │  └─ requirements.txt
│  ├─ observablehq.config.js      # the app config file
│  ├─ package.json
│  └─ ...
├─ .github/workflows/deploy.yml   # GitHub Pages deployment workflow
└─ README.md
```

- **`viz/src`** — Source root for Observable pages and components.
- **`viz/server`** — Backend Flask server for ML predictions.
- **`observablehq.config.js`** — App configuration.
- **`.github/workflows/deploy.yml`** — GitHub Actions workflow for automatic deployment to GitHub Pages.

---

## Command reference

| Command                | Description                                              |
|------------------------|---------------------------------------------------------|
| `npm install`          | Install or reinstall dependencies                       |
| `npm run dev`          | Start local preview server                              |
| `npm run build`        | Build your static site, generating `./dist`             |
| `npm run deploy`       | Deploy your app to Observable                           |
| `npm run clean`        | Clear the local data loader cache                       |
| `npm run observable`   | Run commands like `observable help`                     |

---
