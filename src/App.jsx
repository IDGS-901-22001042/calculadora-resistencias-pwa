// src/App.jsx
import { useState, useMemo } from "react"; // <-- MODIFICADO
import PropTypes from "prop-types"; // <-- AÑADIDO
import "./App.css";
import tablaValores from "/tablaValores.png";

const colorData = {
  negro: { value: 0, multiplier: 1, tolerance: null, colorCode: "#000000" },
  marron: { value: 1, multiplier: 10, tolerance: "±1%", colorCode: "#8B4513" },
  rojo: { value: 2, multiplier: 100, tolerance: "±2%", colorCode: "#FF0000" },
  naranja: {
    value: 3,
    multiplier: 1000,
    tolerance: null,
    colorCode: "#FFA500",
  },
  amarillo: {
    value: 4,
    multiplier: 10000,
    tolerance: null,
    colorCode: "#FFFF00",
  },
  verde: {
    value: 5,
    multiplier: 100000,
    tolerance: "±0.5%",
    colorCode: "#008000",
  },
  azul: {
    value: 6,
    multiplier: 1000000,
    tolerance: "±0.25%",
    colorCode: "#0000FF",
  },
  violeta: {
    value: 7,
    multiplier: 10000000,
    tolerance: "±0.1%",
    colorCode: "#8A2BE2",
  },
  gris: {
    value: 8,
    multiplier: 100000000,
    tolerance: "±0.05%",
    colorCode: "#808080",
  },
  blanco: {
    value: 9,
    multiplier: 1000000000,
    tolerance: null,
    colorCode: "#FFFFFF",
  },
  oro: { value: null, multiplier: 0.1, tolerance: "±5%", colorCode: "#FFD700" },
  plata: {
    value: null,
    multiplier: 0.01,
    tolerance: "±10%",
    colorCode: "#C0C0C0",
  },
};

const band1Colors = [
  "marron",
  "rojo",
  "naranja",
  "amarillo",
  "verde",
  "azul",
  "violeta",
  "gris",
  "blanco",
];
const band2Colors = ["negro", ...band1Colors];
const multiplierColors = [
  "negro",
  "marron",
  "rojo",
  "naranja",
  "amarillo",
  "verde",
  "azul",
  "violeta",
  "oro",
  "plata",
];
const toleranceColors = [
  "marron",
  "rojo",
  "verde",
  "azul",
  "violeta",
  "gris",
  "oro",
  "plata",
];

function App() {
  const [band1, setBand1] = useState("amarillo");
  const [band2, setBand2] = useState("rojo");
  const [multiplier, setMultiplier] = useState("amarillo");
  const [tolerance, setTolerance] = useState("marron");

  // ... (la función useMemo se queda igual) ...
  const { resistanceValue, toleranceValue, colors } = useMemo(() => {
    const band1Obj = colorData[band1];
    const band2Obj = colorData[band2];
    const multiplierObj = colorData[multiplier];
    const toleranceObj = colorData[tolerance];

    if (!band1Obj || !band2Obj || !multiplierObj || !toleranceObj)
      return { resistanceValue: "Error", toleranceValue: "", colors: {} };

    const rawValue =
      (band1Obj.value * 10 + band2Obj.value) * multiplierObj.multiplier;

    let displayValue;
    if (rawValue >= 1_000_000_000) {
      displayValue = `${rawValue / 1_000_000_000} GΩ`;
    } else if (rawValue >= 1_000_000) {
      displayValue = `${rawValue / 1_000_000} MΩ`;
    } else if (rawValue >= 1_000) {
      displayValue = `${rawValue / 1_000} kΩ`;
    } else {
      displayValue = `${rawValue} Ω`;
    }

    return {
      resistanceValue: displayValue,
      toleranceValue: toleranceObj.tolerance,
      colors: {
        band1: band1Obj.colorCode,
        band2: band2Obj.colorCode,
        multiplier: multiplierObj.colorCode,
        tolerance: toleranceObj.colorCode,
      },
    };
  }, [band1, band2, multiplier, tolerance]);

  const ColorSelector = ({ label, value, onChange, options }) => (
    <div className="selector-group">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((color) => (
          <option
            key={color}
            value={color}
            style={{
              backgroundColor: colorData[color].colorCode,
              color: ["amarillo", "blanco", "plata"].includes(color)
                ? "#333"
                : "#fff",
            }}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  // --- AÑADIDO: Bloque de PropTypes para ColorSelector ---
  ColorSelector.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  // --- FIN DEL BLOQUE AÑADIDO ---

  return (
    <div className="App">
      {/* ... (el resto del JSX se queda exactamente igual) ... */}
      <header>
        <h1>Calculadora de Resistencias de 4 Bandas</h1>
      </header>

      <main className="calculator-container">
        <div className="controls">
          <ColorSelector
            label="1ª Banda"
            value={band1}
            onChange={setBand1}
            options={band1Colors}
          />
          <ColorSelector
            label="2ª Banda"
            value={band2}
            onChange={setBand2}
            options={band2Colors}
          />
          <ColorSelector
            label="Multiplicador"
            value={multiplier}
            onChange={setMultiplier}
            options={multiplierColors}
          />
          <ColorSelector
            label="Tolerancia"
            value={tolerance}
            onChange={setTolerance}
            options={toleranceColors}
          />
        </div>

        <div className="results">
          <div className="resistor-visual">
            <div className="resistor-body">
              <div
                className="band"
                style={{ backgroundColor: colors.band1 }}
              ></div>
              <div
                className="band"
                style={{ backgroundColor: colors.band2 }}
              ></div>
              <div
                className="band multiplier"
                style={{ backgroundColor: colors.multiplier }}
              ></div>
              <div
                className="band tolerance"
                style={{ backgroundColor: colors.tolerance }}
              ></div>
            </div>
          </div>
          <div className="result-text">
            <h2>Valor de la Resistencia:</h2>
            <p className="final-value">
              {resistanceValue} {toleranceValue}
            </p>
          </div>
        </div>
      </main>

      <section className="info-section">
        <h2>Código de Colores</h2>
        <img
          src={tablaValores}
          alt="Tabla de valores de resistencias"
          className="color-chart-img"
        />
      </section>
    </div>
  );
}

export default App;
