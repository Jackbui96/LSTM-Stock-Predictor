import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { LineChart } from '@mui/x-charts/LineChart';

export default function StockChart() {
    const [symbols, setSymbols] = useState([]);
    const [selected, setSelected] = useState("MSFT");
    const [data, setData] = useState(null);
    const [nextDay, setNextDay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch available stock symbols
        setLoading(true);
        axios.get("https://api.a-pani.com/v1/stocks/symbols")
            .then(res => {
                console.log(res.data)
                setSymbols(res.data.symbols);
                setLoading(false);
            })
            .catch(err => {
                console.log(err)
                setError("Failed to load stock symbols");
                setLoading(false);
            });
    }, []);

    const fetchPrediction = () => {
        setLoading(true);
        setData(null);
        setError(null);

        axios.get(`https://api.a-pani.com/v1/stocks/predict?symbol=${ selected }`)
            .then(res => {
                console.log(res.data)
                setData(res.data);
                setNextDay(res.data.next_day);
                setLoading(false);
            })
            .catch(err => {
                setError(`Failed to fetch prediction for ${ selected }`);
                setLoading(false);
            });
    };

    // Calculate percentage difference between last actual and predicted value
    const getPredictionDifference = () => {
        if (!data || !data.predictions || data.predictions.length === 0) return null;

        const last = data.predictions[data.predictions.length - 1];
        if (!last.actualPrice || !last.predictedPrice) return null;

        const diff = ((last.predictedPrice - last.actualPrice) / last.actualPrice) * 100;
        return diff.toFixed(2);
    };

    // Prepare data for MUI X Charts
    const prepareChartData = () => {
        if (!data || !data.predictions) return null;

        const timestamps = [];
        const actual = [];
        const predicted = [];

        data.predictions.forEach((entry) => {
            timestamps.push(entry.date);
            actual.push(entry.actualPrice);
            predicted.push(entry.predictedPrice);
        });

        return {
            timestamps,
            actual,
            predicted
        };
    };

    const chartData = data ? prepareChartData() : null;
    const difference = data ? getPredictionDifference() : null;

    return (
        <div className="w-screen min-h-screen bg-gray-50 flex justify-center items-start p-6">
            <div className="container mx-auto">
                <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */ }
                    <div className="p-6 pb-0">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="flex items-center mb-2">
                                <TrendingUp className="h-6 w-6 text-indigo-600 mr-2"/>
                                <h1 className="text-3xl font-bold text-gray-800">LSTM Stock Predictor</h1>
                            </div>
                            <p className="text-sm text-gray-500">
                                Predicting stock prices using Long Short-Term Memory neural networks
                            </p>
                        </div>

                        {/* Controls */ }
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                            <div className="w-full sm:w-64">
                                <label htmlFor="stock-select"
                                       className="block text-sm font-medium text-gray-700 mb-1 text-center sm:text-left">
                                    Select Stock Symbol
                                </label>
                                <select
                                    id="stock-select"
                                    value={ selected }
                                    onChange={ e => setSelected(e.target.value) }
                                    className="block w-full py-2 px-3 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    disabled={ loading || symbols.length === 0 }
                                >
                                    { symbols.map(sym => (
                                        <option key={ sym } value={ sym }>
                                            { sym }
                                        </option>
                                    )) }
                                </select>
                            </div>
                            <button
                                onClick={ fetchPrediction }
                                disabled={ loading || symbols.length === 0 || !selected }
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed sm:mt-6"
                            >
                                { loading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="h-4 w-4 mr-2"/>
                                        Generate Prediction
                                    </>
                                ) }
                            </button>
                        </div>

                        {/* Error message */ }
                        { error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 mx-auto max-w-3xl">
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-red-400 mr-2"/>
                                    <p className="text-sm text-red-700">{ error }</p>
                                </div>
                            </div>
                        ) }
                    </div>

                    {/* Chart */ }
                    { data && chartData && (
                        <div className="px-6 pb-4">
                            <div className="flex flex-col items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">{ selected } Stock
                                    Prediction</h2>
                                { difference && (
                                    <div className={ `px-3 py-1 rounded-full text-sm font-medium ${
                                        parseFloat(difference) >= 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }` }>
                                        { parseFloat(difference) >= 0 ? '↑' : '↓' } { Math.abs(parseFloat(difference)) }%
                                        predicted change
                                    </div>
                                ) }
                                { nextDay && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        📅 Predicted closing price for tomorrow:
                                        <span className="font-semibold text-indigo-700 ml-1">
                                            ${ nextDay.toFixed(2) }
                                        </span>
                                    </p>
                                ) }
                            </div>
                            <div style={ {width: '100%', height: '400px'} }>
                                <LineChart
                                    series={ [
                                        {
                                            data: chartData.actual,
                                            label: 'Historical Data',
                                            color: 'rgb(59, 130, 246)',
                                            showMark: false,
                                            area: true,
                                            curve: 'linear',
                                        },
                                        {
                                            data: chartData.predicted,
                                            label: 'Prediction',
                                            color: 'rgb(220, 38, 38)',
                                            showMark: false,
                                            curve: 'linear',
                                            lineStyle: {strokeDasharray: '5 5'},
                                        },
                                    ] }
                                    xAxis={ [
                                        {
                                            data: chartData.timestamps,
                                            scaleType: 'point',
                                            valueFormatter: (value) => value,
                                        }
                                    ] }
                                    height={ 400 }
                                    margin={ {top: 20, right: 20, bottom: 40, left: 40} }
                                    slotProps={ {
                                        legend: {
                                            position: {vertical: 'top', horizontal: 'center'},
                                            padding: 20,
                                            itemMarkWidth: 10,
                                            itemMarkHeight: 2,
                                            markGap: 5,
                                            itemGap: 20,
                                        },
                                    } }
                                    tooltip={ {trigger: 'item'} }
                                    sx={ {
                                        '.MuiLineElement-root': {
                                            strokeWidth: 2,
                                        },
                                        '.MuiMarkElement-root': {
                                            stroke: 'none',
                                        },
                                        '.MuiChartsAxis-tickLabel': {
                                            fontSize: '0.75rem',
                                        },
                                        '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                                            transform: 'rotate(-45deg)',
                                            textAnchor: 'end',
                                        },
                                    } }
                                />
                            </div>
                            <div className="mt-4 text-xs text-gray-500 text-center">
                                Data shown for illustration purposes. Past performance does not guarantee future
                                results.
                            </div>
                        </div>
                    ) }

                    {/* Empty state */ }
                    { !data && !loading && !error && (
                        <div className="p-12 text-center mx-auto">
                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No prediction data</h3>
                            <p className="text-gray-500 mb-4">Select a stock symbol and generate a prediction to see the
                                chart</p>
                        </div>
                    ) }

                    {/* Footer */ }
                    <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
                        Built with React, MUI X Charts and LSTM neural networks • Not financial advice
                    </div>
                </div>
            </div>
        </div>
    );
}
