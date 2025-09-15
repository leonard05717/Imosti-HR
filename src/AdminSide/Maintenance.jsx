import React, { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import {
    ActionIcon,
    AspectRatio,
    Button,
    Card,
    Image,
    Input,
    Loader,
    LoadingOverlay,
    Modal,
    Table,
    Text,
    TextInput,
  } from "@mantine/core";
  import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
  import supabase, { getAccount } from "../supabase";
  import { useDisclosure } from "@mantine/hooks";
  import { useForm } from "@mantine/form";

function Maintenance() {
    const [ParticularsAdd,{ open: openParticularsAdd, close: closeParticularsAdd },] = useDisclosure(false);
    const [deleteParticularState,{ open: opendeleteParticularState, close: closedeleteParticularState },] = useDisclosure(false);
    const [selectedParticular, setselectedParticular] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteparticularsLoading, setdeleteparticularsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);

    const [Parti, setParti] = useState([]);
    const [Diagnosis, setDiagnosis] = useState([]);
    const [selector , setselector] = useState("");

    const ParticularsForm = useForm({
        mode: "controlled",
        initialValues: {
          label: "",
          value:'',
        
        },
      });

      const Medicalform = useForm({
        mode: "controlled",
        initialValues: {
          Budget: "",
        },
      });

      const [previousValues, setPreviousValues] = useState({
        Budget: "",
      });

      async function submitparticulars(parts) {
        try {
          
          if(parts.value ==="" || parts.label ===""){
            alert("Input label or acronym")
            return ;
          }
        if(selector === "Diagnosis"){
            setSubmitLoading(true);
          const { error: insertError } = await supabase
            .from("diagnosis")
            .insert({
              label: parts.label,
              value: parts.value,
              created_at: new Date(),
            });

            await fetchData();
            alert("Success");
            ParticularsForm.setFieldValue("label", "");
            ParticularsForm.setFieldValue("value", "");
            setselector("");
            closeParticularsAdd()
            console.log("Success");
            setSubmitLoading(false);
        }
        else{
            setSubmitLoading(true);
            const { error: insertError } = await supabase
            .from("particulars")
            .insert({
              label: parts.label,
              value: parts.value,
              created_at: new Date(),
            });

            await fetchData();
            alert("Success");
            ParticularsForm.setFieldValue("label", "");
            ParticularsForm.setFieldValue("value", "");
            setselector("");
            closeParticularsAdd()
            console.log("Success");
            setSubmitLoading(false);
        }

          if (insertError) {
            console.log(`Something Error: ${insertError.message}`);
            return;
          }
        
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitLoading(false);
        }
      }

      async function deleteParticularsHandler() {
        try {
          
        if (!selectedParticular){
            setselector("");
            return;
        };
        if(selector === "Diagnosis"){
        
            setdeleteparticularsLoading(true);
            const { error: deleteError } = await supabase
              .from("diagnosis")
              .delete()
              .eq("id", selectedParticular);
        
            if (deleteError) {
                setdeleteparticularsLoading(false);
              console.log(`Something Error: ${deleteError.message}`);
              return;
            }
            await fetchData();
            closedeleteParticularState();
            setselector("");
            setselectedParticular("");
            console.log("Delete Success");
            setdeleteparticularsLoading(false);
        }
        else
        {

        setdeleteparticularsLoading(true);
        const { error: deleteError } = await supabase
          .from("particulars")
          .delete()
          .eq("id", selectedParticular);
    
        if (deleteError) {
            setdeleteparticularsLoading(false);
          console.log(`Something Error: ${deleteError.message}`);
          return;
        }
        await fetchData();
        closedeleteParticularState();
        setselectedParticular("");
        setselector("");
        console.log("Delete Success");
        setdeleteparticularsLoading(false);
        }
         } catch (error) {
        console.error(error);
         } finally {
        setSubmitLoading(false);
        }
      }

      async function submitmedicEventHandler(values) {
        try {
          setLoading(true);
          const { error } = await supabase
            .from("medical")
            .update({ value: values.Budget })
            .eq("id", "1");
          if (error) {
            return window.alert("Failed to update storage");
          }
          setPreviousValues(values);
        } catch (error) {
          console.error(error);
          window.alert(error.toString());
        } finally {
          setLoading(false);
        }
      }

    async function fetchData() {
        try {
        setLoadingPage(true);
        const part = (await supabase.from("particulars").select()).data;
        const diag = (await supabase.from("diagnosis").select()).data;
        const medic = (await supabase.from("medical").select()).data;
        const { value: Budgets } = (
            await supabase
              .from("medical")
              .select("value")
              .eq("id", "1")
              .single()
          ).data;
          setPreviousValues({
            Budgets,
          });
          Medicalform.setFieldValue("Budget", Budgets);
        setParti(part);
        setDiagnosis(diag);
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
    <PageContainer>

    {/*particulart Add */}
    <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Add Feedback</span>}
        opened={ParticularsAdd}
        onClose={() => {
            closeParticularsAdd();
        }}
      >
        <div style={{ display: "flex" , justifyContent: 'center', marginBottom:'5px' }}>
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
        <form onSubmit={ParticularsForm.onSubmit(submitparticulars)}>
          <div className='Response'>
            <TextInput
              required
              id='addparticulars'
              {...ParticularsForm.getInputProps("value")}
              radius='md'
              placeholder='Enter acronym'
            />
            </div>
            <div className='Response' style={{marginTop:'10px' , marginBottom:'10px'}}>
            <TextInput
              required
              id='addparticulars'
              {...ParticularsForm.getInputProps("label")}
              radius='md'
              placeholder='Enter label'
            />
          </div>
          <Button
            loading={submitLoading}
            className='Button-done'
            type='submit'
            style={{ width: "fit-content" }}
          >
            Add
          </Button>
        </form>
      </Modal>

      {/* delete Particulars */}
      <Modal
        radius={20}
        centered='true'
        title={<span style={{ color: "white" , paddingLeft: '155px' }}>Delete Particulars</span>}
        opened={deleteParticularState}
        onClose={() => {
            closedeleteParticularState();
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
          <Button onClick={closedeleteParticularState}>NO</Button>
          <Button
            onClick={deleteParticularsHandler}
            loading={deleteparticularsLoading}
          >
            Yes
          </Button>
        </div>
      </Modal>


    
        <div>

        {/*Particulars*/}
        <div
        style={{
          border: "2px solid black",
          padding: 20,
          marginBottom: 50,
        }}
      >
        <Text
          ta='center'
          fw='bold'
          size='xl'
        >
            Particulars
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            size='xs'
            leftSection={<IconPlus size={18} />}
            onClick={() => {
                ParticularsForm.setValues({
                label: "",
                value:'',
              });
              openParticularsAdd();
            }}
          >
            Add Particulars
          </Button>
        </div>
        <div style={{ marginTop: 10 }}>
          {Parti.map((c, ii) => {
            return (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #0005",
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Text size='md'>
                  {ii + 1}. <Text span fw={700} transform="uppercase">{c.value}</Text> - {c.label}
                </Text>
                <ActionIcon
                  onClick={() => {
                    setselectedParticular(c.id);
                    opendeleteParticularState();
                  }}
                  color='red'
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </div>
            );
          })}
        </div>
      </div>

      {/*Diagnosis*/}
      <div
        style={{
          border: "2px solid black",
          padding: 20,
          marginBottom: 50,
        }}
      >
        <Text
          ta='center'
          fw='bold'
          size='xl'
        >
            Diagnosis
        </Text>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >

          <Button
            size='xs'
            leftSection={<IconPlus size={18} />}
            onClick={() => {
                ParticularsForm.setValues({
                label: "",
                value:'',
              });
              openParticularsAdd();
              setselector("Diagnosis");
            }}
          >
            Add Particulars
          </Button>
        </div>
        <div style={{ marginTop: 10 }}>
          {Diagnosis.map((c, ii) => {
            return (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #0005",
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Text size='md'>
                  {ii + 1}. <Text span fw={700} transform="uppercase">{c.value}</Text> - {c.label}
                </Text>
                <ActionIcon
                  onClick={() => {
                    setselectedParticular(c.id);
                    opendeleteParticularState();
                    setselector("Diagnosis");
                  }}
                  color='red'
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </div>
            );
          })}
        </div>
      </div>

     {/*Medical Budget*/}
      <Card
        withBorder
        shadow='md'
      >
        <form onSubmit={Medicalform.onSubmit(submitmedicEventHandler)}>
          <Text
            ff='montserrat-black'
            size='lg'
          >
            Medical Reimbursement Budget
          </Text>
          <Table
            layout='fixed'
            withColumnBorders
            style={{
              verticalAlign: "auto",
            }}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Allocation Budget:</Table.Th>
                <Table.Td>
                  <TextInput
                    leftSection={
                      loadingPage && (
                        <Loader
                          color='dark'
                          size='xs'
                        />
                      )
                    }
                    variant='unstyled'
                    {...Medicalform.getInputProps("Budget")}
                    style={{
                      borderBottom: "1px solid #0004",
                    }}
                  />
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <div className='pt-2 text-right'>
            <Button
              type='submit'
              loading={loading}
              disabled={
                loading ||
                !Medicalform.values.Budget?.trim() ||
                (Medicalform.values.Budget ===
                  previousValues.Budget)
              }
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

        </div>
    </PageContainer>
  )
}

export default Maintenance