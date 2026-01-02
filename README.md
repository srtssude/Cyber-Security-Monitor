# CyberSentinel Monitor - Grafana Panel Plugin
**Course:** MIS 233 - Fall 2025
**Developer:** Zeynep Sude Sarıtaş (2022502006)

## Overview
CyberSentinel is a hybrid Grafana panel plugin designed for real-time threat monitoring. It combines **internal Grafana metrics** with **external API data** to visualize system load, threat levels, and AI-driven anomaly detection.

## Installation & Build Instructions

1.  **Prerequisites:** Ensure `Node.js` is installed.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Build the Plugin:**
    ```bash
    npm run build
    ```
4.  **Run in Development Mode:**
    ```bash
    npm run dev
    ``
5.  **Restart Grafana:** The plugin should now be visible in your visualization list.

---

##  Bonus & Justification

I have implemented bonus features below. Here is the breakdown:

### 1. Hybrid Data Handling (Panel + Data Source Logic)
* **Grafana Data:** Renders real-time data from Grafana queries (Random Walk) for the main gauge.
* **External API Integration:** Fetches data from an external REST API (JSONPlaceholder/Mock) to simulate "Threat IDs" and "Network Traffic" without needing a separate Data Source plugin.
* **Time-Series Visualization:** Converts the external API data into a dynamic, moving bar chart at the bottom of the panel.

### 2. Client-Side AI Analysis
* **Anomaly Detection:** Implemented a JavaScript-based AI algorithm that calculates the Moving Average of the last 5 data points.
* **Visual Feedback:** If the deviation exceeds the dynamic "AI Sensitivity" threshold, the status bar changes color (Green -> Orange) and warns of an "Anomaly".
* **Confidence Score:** Generates a real-time confidence score for the analysis.

### 3. Advanced Configuration Options
* **Dynamic Styling:** Users can adjust `Critical Threshold`, `Font Sizes`, and `AI Sensitivity` via the panel options.
* **Interactive Inputs:** Uses Sliders and Switches for a better UX.
* **Critical Alerts:** Implemented a "Blinking" animation when the threshold is breached.

### 4. Interactive UI/UX
* **User Controls:** Added `LOCK` (pauses data fetching) and `RESET` (clears history) buttons directly on the panel.
* **Responsive Design:** The panel title and layout adapt automatically when resized (e.g., title shortens on small screens).
* **Session Stats:** Tracks and displays Min/Max values for the current active session.

---

## Features Showcase
* **Real-time Thread ID:** Displays formatted `ID | Level` from external API.
* **Cyberpunk Theme:** Custom CSS with neon colors and dark mode optimization.
* **Data Persistence:** Uses React `useState` and `useEffect` to manage local history and locking mechanisms.