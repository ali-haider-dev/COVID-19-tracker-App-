import React, { useState, useEffect } from 'react'
import "./style.css"
import { Line } from "react-chartjs-2"
import numeral from 'numeral';


function Graph({ casesType = "cases" }) {

    const option = {
        type: 'line',
        responsive: true,
        legend: {
            display: false,
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        maintainAspectRatio: false,
        tooltips: {
            mode: "line",
            intersect: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    return numeral(tooltipItem.value).format("+0.0")
                },
            },
        },
        scales: {
            xAxes: [
                {
                    type: "time",
                    time: {
                        format: "MM/DD/YY",
                        tooltipformat: "ll"
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        display: false.valueOf,
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return numeral(value).format("0a")
                        }
                    }
                }
            ]
        }
    };




    const [data, setData] = useState({})

    useEffect(() => {

        const fetchdata = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then((response) => response.json())
                .then((data) => {
                    const chartData = buildChartdata(data, "cases")
                    setData(chartData)

                })
        }


        fetchdata()

    }, [casesType])

    const buildChartdata = ((data, casesType = "cases") => {
        const charteddata = []
        let lastPointData;
        for (let date in data.cases) {
            if (lastPointData) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastPointData
                }
                charteddata.push(newDataPoint)
            }
            lastPointData = data[casesType][date]
        }
        return charteddata
    })

    return (
        <div>
            {
                data?.length > 0 &&
                <Line

                    options={option}
                    data={{
                        datasets: [
                            {
                                label: 'Graph',
                                backgroundColor: "rgba(204,16,52,0.5)",
                                borderColor: "#CC1034",
                                data: data
                            },
                        ],
                    }}

                />
            }

        </div>
    )
}

export default Graph
