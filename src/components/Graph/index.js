import React, { useState, useEffect } from 'react'
import "./style.css"
import { Line } from "react-chartjs-2"
import numeral from 'numeral';




const options = {

    legend: {
        label: false,
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
                return numeral(tooltipItem.value).format("+0.0a")
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
                        return numeral(value).format("0.0a")
                    }
                }
            }
        ]
    }
};




function Graph({ casesType, ...props }) {
    const [data, setData] = useState({})

    useEffect(() => {

        const fetchdata = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then((response) => response.json())
                .then((data) => {
                    const chartData = buildChartdata(data, casesType)
                    setData(chartData)
                    console.log("graph====", data);
                })
        }


        fetchdata()

    }, [casesType])

    const buildChartdata = ((data, casesType) => {
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
        <div className={props.className}>
            {
                data?.length > 0 &&
                <Line

                    options={options}
                    data={{
                        datasets: [
                            {
                                label: 'Cases',
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
