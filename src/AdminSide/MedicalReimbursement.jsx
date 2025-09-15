import { ActionIcon, AspectRatio, Button, Checkbox, Flex, LoadingOverlay, Modal, Select, Table, TextInput  , Image} from "@mantine/core";
import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import PageContainer from "../components/PageContainer";
import { IconDotsVertical, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

function Settings() {

  const [EmployeeAdd,{ open: openEmployee, close: closeEmployee },] = useDisclosure(false)  
  const [deleteState,{ open: opendeleteState, close: closedeleteState },] = useDisclosure(false);
  const [viewState,{ open: openviewState, close: closeviewState },] = useDisclosure(false);

const [EmployeeReport , setEmployeeReport] = useState([]);
const [Diagnosi , setDiagnosi] = useState([]);
const [loadingPage, setLoadingPage] = useState(true);
const [checktable, setchecktable] = useState([]);
const [selectedemployee, setSelectedemployee] = useState(null);
const [search, setSearch] = useState("");
const [totalReimbursement, setTotalReimbursement] = useState(0);
const [allocatedMBL, setAllocatedMBL] = useState(0);
const [MBLBalance, setMBLBalance] = useState(0);


const medicalDescriptions = [
  'Consultation Fee',
  'Laboratory test/ Procedure',
  'Confinement/ Hospitalization',
  'Operation',
  'Others:',
];

  async function DeleteRecords() {
  const checkedStudents = checktable.filter((student) => student.checked);
  const studentIds = checkedStudents.map((s) => s.id);
  if (checktable.every((v) => !v.checked)) {
    console.log("No Student Checked");
    alert("You need at least 1 Student Check");
    return;
  }
      const { error: deleteError } = await supabase
        .from("Employee")
        .delete()
        .in("id", studentIds);
      if (deleteError) {
        console.log(`Something Error: ${deleteError.message}`);
        return;
      }
    
      await fetchData();
      closedeleteState();
      AddEmployeeForm.reset();
      console.log("Delete Success");
      return;
  }



const AddEmployeeForm = useForm({
  mode: "controlled",
  initialValues: {
    doc:'',
    date_file:'',
    particul:'',
    employee_Dependet:'',

    ename:'',
    department:'',
    designation:'',
    diagnosis:'',
    details:'',
    table: [
    { charge: '', billing: '', hospital: '', doctor: '' }, // row 0
    { charge: '', billing: '', hospital: '', doctor: '' }, // row 1
    { charge: '', billing: '', hospital: '', doctor: '' }, // row 2
    { charge: '', billing: '', hospital: '', doctor: '' }, // row 3
    { charge: '', billing: '', hospital: '', doctor: '' }, // row 4
  ],

   Allocated_MBL:'',
   
  },
});

function getTableFromSelectedEmployee(emp) {
  return [
    {
      charge: emp.con_charge,
      billing: emp.con_billing ?? '',
      hospital: emp.con_hospital,
      doctor: emp.con_doctor,
    },
    {
      charge: emp.lab_charge,
      billing: '',
      hospital: emp.lab_hospital,
      doctor: emp.lab_doctor,
    },
    {
      charge: emp.hos_charge,
      billing: '',
      hospital: emp.hos_hospital,
      doctor: emp.hos_doctor,
    },
    {
      charge: emp.op_charge,
      billing: '',
      hospital: emp.op_hospital,
      doctor: emp.op_doctor,
    },
    {
      charge: emp.other_charge,
      billing: '',
      hospital: emp.other_hospital,
      doctor: emp.other_doctor,
    },
  ];
}

async function resetfield() {

  AddEmployeeForm.reset();
  closeviewState();
  
}

async function submitHandler(employees) {
  try{
    setLoadingPage(true)

  
    const { error: insertError } = await supabase.from("Employee").insert({
      created_at: new Date(),
      Name:employees.ename,
      Particulars: employees.particul,
      Diagnosis: employees.diagnosis,
      Details: employees.details,
      Billing_Date: AddEmployeeForm.values.table[0].billing,
      Date_File: employees.date_file,
      Current_MBL: employees.Allocated_MBL,
      For_Reimbursement: totalReimbursement,
      Remaining_MBL: MBLBalance,
      doc_id: employees.doc,
      department: employees.department,
      designation: employees.designation,
      if_dependent: employees.employee_Dependet,

      con_charge: AddEmployeeForm.values.table[0].charge,
      con_billing: AddEmployeeForm.values.table[0].billing,
      con_hospital: AddEmployeeForm.values.table[0].hospital,
      con_doctor: AddEmployeeForm.values.table[0].doctor,

      lab_charge: AddEmployeeForm.values.table[1].charge,
      lab_hospital: AddEmployeeForm.values.table[1].hospital,
      lab_doctor: AddEmployeeForm.values.table[1].doctor,

      hos_charge: AddEmployeeForm.values.table[2].charge,
      hos_doctor: AddEmployeeForm.values.table[2].doctor,
      hos_hospital: AddEmployeeForm.values.table[2].hospital,

      op_charge: AddEmployeeForm.values.table[3].charge,
      op_hospital: AddEmployeeForm.values.table[3].hospital,
      op_doctor: AddEmployeeForm.values.table[3].doctor,

      other_charge: AddEmployeeForm.values.table[4].charge,
      other_hospital: AddEmployeeForm.values.table[4].hospital,
      other_doctor: AddEmployeeForm.values.table[4].doctor,
    });

    if (insertError) {
      console.log(`Something Error: ${insertError.message}`);
      return;
    }
    AddEmployeeForm.reset();
    await fetchData();
    alert("Success")
    closeEmployee()
  }
 catch (error) {
  console.error(error);
  } finally {
    setLoadingPage(false);
  }

}

async function fetchData() {
  try {
    setLoadingPage(true);
    const Employees = (await supabase.from("Employee").select()).data;
    const diag = (await supabase.from("diagnosis").select()).data;
    const Employeescheck = (
      await supabase
        .from("Employee")
        .select("*")
        .order("created_at", { ascending: false })
    ).data;

    setEmployeeReport(Employees)
    setDiagnosi(diag)
  
    setchecktable(Employeescheck.map((v) => ({ ...v, checked: false })));
   

  } catch (error) {
    window.alert(error.toString());
  } finally {
    setLoadingPage(false);
  }
}

useEffect(() => {

    const total = AddEmployeeForm.values.table.reduce((acc, item) => {
      const value = parseFloat(item.charge, 10);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    const mbl = parseFloat(AddEmployeeForm.values.Allocated_MBL, 10) || 0;
    const balance = mbl - totalReimbursement;
    setMBLBalance(balance);
  
    setTotalReimbursement(total);

  fetchData();
},[AddEmployeeForm.values.table , AddEmployeeForm.values.Allocated_MBL]);


const filteredStudents = checktable.filter((v) => {
if (!search) return true;
  const s = search.toLowerCase().trim();
  return (
    v.Name?.toLowerCase().includes(s) ||
    v.doc_id?.toLowerCase().includes(s) ||
    v.Details?.toLowerCase().includes(s) ||
    v.Particulars?.toLowerCase().includes(s) ||
    v.Diagnosis?.toLowerCase().includes(s)
  );
});


  return(
    <PageContainer outsideChildren={
      <LoadingOverlay
        loaderProps={{ type: "dots" }}
        visible={loadingPage}
      />
    } title="Employee"
     rightSection={
      <div className='flex items-center'>
        <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size={18} />}
            placeholder='Search'
          />
      </div>
     }
    >

    {/*Delete */}
     <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Delete Particulars</span>}
        opened={deleteState}
        onClose={() => {
          closedeleteState();
        }}
      >
        <div style={{ display: "flex" , justifyContent:'center'}}>
        <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={300}
              src='/images/Admin-Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={closedeleteState}>NO</Button>
          <Button
            onClick={DeleteRecords}
          >
            Yes
          </Button>
        </div>
      </Modal>

        {/*Add Employee  Modal*/}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Add Feedback</span>}
        size="1200px"
        opened={EmployeeAdd}
        onClose={() => {
          closeEmployee();
        }}
      >
        <div>
          <p style={{display:'flex' , justifyContent:'center' , fontSize:'20px' , fontWeight:'bold'}}>Medical Reimbursement Form</p>
        </div>
        <div style={{ display: "flex" , justifyContent: 'center', marginBottom:'5px' }}>
        </div>
        <form onSubmit={AddEmployeeForm.onSubmit(submitHandler)}>
        <div >
          <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' , marginBottom:'30px' }}>
            <TextInput
            label='Doc.ID'
              required
              {...AddEmployeeForm.getInputProps("doc")}
              radius='md'
              w="27%"
            />
            <TextInput
            label='Date Filed'
              required
              {...AddEmployeeForm.getInputProps("date_file")}
              radius='md'
               w="27%"
            />
             <Select
            label='Particulars'
              required
              {...AddEmployeeForm.getInputProps("particul")}
              radius='md'
               w="27%"
               data={['Employee' , 'Dependent']}
            />
            <TextInput
            label='If Employee Dependent'
              required
              {...AddEmployeeForm.getInputProps("employee_Dependet")}
              radius='md'
               w="27%"
            />
            
            </div>
            <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' }}>
            <TextInput
            label='Employee Name:'
              required
              {...AddEmployeeForm.getInputProps("ename")}
              radius='md'
              w="27%"
            />
            <TextInput
            label='Department:'
              required
              {...AddEmployeeForm.getInputProps("department")}
              radius='md'
               w="27%"
            />
            <TextInput
            label='Designation'
              required
              {...AddEmployeeForm.getInputProps("designation")}
              radius='md'
               w="27%"
            />
            <Select
            label='Medical Findings/Diagnosis'
              required
              {...AddEmployeeForm.getInputProps("diagnosis")}
              radius='md'
              data={Diagnosi.map((v) => {
                return v.label;
              })}
               w="27%"
            />
            
            </div>
            </div>
            <Table
            withTableBorder withColumnBorders
            striped
            highlightOnHover
            mt="md"
            style={{border:'1px solid black'}}
        >
          <thead style={{ backgroundColor: '#e4572e', color: 'white' }}>
            <tr>
              <th style={{ border: '1px solid #ccc' }}>Description</th>
              <th style={{ border: '1px solid #ccc' }}>Charges</th>
              <th style={{ border: '1px solid #ccc' }}>Billing Date</th>
              <th style={{ border: '1px solid #ccc' }}>Hospital</th>
              <th style={{ border: '1px solid #ccc' }}>Doctor</th>
            </tr>
          </thead>
          <tbody>
          {medicalDescriptions.map((label, rowIndex) => (
  <tr key={rowIndex}>
    <td style={{ border: '1px solid #ccc' }}>{label}</td>
    {['charge', 'billing', 'hospital', 'doctor'].map((columnKey) => (
      <td style={{ border: '1px solid #ccc' }} key={columnKey}>
        <TextInput
        
          variant="unstyled"
          {...AddEmployeeForm.getInputProps(`table.${rowIndex}.${columnKey}`)}
        />
      </td>
    ))}
  </tr>
))}
</tbody>
        </Table>
        <div style={{marginTop:'25px' , display: 'flex'}}>
          <label style={{fontSize:'15px' , fontWeight:'bold' }}>Total amount to reimbursement :</label>
          <TextInput  value={totalReimbursement} readOnly  size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>

          <label style={{fontSize:'15px' , fontWeight:'bold' , marginLeft:'250px'}}>Details :</label>
          <TextInput   size="md" {...AddEmployeeForm.getInputProps("details")} style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>
        </div>
        <div style={{display:'flex' , justifyContent: 'space-between' ,marginTop: '40px'}}>
           <label style={{fontSize:'15px' , fontWeight:'bold' }}>Allocated MBL :</label>
           <TextInput {...AddEmployeeForm.getInputProps("Allocated_MBL")} size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>

           <label style={{fontSize:'15px' , fontWeight:'bold' }}>Approved Reimbursement :</label>
           <TextInput  value={totalReimbursement} readOnly  size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>

           <label style={{fontSize:'15px' , fontWeight:'bold' }}>MBL Balance :</label>
           <TextInput value={MBLBalance} readOnly size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>
        </div>
          <div style={{display:'flex' , justifyContent:'center' , marginTop:'20px' , gap:'100px'}}>
          <Button
            
            className='Button-done'
            type='submit'
            style={{ width: "fit-content" }}
          >
            Add
          </Button>
          <Button
            
            className='Button-done'
            onClick={closeEmployee}
            color="red"
            style={{ width: "fit-content" }}
          >
            Cancel
          </Button>
          </div>
        </form>
      </Modal>

      {/*View Student */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Add Feedback</span>}
        size="1200px"
        opened={viewState}
        onClose={() => {
          
          resetfield();
        }}
      >
      {selectedemployee && (
        <div>
        <div>
          <p style={{display:'flex' , justifyContent:'center' , fontSize:'20px' , fontWeight:'bold'}}>Medical Reimbursement Form</p>
        </div>
        <div style={{ display: "flex" , justifyContent: 'center', marginBottom:'5px' }}>
        </div>
        <form onSubmit={AddEmployeeForm.onSubmit(submitHandler)}>
        <div >
          <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' , marginBottom:'30px' }}>
            <TextInput
            label='Doc.ID'
              required
              value={selectedemployee.doc_id}
              readOnly
              radius='md'
              w="27%"
            />
            <TextInput
            label='Date Filed'
              required
              value={selectedemployee.Date_File}
              readOnly
              radius='md'
               w="27%"
            />
             <TextInput
            label='Particulars'
              required
              value={selectedemployee.Particulars}
              readOnly
              radius='md'
               w="27%"
               data={['Employee' , 'Dependent']}
            />
            <TextInput
            label='If Employee Dependent'
              required
              value={selectedemployee.if_dependent}
              readOnly
              radius='md'
               w="27%"
            />
            
            </div>
            <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' }}>
            <TextInput
            label='Employee Name:'
              required
              value={selectedemployee.Name}
              readOnly
              radius='md'
              w="27%"
            />
            <TextInput
            label='Department:'
              required
              value={selectedemployee.department}
              readOnly
              radius='md'
               w="27%"
            />
            <TextInput
            label='Designation'
              required
              value={selectedemployee.designation}
              readOnly
              radius='md'
               w="27%"
            />
            <TextInput
            label='Medical Findings/Diagnosis'
              required
              value={selectedemployee.Diagnosis}
              readOnly
              radius='md'
               w="27%"
            />
            
            </div>
            </div>
            <Table
            withTableBorder withColumnBorders
            striped
            highlightOnHover
            mt="md"
            style={{border:'1px solid black'}}
        >
          <thead style={{ backgroundColor: '#e4572e', color: 'white' }}>
            <tr>
              <th style={{ border: '1px solid #ccc' }}>Description</th>
              <th style={{ border: '1px solid #ccc' }}>Charges</th>
              <th style={{ border: '1px solid #ccc' }}>Billing Date</th>
              <th style={{ border: '1px solid #ccc' }}>Hospital</th>
              <th style={{ border: '1px solid #ccc' }}>Doctor</th>
            </tr>
          </thead>
          <tbody>
          {medicalDescriptions.map((label, rowIndex) => (
  <tr key={rowIndex}>
    <td style={{ border: '1px solid #ccc' }}>{label}</td>
    {['charge', 'billing', 'hospital', 'doctor'].map((columnKey) => (
      <td style={{ border: '1px solid #ccc' }} key={columnKey}>
        <TextInput
          readOnly
          variant="unstyled"
          {...AddEmployeeForm.getInputProps(`table.${rowIndex}.${columnKey}`)}
        />
      </td>
    ))}
  </tr>
))}
</tbody>
        </Table>
        <div style={{marginTop:'25px' , display: 'flex'}}>
          <label style={{fontSize:'15px' , fontWeight:'bold' }}>Total amount to reimbursement :</label>
          <TextInput  value={selectedemployee.For_Reimbursement} readOnly  size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>

          <label style={{fontSize:'15px' , fontWeight:'bold' , marginLeft:'250px'}}>Details :</label>
          <TextInput   size="md" readOnly value={selectedemployee.Details} style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>
        </div>
        <div style={{display:'flex' , justifyContent: 'space-between' ,marginTop: '40px'}}>
           <label style={{fontSize:'15px' , fontWeight:'bold' }}>Allocated MBL :</label>
           <TextInput value={selectedemployee.Current_MBL} size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>

           <label style={{fontSize:'15px' , fontWeight:'bold' }}>Approved Reimbursement :</label>
           <TextInput  value={selectedemployee.For_Reimbursement} readOnly  size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>

           <label style={{fontSize:'15px' , fontWeight:'bold' }}>MBL Balance :</label>
           <TextInput value={selectedemployee.Remaining_MBL} readOnly size="md" style={{marginTop:'-10px',marginLeft:'10px'  }}></TextInput>
        </div>
        </form>
        </div>

      )}
       
        
      </Modal>


    <div>
    
      <div style={{}}>
      <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'space-between',
            marginBottom:'10px',
          }}
        >
        
      <Button
        size='xs'
        leftSection={<IconTrash size={19} />}
        mb={10}
       color="red"
       onClick={() => {opendeleteState();}}
       
      >
        Delete
      </Button>
          <Button
            size='xs'
            leftSection={<IconPlus size={18} />}
            onClick={() => {openEmployee();}}
            
          >
            Add Employee
          </Button>

        </div>
       <Table  striped highlightOnHover withTableBorder withColumnBorders>
         <Table.Thead>
            <Table.Tr style={{fontWeight: 'bold' , fontSize: '20px'}}>
            <Table.Th w={10}>
              <Checkbox
                checked={filteredStudents.every((v) => v.checked)}
                onChange={(e) => {
                  setchecktable((curr) =>
                    curr.map((v) => {
                      if (search && filteredStudents.length > 0) {
                        if (filteredStudents.some((fs) => fs.id === v.id)) {
                          return { ...v, checked: e.currentTarget.checked };
                        }
                        return v;
                      }
                      
                      return { ...v, checked: e.currentTarget.checked  } ;
                      
                    }),
                  );
                }}
              />
            </Table.Th>
              <Table.Th>MRF</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Particulars</Table.Th>
              <Table.Th>Diagnosis</Table.Th>
              <Table.Th>Details</Table.Th>
              <Table.Th>Hospital</Table.Th>
              <Table.Th>Billing Date</Table.Th>
              <Table.Th>Date File</Table.Th>
              <Table.Th>Current MBL</Table.Th>
              <Table.Th>For Reimbursement</Table.Th>
              <Table.Th>Remaining</Table.Th>
              <Table.Th>View</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredStudents
            .sort((a, b) => a.doc_id - b.doc_id)
            .map((v) => {
              return (
                <Table.Tr style={{verticalAlign: "top"}} key={v.id}> 
                <Table.Td>
                  <Checkbox
                    onChange={(e) => {
                      setchecktable((curr) =>
                        curr.map((vc) => {
                          if (vc.id === v.id) {
                            return { ...vc, checked: e.currentTarget.checked };
                          }
                          return vc;
                        }),
                      );
                    }}
                    checked={v.checked}
                  />
                </Table.Td>
                <Table.Td>{v.doc_id}</Table.Td>
                <Table.Td>{v.Name}</Table.Td>
                <Table.Td>{v.Particulars}</Table.Td>
                <Table.Td>{v.Diagnosis}</Table.Td>
                <Table.Td>{v.Details}</Table.Td>
                <Table.Td>{v.con_hospital} {v.lab_hospital} {v.hos_hospital} {v.op_hospital} {v.other_hospital}</Table.Td>
                <Table.Td>{v.Billing_Date}</Table.Td>
                <Table.Td>{v.Date_File}</Table.Td>
                <Table.Td>{v.Current_MBL}</Table.Td>
                <Table.Td>{v.For_Reimbursement}</Table.Td>
                <Table.Td>{v.Remaining_MBL}</Table.Td>
                <Table.Td>
                  <ActionIcon
                    onClick={() => {
                      setSelectedemployee(v);
                      AddEmployeeForm.setValues({
                       ...v,
                       table: getTableFromSelectedEmployee(v),
                       });
                      openviewState();
                    }}
                    variant='subtle'
                    color='dark'
                  >
                    <IconDotsVertical size={20} />
                  </ActionIcon>
                </Table.Td>
        </Table.Tr>
              )
            })}
          </Table.Tbody>
       </Table>
      </div>
    </div>
    </PageContainer>
  );
  
}

export default Settings;
