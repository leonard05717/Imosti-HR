import React, { use, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import supabase, { getAccount } from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { ActionIcon, Box, Card, Center, Select, Table, Tooltip , Text, Autocomplete, Menu, Modal} from "@mantine/core";
import { IconChevronDown, IconPrinter } from "@tabler/icons-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { data } from '../data';
import {MonthPicker, YearPicker,} from "@mantine/dates";



function Analytics() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [Employees , setEmployees] = useState([]);
  const [filtersemployee , setfiltersemployee] = useState([]);
  const [filtersDependent , setfiltersDependent] = useState([]);
  const [AmountEmployee , setAmountEmployee] = useState([]);
  const [AmountDependent , setAmountDependent] = useState([]);
  const [Diagnosisfilter , setDiagnosisfilter] = useState([]);
  const [Diagnosis, setDiagnosis] = useState([]);
  const [filterDiag, setfilterDiag] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Select");
  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [filterState, { open: openFilterState, close: closeFilterState }] =
  useDisclosure(false);
  const [Datefilter, setSDatefilter] = useState(new Date());

  const diagnosisCountData = Object.values(filterDiag);

  const diagnosisData = Object.values(Diagnosisfilter).map((item) => ({
    ...item,
    totalAmount: item.employeeAmount + item.dependentAmount,
  }));

  const totalEmployeeAmount = diagnosisData.reduce(
    (sum, item) => sum + item.employeeAmount,
    0
  );
  
const totalDependentAmount = diagnosisData.reduce(
  (sum, item) => sum + item.dependentAmount,
  0
);

const handleSinglePrint = () => {

  const printWindow = window.open("", "_blank");
 
  const labels = diagnosisCountData.map(item => item.diagnosis);
  const employeeData = diagnosisCountData.map(item => item.Employee);
  const dependentData = diagnosisCountData.map(item => item.Dependent);

  console.log(labels); 
  console.log(employeeData); 
  console.log(dependentData);

  let printContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Medical Reimbursement Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    table {
      width: 80%;
      margin: 0 auto;
      border-collapse: collapse;
      text-align: center;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 10px;
    }
    th {
      background-color: #e25e29;
      color: white;
      font-weight: bold;
    }
    .center {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .totals {
      margin: 30px 0 0 170px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div>
    <h2>Utilization Report</h2>
    <h5>As of ${(new Date(Datefilter)).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short'
})}</h5>
  </div>
 <div class="center">
    <table>
      <thead>
        <tr>
          <th colspan="2">Availment of Medical Reimbursement</th>
          <th colspan="2">Amount</th>
        </tr>
        <tr>
          <th>Employees</th>
          <th>Dependent</th>
          <th>Employees</th>
          <th>Dependent</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td id="employeeCount">${filtersemployee}</td>
          <td id="dependentCount">${filtersDependent}</td>
          <td id="employeeAmount">${formatPHP(AmountEmployee)}</td>
          <td id="dependentAmount">${formatPHP(AmountDependent)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="display:flex; justify-content:flex-end; margin-right:150px; margin-top:20px; font-weight:bold;">
    <h3>Total Amount: <span id="totalAmount">${AmountEmployee + AmountDependent}</span></h3>
  </div>

  <!-- Availment Bar Chart -->
  <div class="center">
    <div style="width: 50%;">
      <h3 style="text-align: center; font-weight: bold;">Availment of Medical Reimbursement</h3>
      <canvas style="margin-left:-190px" height="100" id="barChart"></canvas>
    </div>
  </div>

  <!-- Amount Bar Chart -->
  <div class="center" style="margin-top: 40px;">
    <div style="width: 50%;">
      <h3 style="text-align: center; font-weight: bold;">Amount of Availment</h3>
      <canvas style="margin-left:-190px" height="100" id="amountChart"></canvas>
    </div>
  </div>

  <div style="page-break-before: always;"> 
  <!-- Diagnosis Table -->
  <div style="margin-top: 20px;">
    <h3 style="text-align: center; font-weight: bold;">Top Diagnosis</h3>
    <table id="diagnosisTable">
      <thead>
        <tr>
          <th rowspan="2">Illness</th>
          <th colspan="2">Number of Availment</th>
          <th colspan="2">Amount</th>
          <th rowspan="2">Total Amount of Availment</th>
        </tr>
        <tr>
          <th>Employee</th>
          <th>Dependent</th>
          <th>Employee</th>
          <th>Dependent</th>
        </tr>
      </thead>
      <tbody>
      ${diagnosisData.map((item) => (
          `<tr key=${item.illness}>
            <td style={{ border: '1px solid #ccc' }}>${item.illness}</td>
            <td style={{ border: '1px solid #ccc' }}>${item.employeeCount}</td>
            <td style={{ border: '1px solid #ccc' }}>${item.dependentCount}</td>
            <td style={{ border: '1px solid #ccc' }}>${`PHP ${item.employeeAmount.toLocaleString()}`}</td>
            <td style={{ border: '1px solid #ccc' }}>${`PHP ${item.dependentAmount.toLocaleString()}`}</td>
            <td style={{ border: '1px solid #ccc' }}><Text fw={500}>${`PHP ${item.totalAmount.toLocaleString()}`}</Text></td>
          </tr>`
        ))}
      </tbody>
    </table>
    <div class="totals" style="margin-left: 0px">
      <h5>Total Amount Employee : <span id="totalEmpAmt">PHP ${totalEmployeeAmount}</span></h3>
      <h5>Total Amount Dependent : <span id="totalDepAmt">PHP ${totalDependentAmount}</span></h3>
      <h5>Total used Medical Reimbursement : <span id="totalMedAmt">PHP ${totalMedicalAmount}</span></h3>
    </div>
  </div>

  <!-- Diagnosis Bar Chart -->
  <div class="center" style="margin-top: 120px;">
    <div style="width: 45%;">
      <h3 style="text-align: center; font-weight: bold;">Top Diagnosis / Availment</h3>
      <canvas style="margin-left:-190px" height="100" id="diagnosisChart"></canvas>
    </div>
  </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
      <script>
    const labels = ${JSON.stringify(labels)};
    const employeeData = ${JSON.stringify(employeeData)};
    const dependentData = ${JSON.stringify(dependentData)};

   new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: {
        labels: ['Employee', 'Dependent'],
        datasets: [{
          label: 'Availment Count',
          data: [${filtersemployee}, ${filtersDependent}],
          backgroundColor: ['#e56731', '#38b0ea'],
        }]
      },
       options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
    anchor: 'end',
    align: 'start',
    clamp: true,
    clip: true,
    color: '#000',
    font: {
      weight: 'bold',
      size: 14 ,
    },
        formatter: function(value) {
          return value;
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  },
  plugins: [ChartDataLabels]
    });

   new Chart(document.getElementById('amountChart'), {
      type: 'bar',
      data: {
        labels: ['Employee', 'Dependent'],
        datasets: [{
          label: 'Availment Amount',
          data: [${AmountEmployee}, ${AmountDependent}],
          backgroundColor: ['#e56731', '#38b0ea'],
        }]
      },
      options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        anchor: 'end',
    align: 'start',
    clamp: true,
    clip: true,
    color: '#000',
    font: {
      weight: 'bold',
      size: 14 ,
    },
        formatter: function(value) {
          return value;
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  },
  plugins: [ChartDataLabels]
    });
    

    new Chart(document.getElementById('diagnosisChart'), {
      type: 'bar',
      data: {
      labels: labels,
     datasets: [
      {
        label: 'Employee',
        data: employeeData,
        backgroundColor: '#e56731'
      },
      {
        label: 'Dependent',
        data: dependentData,
        backgroundColor: '#38b0ea'
      }
      ]
       },
        options: {
      indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: true
      },
      datalabels: {
      anchor: 'end',
      align: 'start',
      clamp: true,
      clip: true,
      color: '#000',
      font: {
      weight: 'bold',
      size: 14 ,
    },
        formatter: function(value) {
          return value;
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  },
  plugins: [ChartDataLabels]
    });

   
      </script>
  </body>
      
    `;

  printWindow.document.write(printContent);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};

const totalMedicalAmount = totalEmployeeAmount + totalDependentAmount;
  
  const [filterBarchart, setFilterBarchart] = useState([
    new Date(),
    new Date(),
  ]);

  const formatPHP = (amount) =>
    `PHP ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

   const datafilter= [
    {
      Employee: filtersemployee,
      Dependent: filtersDependent,
    }
   ];
   const dataAmount= [
    {
      Employee: AmountEmployee,
      Dependent: AmountDependent,
    }
   ];

  async function fetchAllData() {
    try {
      setLoadingPage(true);
      const emp = (await supabase.from("Employee").select()).data;
      const diag = (await supabase.from("diagnosis").select()).data;

      setDiagnosis(diag);
      setEmployees(emp);
    } catch (error) {
      window.alert(error.toString());
    } finally {
      setLoadingPage(false);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!selectedMonthYear) return;
  
    let start, end;
    const my1 = new Date(selectedMonthYear);
  
    if (selectedFilter === "By Specific Month") {
      start = new Date(my1.getFullYear(), my1.getMonth(), 1);
      end = new Date(my1.getFullYear(), my1.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (selectedFilter === "By Specific Year") {
      start = new Date(my1.getFullYear(), 0, 1);
      end = new Date(my1.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
  
    setFilterBarchart([start, end]);
  
    const filtered = Employees.filter((item) => {
      const dateN = item.created_at;
      if (!dateN) return false;
      const trainingDate = new Date(dateN);
      return trainingDate >= start && trainingDate <= end;
    });
  
    let { employees, dependents } = filtered.reduce(
      (acc, curr) => {
        if (curr.Particulars === "Employee") acc.employees.push(curr);
        else if (curr.Particulars === "Dependent") acc.dependents.push(curr);
        return acc;
      },
      { employees: [], dependents: [] }
    );

    const employeeTotalAmount = employees.reduce(
      (sum, item) =>
        sum +
        Number(item.con_charge || 0) +
        Number(item.lab_charge || 0) +
        Number(item.hos_charge || 0) +
        Number(item.op_charge || 0) +
        Number(item.other_charge || 0),
      0
    );

    const dependentTotalAmount = dependents.reduce(
      (sum, item) =>
        sum +
        Number(item.con_charge || 0) +
        Number(item.lab_charge || 0) +
        Number(item.hos_charge || 0) +
        Number(item.op_charge || 0) +
        Number(item.other_charge || 0),
      0
    );

    const diagnosisGrouped = filtered.reduce((acc, item) => {
      const { Diagnosis, Particulars, con_charge, lab_charge, hos_charge, op_charge, other_charge } = item;
    
      const amount = 
        Number(con_charge || 0) +
        Number(lab_charge || 0) +
        Number(hos_charge || 0) +
        Number(op_charge || 0) +
        Number(other_charge || 0);
    
      if (!acc[Diagnosis]) {
        acc[Diagnosis] = {
          illness: Diagnosis,
          employeeCount: 0,
          dependentCount: 0,
          employeeAmount: 0,
          dependentAmount: 0,
        };
      }
    
      if (Particulars === "Employee") {
        acc[Diagnosis].employeeCount += 1;
        acc[Diagnosis].employeeAmount += amount;
      } else if (Particulars === "Dependent") {
        acc[Diagnosis].dependentCount += 1;
        acc[Diagnosis].dependentAmount += amount;
      }
    
      return acc;
    }, {});

    const diagnosisCountMap = {};

    filtered.forEach((item) => {
      const diagnosis = item.Diagnosis;
      const role = item.Particulars; // "Employee" or "Dependent"
    
      if (!diagnosisCountMap[diagnosis]) {
        diagnosisCountMap[diagnosis] = {
          diagnosis,
          Employee: 0,
          Dependent: 0,
        };
      }
    
      if (role === "Employee") {
        diagnosisCountMap[diagnosis].Employee += 1;
      } else if (role === "Dependent") {
        diagnosisCountMap[diagnosis].Dependent += 1;
      }
    });

    setSDatefilter(selectedMonthYear)
    setfilterDiag(diagnosisCountMap)
    setDiagnosisfilter(diagnosisGrouped)
    setAmountEmployee(employeeTotalAmount)
    setAmountDependent(dependentTotalAmount)
    setfiltersemployee(employees.length);
    setfiltersDependent(dependents.length);
  }, [selectedMonthYear, selectedFilter, Employees]);

  
  return (
   <PageContainer>

    <div style={{display:'flex' , justifyContent:'space-between' , marginBottom: '20px' , margin: '0px 150px 0px 150px'}}> 
    <h2 style={{fontWeight:'bold'}} >Utilization Report</h2>
    <ActionIcon onClick={handleSinglePrint} variant="filled" size="xl" aria-label="Settings">
      <IconPrinter style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
    </div>

         {/* Filter Modal */}
         <Modal
        opened={filterState}
        onClose={closeFilterState}
        title={selectedFilter || "Date Picker"}
        // size='md'
        size='sm'
      >
        <div className='flex items-center justify-center py-5'>
          {selectedFilter === "By Specific Month" && (
            <MonthPicker
              value={selectedMonthYear}
              onChange={setSelectedMonthYear}
              label='Select Month and Year'
              maxDate={new Date()}
            />
          )}

          {selectedFilter === "By Specific Year" && (
            <YearPicker
              value={selectedMonthYear}
              onChange={setSelectedMonthYear}
              label='Select Year'
              maxDate={new Date()}
            />
          )}
        </div>
      </Modal>
         <div style={{marginBottom:"20px" , marginLeft:'175px'}}>
      <Menu
                arrowSize={15}
                withArrow
                styles={{
                  arrow: {
                    borderTop: "1px solid #0005",
                    borderLeft: "1px solid #0005",
                  },
                
                }}
              >
                <Menu.Target>
                  <div
                    className='clickable-element'
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>
                      {selectedFilter === "By Specific Month" &&
                      selectedMonthYear
                        ? `By Specific Month (${new Date(selectedMonthYear).getFullYear()}, ${new Date(
                            selectedMonthYear,
                          ).toLocaleString("default", {
                            month: "long",
                          })})`
                        : selectedFilter === "By Specific Year" &&
                            selectedMonthYear
                          ? `By Specific Year (${new Date(selectedMonthYear).getFullYear()})`
                          : selectedFilter === "By Specific Day" && selectedDay
                            ? `By Specific Day (${new Date(selectedDay).toLocaleDateString()})`
                            : selectedFilter === "By Date Range" &&
                                selectedDateRange[0] &&
                                selectedDateRange[1]
                              ? `By Date Range (${new Date(selectedDateRange[0]).toLocaleDateString()} - ${new Date(selectedDateRange[1]).toLocaleDateString()})`
                              : selectedFilter}
                    </span>
                    <IconChevronDown size={18} />
                  </div>
                </Menu.Target>
                <Menu.Dropdown
                  style={{
                    border: "1px solid #0005",
                    boxShadow: "1px 2px 3px #0005",
                  }}
                  w={190}
                >
                  <Menu.Label>Filter</Menu.Label>
                  <Menu.Item
                    onClick={() => {
                      setSelectedFilter("By Specific Month");
                      setSelectedMonthYear(new Date());
                      openFilterState();
                    }}
                  >
                    By Specific Month
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setSelectedMonthYear(new Date());
                      setSelectedFilter("By Specific Year");
                      openFilterState();
                    }}
                  >
                    By Specific Year
                  </Menu.Item>
                </Menu.Dropdown>
      </Menu>
          </div>
          <div>
      <Center>
        <Table
          withBorder
          withColumnBorders
          striped={false}
          highlightOnHover={false}
          style={{ width: '80%', textAlign: 'center' }}
        >
          <thead>
            <tr >
              <th colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold' , border: '1px solid #ccc'  }}>
                Availment of Medical Reimbursement
              </th>
              <th colSpan={2} style={{ textAlign: 'center', fontWeight: 'bold' , border: '1px solid #ccc'  }}>
                Amount
              </th>
            </tr>
            <tr style={{ backgroundColor: '#e25e29', color: 'white' , border: '1px solid #ccc'  }}>
              <th style={{ border: '1px solid #ccc' }}>Employees</th>
              <th style={{ border: '1px solid #ccc' }}>Dependent</th>
              <th style={{ border: '1px solid #ccc' }}>Employees</th>
              <th style={{ border: '1px solid #ccc' }}>Dependent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc' }}>{filtersemployee}</td>
              <td style={{ border: '1px solid #ccc' }}>{filtersDependent}</td>
              <td style={{ border: '1px solid #ccc' }}>{formatPHP(AmountEmployee)}</td>
              <td style={{ border: '1px solid #ccc' }}>{formatPHP(AmountDependent)}</td>
            </tr>
          </tbody>
        </Table>

      </Center>
      <div style={{display:'flex' , justifyContent:'flex-end' , marginRight:'500px' , marginTop:'20px' , fontWeight:'bold'}}>
          <h3>
            Total: {AmountEmployee + AmountDependent}
          </h3>
      </div>

    {/*this for medicalreimbursment */}
    <div style={{display:'flex' , justifyContent:'center' , marginTop:'50px'  }}>
   
    <ResponsiveContainer width="80%" height={400}>
    <div style={{display:'flex' , justifyContent:'center' , marginBottom:'30px'}}>
    <h1 style={{fontWeight:'bold'}}>Availment of Medical Reimbursement</h1>
    </div>
      <BarChart
        data={datafilter} 
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
        barSize={150}
        barGap={500}
         
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis  />
        <Tooltip />
        <Legend />
        <Bar dataKey="Employee" fill="#e56731" />
        <Bar dataKey="Dependent" fill="#38b0ea" />
        
      </BarChart>
    </ResponsiveContainer>  
    </div>

        {/*this Amount */}
    <div style={{display:'flex' , justifyContent:'center' , marginTop:'120px' }}>
    <ResponsiveContainer width="80%" height={400}>
    <div style={{display:'flex' , justifyContent:'center' , marginBottom:'30px'}}>
    <h1 style={{fontWeight:'bold'}}>Amount of Availment</h1>
    </div>
      <BarChart
        data={dataAmount}
        layout="vertical"
        barSize={50}
        barGap={50}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis dataKey="month" type="category" />
        <XAxis type="number"  tickCount={15}   tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Employee" fill="#e56731" />
        <Bar dataKey="Dependent" fill="#38b0ea" />
       
      </BarChart>
    </ResponsiveContainer>

    </div>

    <div style={{marginTop:'160px' }}>
        <div style={{display:'flex' , justifyContent:'center' , marginBottom:'30px'}}>
        <h1 style={{fontWeight:'bold'}}>Top Diagnosis</h1>
        </div>
      <Center>
        <Table
           withBorder
          withColumnBorders
          striped={false}
          highlightOnHover={false}
          style={{ width: '80%', textAlign: 'center' }}
    >
      <thead>
        <tr>
          <th rowSpan={2} style={{ border: '1px solid #ccc' }}>Illness</th>
          <th colSpan={2} style={{ border: '1px solid #ccc' }}><Center>Number of Availment</Center></th>
          <th colSpan={2} style={{ border: '1px solid #ccc' }}><Center>Amount</Center></th>
          <th rowSpan={2} style={{ border: '1px solid #ccc' }}>Total Amount of Availment</th>
        </tr>
        <tr>
          <th style={{ border: '1px solid #ccc' }}>Employee</th>
          <th style={{ border: '1px solid #ccc' }}>Dependent</th>
          <th style={{ border: '1px solid #ccc' }}>Employee</th>
          <th style={{ border: '1px solid #ccc' }}>Dependent</th>
        </tr>
      </thead>
      <tbody>
        {diagnosisData.map((item) => (
          <tr key={item.illness}>
            <td style={{ border: '1px solid #ccc' }}>{item.illness}</td>
            <td style={{ border: '1px solid #ccc' }}>{item.employeeCount}</td>
            <td style={{ border: '1px solid #ccc' }}>{item.dependentCount}</td>
            <td style={{ border: '1px solid #ccc' }}>{`PHP ${item.employeeAmount.toLocaleString()}`}</td>
            <td style={{ border: '1px solid #ccc' }}>{`PHP ${item.dependentAmount.toLocaleString()}`}</td>
            <td style={{ border: '1px solid #ccc' }}><Text fw={500}>{`PHP ${item.totalAmount.toLocaleString()}`}</Text></td>
          </tr>
        ))}
      </tbody>
    </Table>
    </Center>

    <div style={{margin:'30px 0px 00px 170px' , fontWeight:'bold'}}>
      <h1>Total Amount Employee : {totalEmployeeAmount}</h1>
      <h1>Total Amount Dependent : {totalDependentAmount}</h1>
      <h1>Total used Medical Reimbursement : {totalMedicalAmount} </h1>
    </div>
    </div>

    <div style={{display:'flex' , justifyContent:'center' , marginTop:'120px' }}>
    <ResponsiveContainer width="80%" height={400}>
    <div style={{display:'flex' , justifyContent:'center' , marginBottom:'30px'}}>
    <h1 style={{fontWeight:'bold'}}>Top Diagnosis / Availment</h1>
    </div>
      <BarChart
        data={diagnosisCountData}
        layout="vertical"
        margin={{
          top: 20, right: 30, left: 50, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis dataKey='diagnosis' type="category" />
        <XAxis type="number"  tickCount={20}/>
        <Tooltip />
        <Legend />

            <Bar dataKey="Employee" fill="#e56731" />
            <Bar dataKey="Dependent" fill="#38b0ea" />
       
      </BarChart>
    </ResponsiveContainer>

    </div>
    </div>
   
   </PageContainer>
  )
}

export default Analytics