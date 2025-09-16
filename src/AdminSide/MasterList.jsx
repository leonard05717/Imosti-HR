import { ActionIcon, AspectRatio, Button, Checkbox, Flex, LoadingOverlay, Modal, Select, Table, TextInput  , Image, NumberInput} from "@mantine/core";
import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import PageContainer from "../components/PageContainer";
import { IconDotsVertical, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

function Setting() {
  const [EmployeeAdd,{ open: openEmployee, close: closeEmployee },] = useDisclosure(false) 
  const [EmployeeReport , setEmployeeReport] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [search, setSearch] = useState("");
  const [editedData, setEditedData] = useState({});

  const AddEmployeeForm = useForm({
    mode: "controlled",
    initialValues: {
      employee_no:'',
      name:'',
      date_hired:'',
      category:'',
      position:'',
      department:'',
      address:'',
      birthday:'',
      contact:'',
      sss:'',
      tin:'',
      pagibig:'',
      philhealth:'',
    },
  });

  async function submitHandler(v) {
    try{
      setLoadingPage(true)
  
      const { error: insertError } = await supabase.from("Masterlist").insert({
        created_at: new Date(),
        employee_no:v.employee_no,
        name:v.name,
        date_hired:v.date_hired,
        category:v.category,
        position:v.position,
        department:v.department,
        address:v.address,
        birthday:v.birthday,
        contact:v.contact,
        sss:v.sss,
        tin:v.tin,
        pagibig:v.pagibig,
        philhealth:v.philhealth,
        status:"active",
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

  const handleInputChange = (id, newValue) => {
    setEditedData(prev => ({
      ...prev,
      [id]: newValue
    }));
  };

  const updateToDatabase = async (id) => {
    const newValue = editedData[id];
    if (!newValue) return;
  
    const { error } = await supabase
      .from('Masterlist')
      .update({ remarks: newValue })  // Change `remarks` to your column
      .eq('id', id);
  
    if (error) {
      alert("Update failed: " + error.message);
    } else {
      fetchData(); // Optional: refresh data
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoadingPage(true);
      const { error } = await supabase
        .from('Masterlist')
        .update({ status: newStatus }) 
        .eq('id', id);                
  
      if (error) throw error;
  
     
      setEmployeeReport(prev =>
        prev.map(emp =>
          emp.id === id ? { ...emp, status: newStatus } : emp
        )
      );
      fetchData();
    } catch (error) {
      window.alert('Error updating status: ' + error.message);
    } finally {
      setLoadingPage(false);
    }

  };

  async function fetchData() {
    try {
    setLoadingPage(true);
    const list = (await supabase.from("Masterlist").select()).data;

    setEmployeeReport(list);
     } catch (error) {
    window.alert(error.toString());
  } finally {
    setLoadingPage(false);
  }
  }

  useEffect(() => {
    fetchData();
  }, []);



  
  return (
    <PageContainer outsideChildren={
      <LoadingOverlay
        loaderProps={{ type: "dots" }}
        visible={loadingPage}
      />
    } title="Master List"
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
        <div style={{marginBottom:'20px'}}>
          <p style={{display:'flex' , justifyContent:'center' , fontSize:'20px' , fontWeight:'bold'}}>Add Employee</p>
        </div>
        <div style={{ display: "flex" , justifyContent: 'center', marginBottom:'5px' }}>
        </div>
        <form onSubmit={AddEmployeeForm.onSubmit(submitHandler)}>
        <div >
          <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' , marginBottom:'30px' }}>
            <TextInput
            label='Employee No'
              required
              {...AddEmployeeForm.getInputProps("employee_no")}
              radius='md'
              w="27%"
            />
            <TextInput
            label='Name'
              required
              {...AddEmployeeForm.getInputProps("name")}
              radius='md'
               w="27%"
            />
             <TextInput
            label='Date Hired'
              required
              {...AddEmployeeForm.getInputProps("date_hired")}
              radius='md'
               w="27%"
               
            />
            <TextInput
            label='Category'
              required
              {...AddEmployeeForm.getInputProps("category")}
              radius='md'
               w="27%"
            />
            
            </div>
            <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' , marginBottom:'30px'  }}>
            <TextInput
            label='Position'
              required
              {...AddEmployeeForm.getInputProps("position")}
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
            label='Address'
              required
              {...AddEmployeeForm.getInputProps("address")}
              radius='md'
               w="27%"
            />
            <TextInput
            label='Birthday'
              required
              {...AddEmployeeForm.getInputProps("birthday")}
              radius='md'
               w="27%"
            />
            
            </div>
            <div style={{display: 'flex' , justifyContent:'space-evenly' , gap:'10px' , marginBottom:'30px'  }}>
            <NumberInput
            label='Contact No'
              required
              {...AddEmployeeForm.getInputProps("contact")}
              maxLength={11}
              hideControls
              radius='md'
              w="27%"
            />
            <TextInput
            label='SSS:'
              required
              {...AddEmployeeForm.getInputProps("sss")}
              radius='md'
               w="27%"
            />
            <TextInput
            label='TIN'
              required
              {...AddEmployeeForm.getInputProps("tin")}
              radius='md'
               w="27%"
            />
            <TextInput
            label='PagIbig'
              required
              {...AddEmployeeForm.getInputProps("pagibig")}
              radius='md'
               w="27%"
            />
            
            </div>
            <div style={{display:'flex' , justifyContent:'center' , marginBottom:'50px'}}>
               <TextInput
               label='PhilHealth'
              required
              {...AddEmployeeForm.getInputProps("philhealth")}
              radius='md'
               w="27%"
            />
          </div>
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
          leftSection={<IconPlus size={18} />}
          onClick={() => {openEmployee() , AddEmployeeForm.reset();}}
          
        >
          Add Employee
        </Button>

      </div>
     <Table  striped highlightOnHover withTableBorder withColumnBorders>
       <Table.Thead>
          <Table.Tr style={{fontWeight: 'bold' , fontSize: '20px'}}>
            <Table.Th>No</Table.Th>
            <Table.Th>Employee No</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Date Hired</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Position</Table.Th>
            <Table.Th>Department</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Birthday</Table.Th>
            <Table.Th>Contact No</Table.Th>
            <Table.Th>SSS</Table.Th>
            <Table.Th>TIN</Table.Th>
            <Table.Th>Pagibig</Table.Th>
            <Table.Th>Philhealth</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Effective Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
         {EmployeeReport.filter((c) => {
                if (!search) return true;
                const text = search.toLowerCase().trim();
                return (
                  c.employee_no.toLowerCase().includes(text) ||
                  c.name.toLowerCase().includes(text) ||
                  c.status.toLowerCase().includes(text) ||
                  c.category.toLowerCase().includes(text) ||
                  c.position.toLowerCase().includes(text) ||
                  c.department.toLowerCase().includes(text) ||
                  c.address.toLowerCase().includes(text) 
                );
              }).sort((a, b) => a.employee_no - b.employee_no)
         .map((v) => {
          return(
            <Table.Tr key={v.id} > 
              <Table.Td>{v.id}</Table.Td>
              <Table.Td>{v.employee_no}</Table.Td>
              <Table.Td>{v.name}</Table.Td>
              <Table.Td>{v.date_hired}</Table.Td>
              <Table.Td>{v.category}</Table.Td>
              <Table.Td>{v.position}</Table.Td>
              <Table.Td>{v.department}</Table.Td>
              <Table.Td>{v.address}</Table.Td>
              <Table.Td>{v.birthday}</Table.Td>
              <Table.Td>{v.contact}</Table.Td>
              <Table.Td>{v.sss}</Table.Td>
              <Table.Td>{v.tin}</Table.Td>
              <Table.Td>{v.pagibig}</Table.Td>
              <Table.Td>{v.philhealth}</Table.Td>
              <Table.Td> <Select
                    value={v.status}
                    data={['Termination', 'Retairment', 'Resign']}
                    onChange={(newStatus) => handleStatusChange(v.id, newStatus)}
                   /></Table.Td>
              <Table.Td><TextInput
                    value={editedData[v.id] ?? v.remarks}
                    onChange={(e) => handleInputChange(v.id, e.target.value)}
                    onBlur={() => updateToDatabase(v.id)}
                 /></Table.Td>
            </Table.Tr>

          )
         })}

        </Table.Tbody>
     </Table>
    </div>
  </div>
  </PageContainer>

  )
}

export default Setting