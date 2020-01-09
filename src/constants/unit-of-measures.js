export const unitOfMeasureNames = {
  UnitOfMeasureNoneId: " ",
  UnitOfMeasureMetersId: "m",
  UnitOfMeasureDegreesCelsiusId: `${String.fromCharCode(176)}C`,
  UnitOfMeasureRevolutionsPerMinuteId: "RPM",
  UnitOfMeasureKilometersPerLiterId: "km/L",
  UnitOfMeasureVoltsId: "V",
  UnitOfMeasureKilometersPerHourId: "km/h",
  UnitOfMeasureKiloWattHoursId: "kWh",
  UnitOfMeasureLitersPerTonneId: "L/t",
  UnitOfMeasureKilogramsPerKilometerId: "kg/km",
  UnitOfMeasureGramsPerSquareMeterId: "g/m²",
  UnitOfMeasureNewtonsId: "N",
  UnitOfMeasureNewtonMetersId: "N⋅m",
  UnitOfMeasureMetersPerSecondSquaredId: "m/s²",
  UnitOfMeasureGramsId: "g",
  UnitOfMeasureCubicMetersId: "m³",
  UnitOfMeasureLitersId: "L",
  UnitOfMeasureCubicMetersPerSecondId: "m³/s",
  UnitOfMeasureHertzId: "Hz",
  UnitOfMeasureSecondsId: "s",
  UnitOfMeasureAmpsId: "A",
  UnitOfMeasureWattsId: "W",
  UnitOfMeasureOhmsId: "Ω",
  UnitOfMeasurePascalsId: "Pa",
  UnitOfMeasureBytesId: "B",
  UnitOfMeasurePartsPerMillionId: "ppm",
  UnitOfMeasurePercentageId: "%",
  UnitOfMeasureRadiansId: "rad",
  UnitOfMeasurePulsesPerMeterId: "pulses/m",
  UnitOfMeasureOhmsPerSecondId: "Ω/s",
  UnitOfMeasureGramsPerSecondId: "g/s",
  UnitOfMeasureKilometersPerKilogramId: "km/kg",
};

export function cleanUnitOfMeasure(unitOfMeasure) {
  if (unitOfMeasureNames.hasOwnProperty(unitOfMeasure)) {
    return unitOfMeasureNames[unitOfMeasure];
  }
  return unitOfMeasure.slice(13, -2);
}
