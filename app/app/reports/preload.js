// preload some external node modules for the project reporting measure
// note that the native
console.info("Loaded preload.js");

// note that adding var before these like normal
// doesn't work.
console.log("Preloading node libraries.");
fs = require('fs');
path = require('path');
_ = require("lodash");
js2xmlparser = require("js2xmlparser");
angular = require("angular");

//jetpack = require("jetpack"); // TODO Not sure why jetpack won't load

// TODO read the results from disk and pass
// to the project reporting measure
console.log("Preloading simulation results.");
results = [
  {
    "name": "Baseline",
    "description": "Baseline's description",
    "weather_file": "srrl_2013_amy.epw",
    "seed_file": "seb.osm",
    "steps": [
      {
        "measure_dir_name": "SetEplusInfiltration",
        "arguments": {
          "flowPerZoneFloorArea": 10.76
        },
        "result": {
          "started_at": "2016-08-30 18:30:20 UTC",
          "step_result": "Success",
          "completed_at": "2016-08-30 18:30:20 UTC",
          "step_errors": [

          ],
          "step_warnings": [

          ],
          "step_info": [
            "Setting flow per zone floor area of Utility Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Entry way Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Small office Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Open area Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Space Type 1 Leaky Bldg Infiltration to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/ExteriorArea."
          ],
          "initial_condition": "The building has 5 infiltrationObject objects. None of the infiltrationObjects started as Flow/Area.",
          "final_condition": "The building finished with flow per zone floor area values ranging from 10.76 to 10.76.",
          "step_values": [
            {
              "name": "flowPerZoneFloorArea",
              "value": 10.76,
              "type": "Double"
            }
          ]
        }
      },
      {
        "measure_dir_name": "DencityReports",
        "arguments": {
          "output_format": "CSV"
        },
        "result": {
          "started_at": "2016-08-30 18:30:33 UTC",
          "step_result": "Success",
          "completed_at": "2016-08-30 18:30:34 UTC",
          "step_errors": [

          ],
          "step_warnings": [

          ],
          "step_info": [
            "Model loaded",
            "Sql loaded",
            "Saving Dencity metadata csv file",
            "Saved Dencity metadata as report_metadata.csv",
            "The following meters were found: []",
            "Units were found for all available meters",
            "The following meter units were found: []",
            "get_timeseries_flag is set to true",
            "Retrieving timeseries data",
            "DeltaMake=0s",
            "Saved timeseries data as report_timeseries.csv",
            "DeltaWrite=0s",
            "Total Timeseries Time: 0"
          ],
          "final_condition": "DEnCity Report generated successfully.",
          "step_values": [
            {
              "name": "annual_consumption_district_cooling",
              "value": 0
            },
            {
              "name": "annual_consumption_district_heating",
              "value": 0
            },
            {
              "name": "annual_consumption_electricity",
              "value": 903.78
            },
            {
              "name": "annual_consumption_gas",
              "value": 0
            },
            {
              "name": "annual_consumption_other_energy",
              "value": 0
            },
            {
              "name": "annual_consumption_water",
              "value": 0
            },
            {
              "name": "annual_demand_district_cooling_peak_demand",
              "value": 0
            },
            {
              "name": "annual_demand_electricity_annual_avg_peak_demand",
              "value": 28.658675799086758
            },
            {
              "name": "annual_demand_electricity_peak_demand",
              "value": 60.684144786178685
            },
            {
              "name": "annual_utility_cost_district_cooling",
              "value": 0
            },
            {
              "name": "annual_utility_cost_district_heating",
              "value": 0
            },
            {
              "name": "annual_utility_cost_electricity",
              "value": 0
            },
            {
              "name": "annual_utility_cost_electricity_consumption_charge",
              "value": 0
            },
            {
              "name": "annual_utility_cost_electricity_demand_charge",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_cooling",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_equipment_exterior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_equipment_interior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_fans",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_generators",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_heat_recovery",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_heat_rejection",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_heating",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_humidification",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_lighting_exterior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_lighting_interior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_pumps",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_refrigeration",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_water_systems",
              "value": 0
            },
            {
              "name": "annual_utility_cost_gas",
              "value": 0
            },
            {
              "name": "annual_utility_cost_other_energy",
              "value": 0
            },
            {
              "name": "annual_utility_cost_total",
              "value": 0
            },
            {
              "name": "annual_utility_cost_water",
              "value": 0
            },
            {
              "name": "cash_flows_capital_type",
              "value": "Constant Dollar Capital Costs"
            },
            {
              "name": "cash_flows_capital_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_energy_type",
              "value": "Constant Dollar Energy Costs"
            },
            {
              "name": "cash_flows_energy_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_operating_type",
              "value": "Constant Dollar Operating Costs"
            },
            {
              "name": "cash_flows_operating_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_total_type",
              "value": "Constant Dollar Total Costs"
            },
            {
              "name": "cash_flows_total_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_water_type",
              "value": "Constant Dollar Water Costs"
            },
            {
              "name": "cash_flows_water_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_9",
              "value": 0
            },
            {
              "name": "charsfloor_area",
              "value": 1858.06
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_1",
              "value": 2.0996
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_10",
              "value": 6.58033
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_11",
              "value": 3.53254
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_12",
              "value": 1.0863
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_2",
              "value": 1.55109
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_3",
              "value": 5.26752
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_4",
              "value": 7.06001
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_5",
              "value": 11.142900000000001
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_6",
              "value": 19.5318
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_7",
              "value": 23.643700000000003
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_8",
              "value": 25.5849
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_9",
              "value": 16.1264
            },
            {
              "name": "monthly_consumption_cooling_electricity_year",
              "value": 123.20709000000001
            },
            {
              "name": "monthly_consumption_cooling_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_1",
              "value": 15.590900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_10",
              "value": 15.590900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_11",
              "value": 15.311000000000002
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_12",
              "value": 15.347900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_2",
              "value": 14.1446
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_3",
              "value": 15.894200000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_4",
              "value": 14.764700000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_5",
              "value": 15.894200000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_6",
              "value": 15.311000000000002
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_7",
              "value": 15.347900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_8",
              "value": 15.894200000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_9",
              "value": 15.068000000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_year",
              "value": 184.15950000000004
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_electricity_month_1",
              "value": 11.731300000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_10",
              "value": 10.4701
            },
            {
              "name": "monthly_consumption_fans_electricity_month_11",
              "value": 10.870000000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_12",
              "value": 12.249
            },
            {
              "name": "monthly_consumption_fans_electricity_month_2",
              "value": 10.797
            },
            {
              "name": "monthly_consumption_fans_electricity_month_3",
              "value": 10.707500000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_4",
              "value": 9.76317
            },
            {
              "name": "monthly_consumption_fans_electricity_month_5",
              "value": 9.25397
            },
            {
              "name": "monthly_consumption_fans_electricity_month_6",
              "value": 7.81892
            },
            {
              "name": "monthly_consumption_fans_electricity_month_7",
              "value": 8.33892
            },
            {
              "name": "monthly_consumption_fans_electricity_month_8",
              "value": 8.042100000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_9",
              "value": 8.58829
            },
            {
              "name": "monthly_consumption_fans_electricity_year",
              "value": 118.63027000000001
            },
            {
              "name": "monthly_consumption_fans_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_electricity_month_1",
              "value": 46.6704
            },
            {
              "name": "monthly_consumption_heating_electricity_month_10",
              "value": 15.755700000000001
            },
            {
              "name": "monthly_consumption_heating_electricity_month_11",
              "value": 37.857
            },
            {
              "name": "monthly_consumption_heating_electricity_month_12",
              "value": 49.929500000000004
            },
            {
              "name": "monthly_consumption_heating_electricity_month_2",
              "value": 51.0604
            },
            {
              "name": "monthly_consumption_heating_electricity_month_3",
              "value": 37.4129
            },
            {
              "name": "monthly_consumption_heating_electricity_month_4",
              "value": 17.0774
            },
            {
              "name": "monthly_consumption_heating_electricity_month_5",
              "value": 8.82815
            },
            {
              "name": "monthly_consumption_heating_electricity_month_6",
              "value": 0.896969
            },
            {
              "name": "monthly_consumption_heating_electricity_month_7",
              "value": 0.40303100000000003
            },
            {
              "name": "monthly_consumption_heating_electricity_month_8",
              "value": 0.273025
            },
            {
              "name": "monthly_consumption_heating_electricity_month_9",
              "value": 2.6295300000000004
            },
            {
              "name": "monthly_consumption_heating_electricity_year",
              "value": 268.79400499999997
            },
            {
              "name": "monthly_consumption_heating_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_1",
              "value": 17.6126
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_10",
              "value": 17.6126
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_11",
              "value": 17.5349
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_12",
              "value": 17.159000000000002
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_2",
              "value": 16.0704
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_3",
              "value": 18.267100000000003
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_4",
              "value": 16.4268
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_5",
              "value": 18.267100000000003
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_6",
              "value": 17.5349
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_7",
              "value": 17.159000000000002
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_8",
              "value": 18.267100000000003
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_9",
              "value": 17.081300000000002
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_year",
              "value": 208.9928
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_6",
              "value": 26.540830000000003
            },
            {
              "name": "monthly_demand_cooling_electricity_month_7",
              "value": 31.985419999999998
            },
            {
              "name": "monthly_demand_cooling_electricity_month_8",
              "value": 29.425610000000002
            },
            {
              "name": "monthly_demand_cooling_electricity_month_9",
              "value": 28.50479
            },
            {
              "name": "monthly_demand_cooling_electricity_year",
              "value": 31.985419999999998
            },
            {
              "name": "monthly_demand_cooling_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_1",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_10",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_11",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_12",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_2",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_3",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_4",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_5",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_6",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_7",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_8",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_9",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_year",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_electricity_month_1",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_10",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_11",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_12",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_2",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_3",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_4",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_5",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_6",
              "value": 2.0521700000000003
            },
            {
              "name": "monthly_demand_fans_electricity_month_7",
              "value": 2.7787100000000002
            },
            {
              "name": "monthly_demand_fans_electricity_month_8",
              "value": 2.62907
            },
            {
              "name": "monthly_demand_fans_electricity_month_9",
              "value": 2.59368
            },
            {
              "name": "monthly_demand_fans_electricity_year",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_1",
              "value": 135.33532
            },
            {
              "name": "monthly_demand_heating_electricity_month_10",
              "value": 61.48545
            },
            {
              "name": "monthly_demand_heating_electricity_month_11",
              "value": 108.52622000000001
            },
            {
              "name": "monthly_demand_heating_electricity_month_12",
              "value": 159.07201999999998
            },
            {
              "name": "monthly_demand_heating_electricity_month_2",
              "value": 137.83596
            },
            {
              "name": "monthly_demand_heating_electricity_month_3",
              "value": 122.83963000000001
            },
            {
              "name": "monthly_demand_heating_electricity_month_4",
              "value": 95.22537
            },
            {
              "name": "monthly_demand_heating_electricity_month_5",
              "value": 75.2703
            },
            {
              "name": "monthly_demand_heating_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_year",
              "value": 159.07201999999998
            },
            {
              "name": "monthly_demand_heating_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_1",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_10",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_11",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_12",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_2",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_3",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_4",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_5",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_6",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_7",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_8",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_9",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_year",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_year",
              "value": 0
            },
            {
              "name": "source",
              "value": "XcelEDAReportingandQAQC"
            },
            {
              "name": "test_reg_value",
              "value": 9989
            }
          ]
        }
      }
    ],
    "started_at": "2016-08-30 18:30:09 UTC",
    "completed_status": "Success",
    "completed_at": "2016-08-30 18:30:36 UTC"
  },
  {
    "name": "First Design Alternative",
    "description": "First alternative's description",
    "weather_file": "srrl_2013_amy.epw",
    "seed_file": "seb.osm",
    "steps": [
      {
        "name": "Increase Wall R-Value",
        "taxonomy": "Envelope.Opaque",
        "measure_id":"111111111",
        "version_id":"333333333",
        "description": "Blah Blah increase the R-Value of the walls",
        "modeler_description": "Details blah blah",
        "measure_dir_name": "IncreaseWallRValue",
        "arguments": {
        },
        "result": {
          "started_at": "2016-08-30 18:30:15 UTC",
          "step_result": "Success",
          "completed_at": "2016-08-30 18:30:15 UTC",
          "step_errors": [

          ],
          "step_warnings": [

          ],
          "step_info": [
            "For construction'EXTERIOR-WALL adj exterior wall insulation', material'Wood-Framed - 4 in. Studs - 16 in. OC - R-11 Cavity Insulation_R-value 30.0% increase' was altered."
          ],
          "initial_condition": "The building had 1 exterior wall constructions: EXTERIOR-WALL (R-14.0).",
          "final_condition": "The existing insulation for exterior walls was increased by 30.0%. This was applied to 1,362 (ft^2) across 1 exterior wall constructions: EXTERIOR-WALL adj exterior wall insulation (R-16.5).",
          "step_values": [
            {
              "name": "r_value",
              "value": 30.0,
              "type": "Double"
            }
          ]
        }
      },
      {
        "measure_dir_name": "IncreaseRoofRValue",
        "arguments": {
          "r_value": 45
        },
        "result": {
          "started_at": "2016-08-30 18:30:15 UTC",
          "step_result": "Success",
          "completed_at": "2016-08-30 18:30:15 UTC",
          "step_errors": [

          ],
          "step_warnings": [
            "Measure couldn't find the construction named 'EXTERIOR-WALL adj exterior wall insulation' in the exterior surface hash."
          ],
          "step_info": [
            "For construction'EXTERIOR-ROOF adj roof insulation', material'Mineral Fiber Batt Insulation - 10 in._R-value 45.0% increase' was altered."
          ],
          "initial_condition": "The building had 1 roof constructions: EXTERIOR-ROOF (R-31.2).",
          "final_condition": "The existing insulation for roofs was increased by 45.0%. This was applied to 885 (ft^2) across 1 roof constructions: EXTERIOR-ROOF adj roof insulation (R-44.2).",
          "step_values": [
            {
              "name": "r_value",
              "value": 45.0,
              "type": "Double"
            }
          ]
        }
      },
      {
        "measure_dir_name": "SetEplusInfiltration",
        "arguments": {
          "flowPerZoneFloorArea": 10.76
        },
        "result": {
          "started_at": "2016-08-30 18:30:20 UTC",
          "step_result": "Success",
          "completed_at": "2016-08-30 18:30:20 UTC",
          "step_errors": [

          ],
          "step_warnings": [

          ],
          "step_info": [
            "Setting flow per zone floor area of Utility Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Entry way Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Small office Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Open area Leaky Bldg Infiltration 1 to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/Zone.",
            "Setting flow per zone floor area of Space Type 1 Leaky Bldg Infiltration to 10.76(m^3/s-m^2) and changing design flow calculation rate method to Flow/Zone. Original design flow calculation method was Flow/ExteriorArea."
          ],
          "initial_condition": "The building has 5 infiltrationObject objects. None of the infiltrationObjects started as Flow/Area.",
          "final_condition": "The building finished with flow per zone floor area values ranging from 10.76 to 10.76.",
          "step_values": [
            {
              "name": "flowPerZoneFloorArea",
              "value": 10.76,
              "type": "Double"
            }
          ]
        }
      },
      {
        "measure_dir_name": "DencityReports",
        "arguments": {
          "output_format": "CSV"
        },
        "result": {
          "started_at": "2016-08-30 18:30:33 UTC",
          "step_result": "Success",
          "completed_at": "2016-08-30 18:30:34 UTC",
          "step_errors": [

          ],
          "step_warnings": [

          ],
          "step_info": [
            "Model loaded",
            "Sql loaded",
            "Saving Dencity metadata csv file",
            "Saved Dencity metadata as report_metadata.csv",
            "The following meters were found: []",
            "Units were found for all available meters",
            "The following meter units were found: []",
            "get_timeseries_flag is set to true",
            "Retrieving timeseries data",
            "DeltaMake=0s",
            "Saved timeseries data as report_timeseries.csv",
            "DeltaWrite=0s",
            "Total Timeseries Time: 0"
          ],
          "final_condition": "DEnCity Report generated successfully.",
          "step_values": [
            {
              "name": "annual_consumption_district_cooling",
              "value": 0
            },
            {
              "name": "annual_consumption_district_heating",
              "value": 0
            },
            {
              "name": "annual_consumption_electricity",
              "value": 903.78
            },
            {
              "name": "annual_consumption_gas",
              "value": 0
            },
            {
              "name": "annual_consumption_other_energy",
              "value": 0
            },
            {
              "name": "annual_consumption_water",
              "value": 0
            },
            {
              "name": "annual_demand_district_cooling_peak_demand",
              "value": 0
            },
            {
              "name": "annual_demand_electricity_annual_avg_peak_demand",
              "value": 28.658675799086758
            },
            {
              "name": "annual_demand_electricity_peak_demand",
              "value": 60.684144786178685
            },
            {
              "name": "annual_utility_cost_district_cooling",
              "value": 0
            },
            {
              "name": "annual_utility_cost_district_heating",
              "value": 0
            },
            {
              "name": "annual_utility_cost_electricity",
              "value": 0
            },
            {
              "name": "annual_utility_cost_electricity_consumption_charge",
              "value": 0
            },
            {
              "name": "annual_utility_cost_electricity_demand_charge",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_cooling",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_equipment_exterior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_equipment_interior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_fans",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_generators",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_heat_recovery",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_heat_rejection",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_heating",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_humidification",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_lighting_exterior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_lighting_interior",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_pumps",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_refrigeration",
              "value": 0
            },
            {
              "name": "annual_utility_cost_end_uses_water_systems",
              "value": 0
            },
            {
              "name": "annual_utility_cost_gas",
              "value": 0
            },
            {
              "name": "annual_utility_cost_other_energy",
              "value": 0
            },
            {
              "name": "annual_utility_cost_total",
              "value": 0
            },
            {
              "name": "annual_utility_cost_water",
              "value": 0
            },
            {
              "name": "cash_flows_capital_type",
              "value": "Constant Dollar Capital Costs"
            },
            {
              "name": "cash_flows_capital_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_capital_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_energy_type",
              "value": "Constant Dollar Energy Costs"
            },
            {
              "name": "cash_flows_energy_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_energy_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_operating_type",
              "value": "Constant Dollar Operating Costs"
            },
            {
              "name": "cash_flows_operating_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_operating_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_total_type",
              "value": "Constant Dollar Total Costs"
            },
            {
              "name": "cash_flows_total_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_total_year_9",
              "value": 0
            },
            {
              "name": "cash_flows_water_type",
              "value": "Constant Dollar Water Costs"
            },
            {
              "name": "cash_flows_water_year_1",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_10",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_11",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_12",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_13",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_14",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_15",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_16",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_17",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_18",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_19",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_2",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_20",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_21",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_22",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_23",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_24",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_25",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_3",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_4",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_5",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_6",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_7",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_8",
              "value": 0
            },
            {
              "name": "cash_flows_water_year_9",
              "value": 0
            },
            {
              "name": "charsfloor_area",
              "value": 1858.06
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_1",
              "value": 2.0996
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_10",
              "value": 6.58033
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_11",
              "value": 3.53254
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_12",
              "value": 1.0863
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_2",
              "value": 1.55109
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_3",
              "value": 5.26752
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_4",
              "value": 7.06001
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_5",
              "value": 11.142900000000001
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_6",
              "value": 19.5318
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_7",
              "value": 23.643700000000003
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_8",
              "value": 25.5849
            },
            {
              "name": "monthly_consumption_cooling_electricity_month_9",
              "value": 16.1264
            },
            {
              "name": "monthly_consumption_cooling_electricity_year",
              "value": 123.20709000000001
            },
            {
              "name": "monthly_consumption_cooling_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_cooling_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_1",
              "value": 15.590900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_10",
              "value": 15.590900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_11",
              "value": 15.311000000000002
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_12",
              "value": 15.347900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_2",
              "value": 14.1446
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_3",
              "value": 15.894200000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_4",
              "value": 14.764700000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_5",
              "value": 15.894200000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_6",
              "value": 15.311000000000002
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_7",
              "value": 15.347900000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_8",
              "value": 15.894200000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_month_9",
              "value": 15.068000000000001
            },
            {
              "name": "monthly_consumption_equipment_interior_electricity_year",
              "value": 184.15950000000004
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_equipment_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_electricity_month_1",
              "value": 11.731300000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_10",
              "value": 10.4701
            },
            {
              "name": "monthly_consumption_fans_electricity_month_11",
              "value": 10.870000000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_12",
              "value": 12.249
            },
            {
              "name": "monthly_consumption_fans_electricity_month_2",
              "value": 10.797
            },
            {
              "name": "monthly_consumption_fans_electricity_month_3",
              "value": 10.707500000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_4",
              "value": 9.76317
            },
            {
              "name": "monthly_consumption_fans_electricity_month_5",
              "value": 9.25397
            },
            {
              "name": "monthly_consumption_fans_electricity_month_6",
              "value": 7.81892
            },
            {
              "name": "monthly_consumption_fans_electricity_month_7",
              "value": 8.33892
            },
            {
              "name": "monthly_consumption_fans_electricity_month_8",
              "value": 8.042100000000001
            },
            {
              "name": "monthly_consumption_fans_electricity_month_9",
              "value": 8.58829
            },
            {
              "name": "monthly_consumption_fans_electricity_year",
              "value": 118.63027000000001
            },
            {
              "name": "monthly_consumption_fans_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_fans_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_generators_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_recovery_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heat_rejection_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_electricity_month_1",
              "value": 46.6704
            },
            {
              "name": "monthly_consumption_heating_electricity_month_10",
              "value": 15.755700000000001
            },
            {
              "name": "monthly_consumption_heating_electricity_month_11",
              "value": 37.857
            },
            {
              "name": "monthly_consumption_heating_electricity_month_12",
              "value": 49.929500000000004
            },
            {
              "name": "monthly_consumption_heating_electricity_month_2",
              "value": 51.0604
            },
            {
              "name": "monthly_consumption_heating_electricity_month_3",
              "value": 37.4129
            },
            {
              "name": "monthly_consumption_heating_electricity_month_4",
              "value": 17.0774
            },
            {
              "name": "monthly_consumption_heating_electricity_month_5",
              "value": 8.82815
            },
            {
              "name": "monthly_consumption_heating_electricity_month_6",
              "value": 0.896969
            },
            {
              "name": "monthly_consumption_heating_electricity_month_7",
              "value": 0.40303100000000003
            },
            {
              "name": "monthly_consumption_heating_electricity_month_8",
              "value": 0.273025
            },
            {
              "name": "monthly_consumption_heating_electricity_month_9",
              "value": 2.6295300000000004
            },
            {
              "name": "monthly_consumption_heating_electricity_year",
              "value": 268.79400499999997
            },
            {
              "name": "monthly_consumption_heating_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_heating_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_humidification_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_1",
              "value": 17.6126
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_10",
              "value": 17.6126
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_11",
              "value": 17.5349
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_12",
              "value": 17.159000000000002
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_2",
              "value": 16.0704
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_3",
              "value": 18.267100000000003
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_4",
              "value": 16.4268
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_5",
              "value": 18.267100000000003
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_6",
              "value": 17.5349
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_7",
              "value": 17.159000000000002
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_8",
              "value": 18.267100000000003
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_month_9",
              "value": 17.081300000000002
            },
            {
              "name": "monthly_consumption_lighting_interior_electricity_year",
              "value": 208.9928
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_lighting_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_pumps_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_refrigeration_water_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_gas_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_consumption_water_systems_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_electricity_month_6",
              "value": 26.540830000000003
            },
            {
              "name": "monthly_demand_cooling_electricity_month_7",
              "value": 31.985419999999998
            },
            {
              "name": "monthly_demand_cooling_electricity_month_8",
              "value": 29.425610000000002
            },
            {
              "name": "monthly_demand_cooling_electricity_month_9",
              "value": 28.50479
            },
            {
              "name": "monthly_demand_cooling_electricity_year",
              "value": 31.985419999999998
            },
            {
              "name": "monthly_demand_cooling_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_cooling_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_1",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_10",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_11",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_12",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_2",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_3",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_4",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_5",
              "value": 4.32
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_6",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_7",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_8",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_month_9",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_electricity_year",
              "value": 9.72
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_equipment_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_electricity_month_1",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_10",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_11",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_12",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_2",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_3",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_4",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_5",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_electricity_month_6",
              "value": 2.0521700000000003
            },
            {
              "name": "monthly_demand_fans_electricity_month_7",
              "value": 2.7787100000000002
            },
            {
              "name": "monthly_demand_fans_electricity_month_8",
              "value": 2.62907
            },
            {
              "name": "monthly_demand_fans_electricity_month_9",
              "value": 2.59368
            },
            {
              "name": "monthly_demand_fans_electricity_year",
              "value": 4.89384
            },
            {
              "name": "monthly_demand_fans_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_fans_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_generators_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_recovery_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heat_rejection_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_1",
              "value": 135.33532
            },
            {
              "name": "monthly_demand_heating_electricity_month_10",
              "value": 61.48545
            },
            {
              "name": "monthly_demand_heating_electricity_month_11",
              "value": 108.52622000000001
            },
            {
              "name": "monthly_demand_heating_electricity_month_12",
              "value": 159.07201999999998
            },
            {
              "name": "monthly_demand_heating_electricity_month_2",
              "value": 137.83596
            },
            {
              "name": "monthly_demand_heating_electricity_month_3",
              "value": 122.83963000000001
            },
            {
              "name": "monthly_demand_heating_electricity_month_4",
              "value": 95.22537
            },
            {
              "name": "monthly_demand_heating_electricity_month_5",
              "value": 75.2703
            },
            {
              "name": "monthly_demand_heating_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_electricity_year",
              "value": 159.07201999999998
            },
            {
              "name": "monthly_demand_heating_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_heating_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_humidification_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_exterior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_1",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_10",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_11",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_12",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_2",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_3",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_4",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_5",
              "value": 1.8
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_6",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_7",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_8",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_month_9",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_electricity_year",
              "value": 16.20001
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_lighting_interior_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_pumps_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_refrigeration_water_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_cooling_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_district_heating_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_electricity_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_gas_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_other_energy_year",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_1",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_10",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_11",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_12",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_2",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_3",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_4",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_5",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_6",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_7",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_8",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_month_9",
              "value": 0
            },
            {
              "name": "monthly_demand_water_systems_water_year",
              "value": 0
            },
            {
              "name": "source",
              "value": "XcelEDAReportingandQAQC"
            },
            {
              "name": "test_reg_value",
              "value": 9989
            }
          ]
        }
      }
    ],
    "started_at": "2016-08-30 18:30:09 UTC",
    "completed_status": "Success",
    "completed_at": "2016-08-30 18:30:36 UTC"
  }
];

// TODO decide where any exported files should be saved
console.log("Preloading report output directory.");
reportDir = "C:/Users/aparker/Desktop/Testing/Project Reporting Measures"
