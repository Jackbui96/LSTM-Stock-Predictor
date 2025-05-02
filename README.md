# LSTM Stock Predictor Frontend

![LSTM Stock Predictor Banner](https://via.placeholder.com/800x400?text=LSTM+Stock+Predictor)

A React-based web application that predicts stock prices using Long Short-Term Memory (LSTM) neural networks.

## 🚀 Features

- Interactive stock price prediction visualization
- Historical vs. predicted price comparisons
- Next-day price predictions
- Support for multiple stock symbols
- Responsive design for desktop and mobile devices

## 🛠️ Technology Stack

- **React** - Frontend library
- **Vite** - Build tool and development server
- **Axios** - HTTP client for API requests
- **MUI X Charts** - Data visualization
- **Lucide React** - Modern icon set
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lstm-stock-predictor.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📚 API Integration

The application connects to the LSTM Stock Predictor API at `https://api.a-pani.com/v1/stocks/` with the following endpoints:

- `GET /symbols` - Retrieves available stock symbols
- `GET /predict?symbol={SYMBOL}` - Gets prediction data for the selected stock symbol

## 📦 Project Structure

```
LSTM Stock Predictor/
├── node_modules/     # Dependencies
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   └── StockChart.jsx    # Main stock chart component
│   ├── App.jsx       # Root application component
│   ├── App.css       # Application styles
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # HTML template
├── package.json      # Project metadata and dependencies
└── vite.config.js    # Vite configuration
```

## 🔧 Configuration

To configure the API endpoint, modify the base URL in the `StockChart.jsx` component:

```javascript
const API_BASE_URL = "https://api.a-pani.com/v1/stocks";
```

## 📈 Usage

1. Select a stock symbol from the dropdown menu
2. Click "Generate Prediction" to fetch and display the prediction
3. View the chart showing historical prices and predictions
4. Check the next-day predicted price

## 📝 License

[MIT License](LICENSE)

## 🙏 Acknowledgements

- LSTM neural network implementation for stock prediction
- MUI X Charts for visualization components
- Tailwind CSS for the UI framework

## ⚠️ Disclaimer

This application is for educational purposes only. The predictions should not be used for financial decisions. Past performance does not guarantee future results.

---

Developed with ❤️ by Nguyen Bui
