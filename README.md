# ✈️ Ready for Departure - GMT-458 GeoGame

> **A global airport direction finding and geographic awareness game.**

This project was developed within the scope of the **GMT-458 Web GIS** course's "Assignment 2: GeoGame." [cite_start]It is a time-based web application designed to test players' sense of geographic direction and knowledge of global city locations using an airport departure scenario[cite: 1, 2, 4].

🔗 **Live Demo:** [Insert your GitHub Pages link here if available]

---

## 📋 Table of Contents
1. [About the Game & Rules](#-about-the-game--rules)
2. [Features](#-features)
3. [Technology Stack](#%EF%¸%8F-technology-stack)
4. [Development Process & Deviations from Design (Important)](#%EF%¸%8F-development-process--deviations-from-design-important)
5. [Installation & Execution](#-installation--execution)

---

## 🎮 About the Game & Rules

"Ready for Departure" places the player in the cockpit at a randomly selected international airport. The objective is to determine the correct departure heading (cardinal geographic direction) to reach a given target city within a limited time.

### Gameplay Steps:
1.  **Start:** Upon starting the game, the map focuses on the satellite imagery of a randomly selected major airport (e.g., Chicago O'Hare, Amsterdam Schiphol, Istanbul IGA).
2.  **Target Assignment:** A **TARGET CITY** appears in the top panel (e.g., "Target: Tokyo").
3.  **Direction Selection:** Eight yellow compass buttons representing cardinal and intercardinal directions (N, NE, E, SE, S, SW, W, NW) appear around the airport's center.
4.  **Decision Time:** You must estimate the most accurate geographic direction from your current airport to the target city and click the corresponding button.
5.  **Scoring:**
    * ✅ Correct or nearest direction selected: **+10 Points**
    * ❌ Incorrect direction selected: **-5 Points**
6.  **Time Limit:** The total game duration is **90 seconds**. The game ends when the time expires, and your total score is displayed.

---

## ✨ Features

* **Real Satellite Imagery:** Utilizes Esri World Imagery service for high-resolution and realistic airport views.
* **Dynamic Route Calculation:** The true geographic bearing between the departure airport and the target city is calculated instantly for each round using the **Turf.js** library.
* **Extensive Location Database:** Features a curated selection of major airports from different continents and over 30 target cities, ensuring a unique experience in every game.
* **Smart Scoring Algorithm:** The game incorporates a fair tolerance system that accepts not only the precise bearing but also the *closest available option* among the eight directions as correct.
* **Modern User Interface:** A stylish, aviation-themed, and responsive design enhanced with "Glassmorphism" effects and CSS animations.
* **Visual and Auditory Atmosphere:** Enriched experience with a background video and FontAwesome icons.

---

## 🛠️ Technology Stack

The project is developed using modern web standards with the following technologies:

| Technology | Description |
| :--- | :--- |
| **HTML5 / CSS3** | Used for the game's structure and modern, animated interface design. |
| **Vanilla JavaScript (ES6+)** | Handles the game loop, state management, timer, and all interaction logic. |
| **[Leaflet.js](https://leafletjs.com/)** | The core mapping library used to display the base map, manage zoom/pan controls, and add interactive layers (markers) to the map. |
| **[Turf.js](https://turfjs.org/)** | Used for geospatial analysis. It is crucial for calculating the true bearing between two coordinates and generating target points. |
| **Esri World Imagery** | The detailed satellite map service provided via Leaflet that forms the game's background. |

---

## ⚠️ Development Process & Deviations from Design (Important)

During the development process, significant differences arose between the initially intended design (refer to old README files or initial sketches) and the final product. These changes became necessary due to encountered technical challenges and time constraints.

### 1. Transition from Runway-Specific Arrows to a "Virtual Compass" Model

* **Initial Goal:** The original plan was to place arrow markers at the end of each physical runway at the airport, rotated precisely to match that runway's specific heading. The player would click directly on these runway arrows.
* **Challenges Encountered:**
    1.  **Data Complexity:** Manually finding and verifying the exact start coordinates and precise headings for every runway at every airport created an enormous time burden.
    2.  **Technical Implementation Difficulty:** Dynamically rotating standard markers (icons) on Leaflet to distinct angles for each runway and aligning them visually at the runway ends without distortion during map zooming proved to be much more technically complex than anticipated. Maintaining visual consistency became difficult.
* **Result and Reason for Deviation:** Due to **time constraints** and the priority of ensuring the game's core mechanic (finding the correct direction) functioned stably, the idea of runway-specific arrow placement was abandoned.
* **Current Solution:** Instead, eight "Virtual Compass" buttons representing standard cardinal and intercardinal directions (North, South, East, West, etc.) are placed around the airport's center. This method reduces technical complexity while still serving the game's purpose of "geographic direction finding."

### 2. Standardization of Directional Options

* The initial plan was to show only the runway directions physically present at that specific airport (e.g., showing only East and West if those were the only runways).
* However, with the transition to the "Virtual Compass" model mentioned above, it was decided to display standard 8 cardinal directions at every airport to improve game flow and clarity. The scoring algorithm was updated to find the closest option to the target among these 8 choices.

---

*This project was developed by [Mustafa Selim ISSI] for the GMT-458 course.*