import { Divider, Table } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import React from "react";

const PrintableSurvey = ({
  courseTitle = "Title",
  description,
  criteria,
  totalAverage,
  date,
  student,
  barChartData = [],
  listcriteria = [],
}) => {
  return (
    <div style={{ color: "#000", fontFamily: "Arial" }}>
      {/* First Page - Bar Chart */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          pageBreakAfter: "always",
        }}
      >
        <img
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            transform: "translate(-50%, -50%)",
            opacity: 0.1,
          }}
          src='/images/Logo.png'
        />
        <div
          style={{
            display: "grid",
            placeItems: "center",
          }}
        >
          <img
            style={{ height: 70 }}
            src='/images/Admin-Logo.png'
          />
        </div>
        <Divider my={30} />
        <div style={{ padding: "0 30px 30px 30px" }}>
          <div style={{ marginBottom: "30px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "20px" }}>
                {courseTitle}
              </p>
              <p>{date}</p>
            </div>
            <p style={{ fontSize: "15px" }}>- {student} Learners Evaluation</p>
          </div>

          {/* Bar Chart Section */}
          {barChartData &&
            barChartData.length > 0 &&
            !barChartData.every((v) => v.Average === 0) && (
              <div style={{ marginBottom: "30px" }}>
                <p
                  style={{
                    marginBottom: "15px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Evaluation Results
                </p>
                <div
                  style={{
                    height: 600,
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <BarChart
                    style={{
                      position: "relative",
                      top: "-130px",
                    }}
                    h={600}
                    w='90%'
                    yAxisProps={{
                      tickCount: 4,
                      tickMargin: 100,
                      tick: {
                        fontSize: 40,
                        fontWeight: "bold",
                      },
                    }}
                    xAxisProps={{
                      tick: {
                        fontSize: 35,
                        fontWeight: "bold",
                      },
                    }}
                    valueLabelProps={{
                      style: {
                        fontSize: 35,
                        color: "black",
                      },
                    }}
                    withTooltip={false}
                    valueFormatter={(v) => v.toFixed(2)}
                    data={barChartData}
                    dataKey='name'
                    series={[{ name: "Average", color: "blue.6" }]}
                    tickLine='y'
                    withBarValueLabel
                  />
                </div>
              </div>
            )}

          <div style={{ marginTop: "-270px" }}>
            <h3 style={{ fontWeight: "bold" }}>Criteria :</h3>
            {listcriteria.map((vs) => {
              return <p style={{ fontSize: 14 }}>{vs.name}</p>;
            })}
          </div>
        </div>
      </div>

      {/* Second Page - Data Tables */}
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <img
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            transform: "translate(-50%, -50%)",
            opacity: 0.1,
          }}
          src='/images/Logo.png'
        />
        <div
          style={{
            display: "grid",
            placeItems: "center",
          }}
        >
          <img
            style={{ height: 50 }}
            src='/images/Admin-Logo.png'
          />
        </div>
        <Divider my={30} />
        <div style={{ padding: "0 30px 30px 30px" }}>
          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginTop: "-10px",
                }}
              >
                {courseTitle}
              </p>
              <p>{date}</p>
            </div>
            <p style={{ fontSize: "15px" }}>- {student} Learners Evaluation</p>
          </div>

          <table style={{ width: "100%", marginBottom: "10px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingBottom: "8px" }}>
                  CRITERIA
                </th>
                <th
                  style={{
                    textAlign: "right",
                    paddingBottom: "8px",
                  }}
                >
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((item, i) => {
                return (
                  <tr key={i}>
                    <th style={{ textAlign: "left" }}>{item.name}</th>
                    <td style={{ textAlign: "right", paddingRight: 20 }}>
                      {item.average.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  style={{ textAlign: "right" }}
                  colSpan={2}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <div
                      style={{
                        borderTop: "1px solid #0009",
                        width: "fit-content",
                        padding: "6px 20px 0 20px",
                        fontWeight: "bold",
                      }}
                    >
                      {totalAverage.toFixed(2)}
                    </div>
                  </div>
                </td>
              </tr>
              {criteria.map((item, i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td style={{ padding: "5px 0", fontWeight: "bold" }}>
                      {item.name}
                    </td>
                    <td></td>
                  </tr>
                  {item.subItems?.map((sub, j) => (
                    <tr key={`${i}-${j}`}>
                      <td
                        style={{
                          paddingLeft: "20px",
                          paddingTop: "2px",
                          paddingBottom: "2px",
                          fontSize: 15,
                        }}
                      >
                        {j + 1}. {sub.name}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          paddingRight: 20,
                          fontSize: 15,
                        }}
                      >
                        {sub.average.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintableSurvey;
