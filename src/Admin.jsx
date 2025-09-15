import { useEffect, useState } from "react";
import "./Admin.css";
import supabase from "./supabase";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Checkbox,
  ActionIcon,
  Grid,
  Modal,
  AspectRatio,
  Image,
  Input,
  ModalTitle,
  px,
  Tabs,
  Table,
  ThemeIcon,
  Paper,
  ScrollArea,
  Avatar,
  FileButton,
  PasswordInput,
  Text,
  Divider,
  Alert,
} from "@mantine/core";
import {
  IconBrandBlackberry,
  IconCalendar,
  IconCertificate,
  IconChartHistogram,
  IconDotsVertical,
  IconEdit,
  IconExposureMinus1,
  IconMassage,
  IconMessage2Cog,
  IconPlus,
  IconRowInsertBottom,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUser,
  IconUserMinus,
  IconUserShare,
} from "@tabler/icons-react";

import { DatePicker, DatePickerInput } from "@mantine/dates";
import { BarChart, Label, PieChart } from "recharts";
import { data, useNavigate } from "react-router-dom";
import { keys, reduceRight, size } from "lodash";
import { AreaChart } from "@mantine/charts";
import "@mantine/core/styles.css";
import { requestFormReset } from "react-dom";
import Analytics from "./pages/Analytics";

function Admin() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenstaff, setIsModalOpenstaff] = useState(false);
  const [isModalOpenVerify, setIsModalOpenVerify] = useState(false);
  const [StaffS, setStaffS] = useState(false);
  const [Logout, setLogout] = useState(false);
  const [modalstudent, setIsModalOpenStudent] = useState(false);
  const [CourseModal, setCourseModal] = useState(false);
  const [IDs, setID] = useState("");
  const [anyQuesttrow, setQ] = useState("");
  const [Criteriatrow, setCriteriatrow] = useState("");
  const [erorrAddstaff, seterrorAddstaff] = useState("");

  const [IDStaff, setIDStaff] = useState("");
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [scores, setScores] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [StudID, setStudID] = useState([]);
  const [QuestionData, setQuestionData] = useState([]);
  const [StartvaluenowDate, SetStartvaluenowDate] = useState("");
  const [EndvaluenowDate, SetEndvaluenowDate] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [stafflog, setstafflog] = useState([]);

  const [Lname, SetFName] = useState("");
  const [FName, SetLName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Number, SetNumber] = useState("");
  const [Role, SetRole] = useState("");
  const [Password, SetPassword] = useState("");
  const [ConPassword, SetConPassword] = useState("");

  const FNameTrasfer = (event) => {
    SetFName(event.target.value);
  };
  const LNameTrasfer = (event) => {
    SetLName(event.target.value);
  };
  const EmailTrasfer = (event) => {
    SetEmail(event.target.value);
  };
  const NumberTrasfer = (event) => {
    SetNumber(event.target.value);
  };
  const RoleTrasfer = (event) => {
    SetRole(event.target.value);
  };
  const PasswordTrasfer = (event) => {
    SetPassword(event.target.value);
  };
  const ConPasswordTrasfer = (event) => {
    SetConPassword(event.target.value);
  };

  async function AddStaffModal() {
    if (
      !FName ||
      !Lname ||
      !Email ||
      !Role ||
      !Number ||
      !Password ||
      !ConPassword
    ) {
      console.log("required");
    } else {
      if (Password == ConPassword) {
        const { data: singeData, error: StaffError } = await supabase
          .from("Staff-Info")
          .insert({
            First_Name: FName,
            Last_Name: Lname,
            Email: Email,
            Role: Role,
            Contact: Number,
            Password: Password,
            Status: "Active",
          })
          .select("*")
          .single();

        loadData();
        setIsModalOpenstaff(false);

        if (StaffError) {
          console.log(StaffError.message);
          return;
        }
      } else {
        console.log("password not match");
        seterrorAddstaff("password not match");
      }
    }
  }

  async function logoutevent() {
    window.localStorage.setItem("data", JSON.stringify(""));
    navigate("/LoginPage");
  }

  async function StaffAc(id) {
    setIDStaff(id);
    setStaffS(true);
  }

  const [selectedPanel, setSelectedPanel] = useState("Analytics");

  async function handleID(id) {
    setID(id);
    setIsModalOpenVerify(true);
  }

  async function Identify(AnyQuest) {
    setQ(AnyQuest);
    setIsModalOpen(true);
  }

  const [Staff, setStaff] = useState([
    {
      id: "",
      First_name: "",
      Last_Name: "",
      Email: "",
      Contact: "",
      Role: "",
      Status: "",
      Password: "",
    },
  ]);

  const [Coursetable, setCoursetable] = useState([
    {
      Course: "",
      Code: "",
      id: 0,
    },
  ]);

  async function StaffStatus(ActiveStat) {
    console.log("Loading..");
    await supabase
      .from("Staff-Info")
      .update({
        Status: ActiveStat,
      })
      .eq("id", IDStaff);
    StaffLoadData();
    setIDStaff("");
    setStaffS(false);
    console.log("Edit Success");
  }

  const rows = Staff.map((element) => (
    <Table.Tr>
      <Table.Td>{element.First_Name}</Table.Td>
      <Table.Td>{element.Last_Name}</Table.Td>
      <Table.Td>{element.Email}</Table.Td>
      <Table.Td>{element.Contact}</Table.Td>
      <Table.Td>{element.Role}</Table.Td>
      <Table.Td>
        {element.Status == "Active" ? (
          <div>
            <Button
              variant='filled'
              color='rgb(110, 193, 228)'
              onClick={() => {
                StaffAc(element.id);
              }}
            >
              {element.Status}
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant='filled'
              color='rgb(255, 105, 0)'
              onClick={() => {
                StaffAc(element.id);
              }}
            >
              {element.Status}
            </Button>
          </div>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  const Studrow = students
    .filter((v) => v.course_id?.toString() === selectedCourseId)
    .map((stud) => {
      return (
        <Table.Tr key={stud.name}>
          <Table.Td>{stud.id}</Table.Td>
          <Table.Td>{stud.Name}</Table.Td>
          <Table.Td>{stud.TrainingD}</Table.Td>
          <Table.Td>{stud.Reg}</Table.Td>
          <Table.Td>{stud.Instructor}</Table.Td>
          <Table.Td>{stud.DateN}</Table.Td>
          <Table.Td>
            <ActionIcon
              onClick={() => {
                setStudID(stud.id.toString());
                setIsModalOpenStudent(true);
              }}
              variant='transparent'
              radius='xs'
              color='black'
              aria-label='Settings'
            >
              <IconDotsVertical
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      );
    });

  const CourseRow = Coursetable.map((element) => (
    <Table.Tr>
      <Table.Td>{element.Code}</Table.Td>
      <Table.Td
        style={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedCourseId(element.id.toString());
          setSelectedPanel("Course-List");
        }}
      >
        {element.Course}
      </Table.Td>
      <Table.Td>
        <ActionIcon
          onClick={() => {
            setSelectedCourseId(element.id.toString());
            setCourseModal(true);
          }}
          variant='transparent'
          radius='xs'
          color='black'
          aria-label='Settings'
        >
          <IconDotsVertical
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  const header = (
    <div
      style={{
        height: 94,
        backgroundColor: "	rgb(255, 105, 0)",
        border: "5px solid 	rgb(255, 105, 0)",
        marginTop: "-3px",
      }}
    >
      <h2 style={{ marginLeft: "30px", display: "flex", color: "white" }}>
        Course
        <Input
          style={{
            display: "flex",
            marginLeft: "420px",
            justifyContent: "center",
          }}
          leftSection={<IconSearch size={16} />}
          variant='filled'
          size='md'
          radius='xl'
          placeholder='Search'
        />
        <label style={{ marginLeft: "400px", marginTop: "5px" }}>
          {stafflog
            .filter((v) => v.Role === adminData.Role && v.id === adminData.id)
            .map((c) => {
              return c.Role;
            })}
        </label>
        <ThemeIcon
          size='xl'
          color='tranfarent'
          autoContrast
        >
          <IconUser size={30} />
        </ThemeIcon>
      </h2>
    </div>
  );

  const [QuestionQues, setQuestion] = useState([
    {
      Question: "",
      Criteria: "",
      id: 0,
    },
  ]);

  const [QuestionB, setQuestionB] = useState([
    {
      Question: "",
    },
  ]);
  const [QuestionC, setQuestionC] = useState([
    {
      Question: "",
    },
  ]);

  const [QuestionD, setQuestionD] = useState([
    {
      Question: "",
    },
  ]);

  const [Feedback, setFeedback] = useState([
    {
      QuestionFeedback: "",
    },
  ]);

  async function StaffLoadData() {
    const { error, data } = await supabase.from("Staff-Info").select();
    setStaff(data);
  }

  async function CourseRowLoad() {
    const { error, data } = await supabase.from("Course").select();
    setCoursetable(data);
  }

  async function loadData() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "A");
    const { data: studentData } = await supabase.from("Info-Training").select();
    const { data: scoreData } = await supabase
      .from("scores")
      .select("*, question:Questioner(*), traning:Info-Training(*)");
    const { data: feedbackData } = await supabase
      .from("feedback_answer")
      .select("*, feedback:Feedback-Question(*)");
    const { data: QuestionData } = await supabase.from("Questioner").select();
    const { data: StaffDetails } = await supabase.from("Staff-Info").select();
    setstafflog(StaffDetails);
    setScores(scoreData);
    setQuestionData(QuestionData);
    setQuestion(data);
    setFeedbacks(feedbackData);
    setStudents(studentData);
  }

  async function loadDataB() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "B");
    setQuestionB(data);
  }
  async function loadDataC() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "C");
    setQuestionC(data);
  }
  async function loadDataD() {
    const { error, data } = await supabase
      .from("Questioner")
      .select("id,Question")
      .eq("Criteria", "C");
    setQuestionD(data);
  }
  async function Feedbackload() {
    const { error, data } = await supabase.from("Feedback-Question").select();
    setFeedback(data);
  }

  async function submit1() {
    const QuestionAdd = document.getElementById("AddQuestion").value;

    if (!QuestionAdd) {
      return alert("All field is required");
    }

    if (anyQuesttrow == "Questioner") {
      const { error } = await supabase.from(anyQuesttrow).insert({
        Question: QuestionAdd,
        Criteria: Criteriatrow,
      });
      if (error) {
        console.log(error.message);
      } else {
        document.getElementById("AddQuestion").value = "";
        setQ("");

        loadData();
        loadDataB();
        loadDataC();
        loadDataD();
        Feedbackload();
        console.log("Success!");
        setIsModalOpen(false);
      }
    } else {
      const { error } = await supabase.from(anyQuesttrow).insert({
        QuestionFeedback: QuestionAdd,
      });

      if (error) {
        console.log(error.message);
      } else {
        document.getElementById("AddQuestion").value = "";
        setQ("");

        loadData();
        loadDataB();
        loadDataC();
        loadDataD();
        Feedbackload();
        console.log("Success!");
        setIsModalOpen(false);
      }
    }
  }

  async function deleteQuestion1() {
    await supabase.from(anyQuesttrow).delete().eq("id", IDs);
    await loadData();
    await loadDataB();
    await loadDataC();
    await loadDataD();
    await Feedbackload();
    setIsModalOpenVerify(false);
    console.log("Delete Success");
    setID("");
    setQ("");
  }

  useEffect(() => {
    loadData();
    loadDataB();
    loadDataC();
    loadDataD();
    StaffLoadData();
    Feedbackload();
    CourseRowLoad();

    const localStorageData = window.localStorage.getItem("data");
    setAdminData(JSON.parse(localStorageData));

    const sectionSubscription = supabase
      .channel("realtime:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "A.Services" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestion((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestion((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestion((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const sectionSubscriptionB = supabase
      .channel("realtime:B.Facilities")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "B.Facilities" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestionB((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestionB((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestionB((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const sectionSubscriptionC = supabase
      .channel("realtime:C.Course")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "C.Course" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestionC((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestionC((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestionC((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const sectionSubscriptionD = supabase
      .channel("realtime:D.Instructor")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "D.Instructor" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setQuestionD((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setQuestionD((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setQuestionD((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const Staffselection = supabase
      .channel("realtime:Staff")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Staff-Info" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            StaffLoadData((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            StaffLoadData((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            StaffLoadData((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const sectionSubscriptionFeed = supabase
      .channel("realtime:Feedback-Question")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Feedback-Question" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFeedback((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setFeedback((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setFeedback((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    const sectionCourseRow = supabase
      .channel("realtime:Course")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Course" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCoursetable((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setCoursetable((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setCoursetable((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sectionSubscription);
      supabase.removeChannel(sectionSubscriptionB);
      supabase.removeChannel(sectionSubscriptionC);
      supabase.removeChannel(sectionSubscriptionD);
      supabase.removeChannel(Staffselection);
      supabase.removeChannel(sectionSubscriptionFeed);
      supabase.removeChannel(sectionCourseRow);
    };
  }, []);

  return (
    <>
      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'>
          <Input
            id='AddQuestion'
            radius='md'
            placeholder='Enter Question'
          />
        </div>
        <Button
          className='Button-done'
          onClick={submit1}
        >
          Add
        </Button>
      </Modal>

      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={isModalOpenVerify}
        onClose={() => {
          setIsModalOpenVerify(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            onClick={() => {
              setIsModalOpenVerify(false);
            }}
          >
            NO
          </Button>
          <Button onClick={deleteQuestion1}>Yes</Button>
        </div>
      </Modal>

      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={StaffS}
        onClose={() => {
          setStaffS(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            color='rgb(110, 193, 228)'
            onClick={() => {
              StaffStatus("Active");
            }}
          >
            Active
          </Button>
          <Button
            color='rgb(255, 105, 0)'
            onClick={() => {
              StaffStatus("InActive");
            }}
          >
            InActive
          </Button>
        </div>
      </Modal>

      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={modalstudent}
        onClose={() => {
          setIsModalOpenStudent(false);
        }}
      >
        <ScrollArea style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <div>
              <h2>Survey Details</h2>
              <p>
                {Coursetable.filter(
                  (v) => v.id.toString() === selectedCourseId,
                ).map((sc) => {
                  return (
                    <div>
                      <strong>Course -</strong> {sc.Course}
                    </div>
                  );
                })}
              </p>

              {/*Selectoion for Services*/}
              {students
                .filter((v) => v.course_id?.toString() === selectedCourseId)
                .filter((a) => a.id?.toString() === StudID)
                .filter((c) => c.id?.toString() === StudID)
                .map((stud) => {
                  return (
                    <div>
                      <h3 className='font-semibold text-gray-800 mb-2'>
                        A . Services
                      </h3>
                      {scores
                        .filter(
                          (v) =>
                            v.training_id.toString() === stud.id.toString(),
                        )
                        .filter((c) => c.question.Criteria === "A")
                        .filter((b) => b.training_id?.toString() === StudID)
                        .map((sc) => {
                          return (
                            <div>
                              <div className='mb-6'>
                                <ul className='space-y-1 pl-4'>
                                  <li className='Questiong-answer'>
                                    <span>{sc.question.Question}</span>
                                    <span>{sc.score}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}

              {/*Selectoion for Facilities*/}
              {students
                .filter((v) => v.course_id?.toString() === selectedCourseId)
                .filter((c) => c.id?.toString() === StudID)
                .map((stud) => {
                  return (
                    <div>
                      <h3 className='font-semibold text-gray-800 mb-2'>
                        B . Facilities
                      </h3>
                      {scores
                        .filter(
                          (v) =>
                            v.training_id.toString() === stud.id.toString(),
                        )
                        .filter((c) => c.question.Criteria === "B")
                        .filter((b) => b.training_id?.toString() === StudID)
                        .map((sc) => {
                          return (
                            <div>
                              <div className='mb-6'>
                                <ul className='space-y-1 pl-4'>
                                  <li className='Questiong-answer'>
                                    <span>{sc.question.Question}</span>
                                    <span>{sc.score}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}

              {/*Selectoion for Course*/}
              {students
                .filter((v) => v.course_id?.toString() === selectedCourseId)
                .filter((c) => c.id?.toString() === StudID)
                .map((stud) => {
                  return (
                    <div>
                      <h3 className='font-semibold text-gray-800 mb-2'>
                        B . Course
                      </h3>
                      {scores
                        .filter(
                          (v) =>
                            v.training_id.toString() === stud.id.toString(),
                        )
                        .filter((c) => c.question.Criteria === "C")
                        .filter((b) => b.training_id?.toString() === StudID)
                        .map((sc) => {
                          return (
                            <div>
                              <div className='mb-6'>
                                <ul className='space-y-1 pl-4'>
                                  <li className='Questiong-answer'>
                                    <span>{sc.question.Question}</span>
                                    <span>{sc.score}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}

              {/*Selectoion for Instructor*/}
              {students
                .filter((v) => v.course_id?.toString() === selectedCourseId)
                .filter((c) => c.id?.toString() === StudID)
                .map((stud) => {
                  return (
                    <div>
                      <h3 className='font-semibold text-gray-800 mb-2'>
                        D . Instructor
                      </h3>
                      {scores
                        .filter(
                          (v) =>
                            v.training_id.toString() === stud.id.toString(),
                        )
                        .filter((c) => c.question.Criteria === "D")
                        .filter((b) => b.training_id?.toString() === StudID)
                        .map((sc) => {
                          return (
                            <div>
                              <div className='mb-6'>
                                <ul className='space-y-1 pl-4'>
                                  <li className='Questiong-answer'>
                                    <span>{sc.question.Question}</span>
                                    <span>{sc.score}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}

              {/*Selectoion for Feedback*/}
              {students
                .filter((v) => v.course_id?.toString() === selectedCourseId)
                .filter((c) => c.id?.toString() === StudID)
                .map((stud) => {
                  return (
                    <div>
                      <h3 className='font-semibold text-gray-800 mb-2'>
                        FeedBack
                      </h3>
                      {feedbacks
                        .filter(
                          (v) =>
                            v.training_id.toString() === stud.id.toString(),
                        )
                        .filter((v) => v.answer)
                        .filter((b) => b.training_id?.toString() === StudID)
                        .map((sc) => {
                          return (
                            <div>
                              <div className='mb-6'>
                                <ul className='space-y-1 pl-4'>
                                  <li
                                    className='Questiong-answer'
                                    style={{ marginLeft: "-20px" }}
                                  >
                                    <span>{sc.feedback.QuestionFeedback}</span>
                                  </li>
                                  <li className='Questiong-answer'>
                                    <span>{sc.answer}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          </div>
        </ScrollArea>
      </Modal>

      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={CourseModal}
        onClose={() => {
          setCourseModal(false);
        }}
        title='aw'
      >
        <ScrollArea style={{ display: "flex" }}>
          <div style={{ display: "flex" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div>
                  <DatePickerInput
                    leftSection={
                      <IconCalendar
                        size={18}
                        stroke={1.5}
                      />
                    }
                    placeholder='Start Date'
                    value={StartvaluenowDate}
                    onChange={SetStartvaluenowDate}
                    labelProps={{ style: { fontWeight: "bold" } }}
                  />
                </div>
                <div>
                  <DatePickerInput
                    leftSection={
                      <IconCalendar
                        size={18}
                        stroke={1.5}
                      />
                    }
                    placeholder='End Date'
                    value={EndvaluenowDate}
                    onChange={SetEndvaluenowDate}
                    labelProps={{ style: { fontWeight: "bold" } }}
                  />
                </div>
              </div>

              <h2 style={{ display: "flex", justifyContent: "space-between" }}>
                Survey Details{" "}
              </h2>

              <div>
                <p style={{ display: "flex" }}>
                  {Coursetable.filter(
                    (v) => v.id.toString() === selectedCourseId,
                  ).map((sc) => {
                    return (
                      <div>
                        <strong>Course -</strong> {sc.Course}
                      </div>
                    );
                  })}
                </p>
              </div>

              <div>
                <div className='course-CA'>
                  <h4>CRITERIA</h4> <h4>Average</h4>
                </div>

                <div>
                  <p className='Average-list'>
                    <h4>A.Services</h4>
                    <h4>
                      <div>
                        {(() => {
                          const filteredScores = scores
                            .filter(
                              (c) =>
                                c.traning.course_id?.toString() ===
                                selectedCourseId,
                            )
                            .filter((v) => v.question.Criteria === "A");

                          const total = filteredScores.reduce(
                            (sum, curr) => sum + curr.score,
                            0,
                          );
                          const count = filteredScores.length;

                          return count > 0
                            ? (total / count).toFixed(2)
                            : "No scores";
                        })()}
                      </div>
                    </h4>
                  </p>
                </div>

                <div>
                  <p className='Average-listb'>
                    <h4>B.Facilities</h4>
                    <h4>
                      <div>
                        {(() => {
                          const filteredScores = scores
                            .filter(
                              (c) =>
                                c.traning.course_id?.toString() ===
                                selectedCourseId,
                            )
                            .filter((v) => v.question.Criteria === "B");

                          const total = filteredScores.reduce(
                            (sum, curr) => sum + curr.score,
                            0,
                          );
                          const count = filteredScores.length;

                          return count > 0
                            ? (total / count).toFixed(2)
                            : "No scores";
                        })()}
                      </div>
                    </h4>
                  </p>
                </div>

                <div>
                  <p className='Average-listc'>
                    <h4>C.Course</h4>
                    <h4>
                      <div>
                        {(() => {
                          const filteredScores = scores
                            .filter(
                              (c) =>
                                c.traning.course_id?.toString() ===
                                selectedCourseId,
                            )
                            .filter((v) => v.question.Criteria === "C");

                          const total = filteredScores.reduce(
                            (sum, curr) => sum + curr.score,
                            0,
                          );
                          const count = filteredScores.length;

                          return count > 0
                            ? (total / count).toFixed(2)
                            : "No scores";
                        })()}
                      </div>
                    </h4>
                  </p>
                </div>

                <div>
                  <p className='Average-listd'>
                    <h4>D.Instructor</h4>
                    <h4>
                      <div>
                        {(() => {
                          const filteredScores = scores
                            .filter(
                              (c) =>
                                c.traning.course_id?.toString() ===
                                selectedCourseId,
                            )
                            .filter((v) => v.question.Criteria === "D");

                          const total = filteredScores.reduce(
                            (sum, curr) => sum + curr.score,
                            0,
                          );
                          const count = filteredScores.length;

                          return count > 0
                            ? (total / count).toFixed(2)
                            : "No scores";
                        })()}
                      </div>
                    </h4>
                  </p>
                </div>

                <div>
                  <h3>A.Services</h3>
                  <div>
                    {QuestionData.filter((v) => v.Criteria === "A").map(
                      (qm) => {
                        return (
                          <div className='Question-list'>
                            <h4>{qm.Question}</h4>
                            <h4 className='question-avg'>
                              <div>
                                {(() => {
                                  const filteredScores = scores
                                    .filter(
                                      (c) =>
                                        c.traning.course_id?.toString() ===
                                        selectedCourseId,
                                    )
                                    .filter((v) => v.question.Criteria === "A");

                                  const total = filteredScores.reduce(
                                    (sum, curr) => sum + curr.score,
                                    0,
                                  );
                                  const count = filteredScores.length;

                                  return count > 0
                                    ? (total / count).toFixed(2)
                                    : "No scores";
                                })()}
                              </div>
                            </h4>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <div>
                  <h3>B.Facilities</h3>
                  <div>
                    {QuestionData.filter((v) => v.Criteria === "B").map(
                      (qm) => {
                        return (
                          <div className='Question-list'>
                            <h4>{qm.Question}</h4>
                            <h4 className='question-avg'>
                              <div>
                                {(() => {
                                  const filteredScores = scores
                                    .filter(
                                      (c) =>
                                        c.traning.course_id?.toString() ===
                                        selectedCourseId,
                                    )
                                    .filter((v) => v.question.Criteria === "B");

                                  const total = filteredScores.reduce(
                                    (sum, curr) => sum + curr.score,
                                    0,
                                  );
                                  const count = filteredScores.length;

                                  return count > 0
                                    ? (total / count).toFixed(2)
                                    : "No scores";
                                })()}
                              </div>
                            </h4>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <div>
                  <h3>C.Course</h3>
                  <div>
                    {QuestionData.filter((v) => v.Criteria === "C").map(
                      (qm) => {
                        return (
                          <div className='Question-list'>
                            <h4>{qm.Question}</h4>
                            <h4 className='question-avg'>
                              <div>
                                {(() => {
                                  const filteredScores = scores
                                    .filter(
                                      (c) =>
                                        c.traning.course_id?.toString() ===
                                        selectedCourseId,
                                    )
                                    .filter((v) => v.question.Criteria === "C");

                                  const total = filteredScores.reduce(
                                    (sum, curr) => sum + curr.score,
                                    0,
                                  );
                                  const count = filteredScores.length;

                                  return count > 0
                                    ? (total / count).toFixed(2)
                                    : "No scores";
                                })()}
                              </div>
                            </h4>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                <div>
                  <h3>D.Instructor</h3>
                  <div>
                    {QuestionData.filter((v) => v.Criteria === "D").map(
                      (qm) => {
                        return (
                          <div className='Question-list'>
                            <h4>{qm.Question}</h4>
                            <h4 className='question-avg'>
                              <div>
                                {(() => {
                                  const filteredScores = scores
                                    .filter(
                                      (c) =>
                                        c.traning.course_id?.toString() ===
                                        selectedCourseId,
                                    )
                                    .filter((v) => v.question.Criteria === "D");

                                  const total = filteredScores.reduce(
                                    (sum, curr) => sum + curr.score,
                                    0,
                                  );
                                  const count = filteredScores.length;

                                  return count > 0
                                    ? (total / count).toFixed(2)
                                    : "No scores";
                                })()}
                              </div>
                            </h4>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Modal>

      <Modal
        opened={isModalOpenstaff}
        onClose={() => {
          setIsModalOpenstaff(false);
          seterrorAddstaff("");
        }}
        title='Add Staff'
        radius={20}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className='modalforstaff'>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <label>First Name</label>
            <label>Last Name</label>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Input
              required
              radius='md'
              placeholder='First Name'
              onChange={FNameTrasfer}
            />
            <Input
              required
              radius='md'
              placeholder='Last Name'
              onChange={LNameTrasfer}
            />
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "5px",
              flexDirection: "column",
            }}
          >
            <label>Email</label>
            <Input
              required
              radius='md'
              type='email'
              placeholder='Enter Email'
              onChange={EmailTrasfer}
            />
            <label>Number</label>
            <Input
              required
              radius='md'
              placeholder='Contact'
              onChange={NumberTrasfer}
            />
            <label>Role</label>
            <Input
              required
              radius='md'
              placeholder='Role'
              onChange={RoleTrasfer}
            />

            <PasswordInput
              required
              error={erorrAddstaff}
              onChange={PasswordTrasfer}
              label='Password'
              placeholder='Password'
            />
            <PasswordInput
              required
              error={erorrAddstaff}
              onChange={ConPasswordTrasfer}
              label='Confirm Password'
              paceholder='Confirm Paswword'
            />
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex ",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant='filled'
              radius='lg'
              onClick={() => {
                AddStaffModal();
              }}
            >
              {" "}
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        marginTop={20}
        radius={20}
        centered='true'
        opened={Logout}
        onClose={() => {
          setLogout(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <AspectRatio
            ratio={1}
            flex='0 0 200px'
          >
            <Image
              h={70}
              w={70}
              src='/images/Logo.png'
              alt='Avatar'
            />
          </AspectRatio>
          <div className='Aspect-text'>
            International Maritime & Offshore{" "}
            <div className='Aspect-text2'> Safety Training Institute</div>
          </div>
        </div>
        <div className='Response'></div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            color='rgb(110, 193, 228)'
            onClick={() => {
              logoutevent();
            }}
          >
            Yes
          </Button>
          <Button
            color='rgb(255, 105, 0)'
            onClick={() => {
              setLogout(false);
            }}
          >
            No
          </Button>
        </div>
      </Modal>

      <div
        className='Devider-tabs'
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <div className='Tabs-Main'>
          <div>
            <AspectRatio
              ratio={1}
              flex='0 0 200px'
              style={{ display: "flex" }}
            >
              <Image
                style={{ marginLeft: "-70px", marginTop: "-80px" }}
                fit='contain'
                h={250}
                w={250}
                src='/images/Admin-Logo.png'
                alt='Avatar'
              />
            </AspectRatio>
          </div>
          <div>
            <Tabs
              allowTabDeactivation
              color='	rgb(241, 101, 41)'
              size='xl'
              variant='pills'
              value={selectedPanel}
              orientation='vertical'
            >
              <Tabs.List>
                <div
                  style={{
                    paddingRight: "55px",
                    paddingLeft: "50px",
                    borderBottom: "2px solid black",
                  }}
                >
                  <Tabs.Tab
                    className='tab-list'
                    leftSection={<IconChartHistogram size={20} />}
                    onClick={() => setSelectedPanel("Analytics")}
                    value='Analytics'
                  >
                    Analytics
                  </Tabs.Tab>
                </div>
                <div
                  style={{
                    paddingRight: "63px",
                    paddingLeft: "50px",
                    borderBottom: "2px solid black",
                  }}
                  className='Line-tab'
                >
                  <Tabs.Tab
                    className='tab-list'
                    leftSection={<IconCertificate size={20} />}
                    onClick={() => setSelectedPanel("Course")}
                    value='Course'
                  >
                    Courses
                  </Tabs.Tab>
                </div>
                <div
                  style={{
                    paddingRight: "90px",
                    paddingLeft: "50px",
                    borderBottom: "2px solid black",
                  }}
                  className='Line-tab'
                >
                  <Tabs.Tab
                    className='tab-list'
                    leftSection={<IconUserShare size={20} />}
                    onClick={() => setSelectedPanel("Staff")}
                    value='Staff'
                  >
                    Staff
                  </Tabs.Tab>
                </div>
                <div
                  style={{
                    paddingRight: "23px",
                    paddingLeft: "50px",
                    borderBottom: "2px solid black",
                  }}
                  className='Line-tab'
                >
                  <Tabs.Tab
                    className='tab-list'
                    leftSection={<IconMessage2Cog size={20} />}
                    onClick={() => setSelectedPanel("Maintenance")}
                    value='Maintenance'
                  >
                    Maintenance
                  </Tabs.Tab>
                </div>
                <div
                  style={{
                    paddingRight: "61.5px",
                    paddingLeft: "50px",
                    borderBottom: "2px solid black",
                  }}
                  className='Line-tab'
                >
                  <Tabs.Tab
                    className='tab-list'
                    leftSection={<IconSettings size={20} />}
                    onClick={() => setSelectedPanel("Settings")}
                    value='Settings'
                  >
                    Settings
                  </Tabs.Tab>
                </div>
                <div style={{ marginLeft: "100px", marginTop: 100 }}>
                  <Button onClick={() => setLogout(true)}>Log out</Button>
                </div>
              </Tabs.List>

              <div>
                <div className='Tabs-panelborder'>
                  <Tabs.Panel value='Analytics'>
                    <Analytics
                      stafflog={stafflog}
                      adminData={adminData}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel value='Course-List'>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {header}
                      <div>
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>ID</Table.Th>
                              <Table.Th>Name</Table.Th>
                              <Table.Th>Training Date</Table.Th>
                              <Table.Th>Company</Table.Th>
                              <Table.Th>Instructor</Table.Th>
                              <Table.Th>Date</Table.Th>
                              <Table.Th>View</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>{Studrow}</Table.Tbody>
                        </Table>
                      </div>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value='Course'>
                    <div style={{ width: "1295px" }}>
                      <div
                        style={{
                          backgroundColor: "	rgb(255, 105, 0)",
                          border: "5px solid 	rgb(255, 105, 0)",
                          marginTop: "-3px",
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "30px",
                            display: "flex",
                            color: "white",
                          }}
                        >
                          Course
                          <Input
                            style={{
                              display: "flex",
                              marginLeft: "420px",
                              justifyContent: "center",
                            }}
                            leftSection={<IconSearch size={16} />}
                            variant='filled'
                            size='md'
                            radius='xl'
                            placeholder='Search'
                          />
                          <label
                            style={{ marginLeft: "400px", marginTop: "5px" }}
                          >
                            {stafflog
                              .filter(
                                (v) =>
                                  v.Role === adminData.Role &&
                                  v.id === adminData.id,
                              )
                              .map((c) => {
                                return c.Role;
                              })}
                          </label>
                          <ThemeIcon
                            size='xl'
                            color='tranfarent'
                            autoContrast
                          >
                            <IconUser size={30} />
                          </ThemeIcon>
                        </h2>
                      </div>
                      <di>
                        <div>
                          <ScrollArea
                            h={600}
                            style={{ backgroundColor: "	rgb(240, 235, 235)" }}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                margin: "20px",
                              }}
                            >
                              <Table highlightOnHover>
                                <Table.Thead>
                                  <Table.Tr>
                                    <Table.Th style={{ marginLeft: "20px" }}>
                                      Code
                                    </Table.Th>
                                    <Table.Th>Course</Table.Th>
                                    <Table.Th style={{ marginRight: "20px" }}>
                                      View
                                    </Table.Th>
                                  </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{CourseRow}</Table.Tbody>
                              </Table>
                            </div>
                          </ScrollArea>
                        </div>
                      </di>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value='Staff'>
                    <div style={{ width: "1295px" }}>
                      <div
                        style={{
                          backgroundColor: "	rgb(255, 105, 0)",
                          border: "5px solid 	rgb(255, 105, 0)",
                          marginTop: "-3px",
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "30px",
                            display: "flex",
                            color: "white",
                          }}
                        >
                          Staff
                          <Input
                            style={{
                              display: "flex",
                              marginLeft: "420px",
                              justifyContent: "center",
                            }}
                            leftSection={<IconSearch size={16} />}
                            variant='filled'
                            size='md'
                            radius='xl'
                            placeholder='Search'
                          />
                          <label
                            style={{ marginLeft: "400px", marginTop: "5px" }}
                          >
                            {stafflog
                              .filter(
                                (v) =>
                                  v.Role === adminData.Role &&
                                  v.id === adminData.id,
                              )
                              .map((c) => {
                                return c.Role;
                              })}
                          </label>
                          <ThemeIcon
                            size='xl'
                            color='tranfarent'
                            autoContrast
                          >
                            <IconUser size={30} />
                          </ThemeIcon>
                        </h2>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "end" }}>
                          {/** */}
                          <Button
                            style={{
                              marginRight: "100px",
                              marginTop: "20px",
                              marginBottom: "20px",
                            }}
                            onClick={() => {
                              (setIsModalOpenstaff(true), seterrorAddstaff(""));
                            }}
                            rightSection={<IconPlus size={14} />}
                            variant='filled'
                            radius='md'
                          >
                            Add
                          </Button>
                        </div>
                        {/** */}
                        <ScrollArea
                          h={600}
                          style={{ backgroundColor: "	rgb(240, 235, 235)" }}
                        >
                          <div
                            style={{ backgroundColor: "white", margin: "20px" }}
                          >
                            <Table highlightOnHover>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>First Name</Table.Th>
                                  <Table.Th>Last Name</Table.Th>
                                  <Table.Th>Email</Table.Th>
                                  <Table.Th>Contact No.</Table.Th>
                                  <Table.Th>Role</Table.Th>
                                  <Table.Th>Status</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>{rows}</Table.Tbody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value='Maintenance'>
                    <div style={{ width: "1295px" }}>
                      <div
                        style={{
                          backgroundColor: "	rgb(255, 105, 0)",
                          border: "5px solid 	rgb(255, 105, 0)",
                          marginTop: "-3px",
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "30px",
                            display: "flex",
                            color: "white",
                          }}
                        >
                          Maintenance
                          <Input
                            style={{
                              display: "flex",
                              marginLeft: "290px",
                              justifyContent: "center",
                            }}
                            leftSection={<IconSearch size={16} />}
                            variant='filled'
                            size='md'
                            radius='xl'
                            placeholder='Search'
                          />
                          <label
                            style={{ marginLeft: "400px", marginTop: "5px" }}
                          >
                            {stafflog
                              .filter(
                                (v) =>
                                  v.Role === adminData.Role &&
                                  v.id === adminData.id,
                              )
                              .map((c) => {
                                return c.Role;
                              })}
                          </label>
                          <ThemeIcon
                            size='xl'
                            color='tranfarent'
                            autoContrast
                          >
                            <IconUser size={30} />
                          </ThemeIcon>
                        </h2>
                      </div>
                      <ScrollArea
                        h={600}
                        style={{ backgroundColor: "	rgb(240, 235, 235)" }}
                      >
                        {
                          <div
                            style={{ marginRight: "-17px", height: "600px" }}
                          >
                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                border: "2px solid black",
                                margin: "50px",
                              }}
                            >
                              <h2
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                Training Evaluation
                              </h2>
                              <div style={{ marginLeft: "10px" }}>
                                <div style={{ display: "flex" }}>
                                  <h3>A.Services</h3>
                                  <Button
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginLeft: "950px",
                                      marginTop: "13",
                                    }}
                                    onClick={() => {
                                      (Identify("Questioner"),
                                        setCriteriatrow("A"));
                                    }}
                                    rightSection={<IconPlus size={14} />}
                                    variant='filled'
                                    radius='md'
                                  >
                                    Add
                                  </Button>
                                </div>
                                <div>
                                  {QuestionQues.map((keys) => {
                                    return (
                                      <div className='item'>
                                        <div>{keys.Question}</div>
                                        <div>
                                          <ActionIcon
                                            color='red'
                                            onClick={() => {
                                              (handleID(keys.id),
                                                setQ("Questioner"));
                                            }}
                                          >
                                            <IconTrash size={17} />
                                          </ActionIcon>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                border: "2px solid black",
                                margin: "50px",
                              }}
                            >
                              <h2
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                Training Evaluation
                              </h2>
                              <div style={{ marginLeft: "10px" }}>
                                <div style={{ display: "flex" }}>
                                  <h3>B.Facilities</h3>
                                  <Button
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginLeft: "950px",
                                      marginTop: "13",
                                    }}
                                    onClick={() => {
                                      (Identify("Questioner"),
                                        setCriteriatrow("B"));
                                    }}
                                    rightSection={<IconPlus size={14} />}
                                    variant='filled'
                                    radius='md'
                                  >
                                    Add
                                  </Button>
                                </div>
                                <div>
                                  {QuestionB.map((keyb) => {
                                    return (
                                      <div className='item'>
                                        <div>{keyb.Question}</div>
                                        <div>
                                          <ActionIcon
                                            color='red'
                                            onClick={() => {
                                              (handleID(keyb.id),
                                                setQ("Questioner"));
                                            }}
                                          >
                                            <IconTrash size={17} />
                                          </ActionIcon>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                border: "2px solid black",
                                margin: "50px",
                              }}
                            >
                              <h2
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                Training Evaluation
                              </h2>
                              <div style={{ marginLeft: "10px" }}>
                                <div style={{ display: "flex" }}>
                                  <h3>C.Course</h3>
                                  <Button
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginLeft: "950px",
                                      marginTop: "13",
                                    }}
                                    onClick={() => {
                                      (Identify("Questioner"),
                                        setCriteriatrow("C"));
                                    }}
                                    rightSection={<IconPlus size={14} />}
                                    variant='filled'
                                    radius='md'
                                  >
                                    Add
                                  </Button>
                                </div>
                                <div>
                                  {QuestionC.map((keyc) => {
                                    return (
                                      <div className='item'>
                                        <div>{keyc.Question}</div>
                                        <div>
                                          <ActionIcon
                                            color='red'
                                            onClick={() => {
                                              (handleID(keyc.id),
                                                setQ("Questioner"));
                                            }}
                                          >
                                            <IconTrash size={17} />
                                          </ActionIcon>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                border: "2px solid black",
                                margin: "50px",
                              }}
                            >
                              <h2
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                Training Evaluation
                              </h2>
                              <div style={{ marginLeft: "10px" }}>
                                <div style={{ display: "flex" }}>
                                  <h3>D.Instructor</h3>
                                  <Button
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginLeft: "950px",
                                      marginTop: "13",
                                    }}
                                    onClick={() => {
                                      (Identify("Questioner"),
                                        setCriteriatrow("D"));
                                    }}
                                    rightSection={<IconPlus size={14} />}
                                    variant='filled'
                                    radius='md'
                                  >
                                    Add
                                  </Button>
                                </div>
                                <div>
                                  {QuestionD.map((keyD) => {
                                    return (
                                      <div className='item'>
                                        <div>{keyD.Question}</div>
                                        <div>
                                          <ActionIcon
                                            color='red'
                                            onClick={() => {
                                              (handleID(keyD.id),
                                                setQ("Questioner"));
                                            }}
                                          >
                                            <IconTrash size={17} />
                                          </ActionIcon>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                backgroundColor: "whitesmoke",
                                border: "2px solid black",
                                margin: "50px",
                              }}
                            >
                              <h2
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                Additional Feedback
                              </h2>
                              <div style={{ marginLeft: "10px" }}>
                                <div style={{ display: "flex" }}>
                                  <h3>Feedback</h3>
                                  <Button
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginLeft: "950px",
                                      marginTop: "13",
                                    }}
                                    onClick={() => {
                                      Identify("Feedback-Question");
                                    }}
                                    rightSection={<IconPlus size={14} />}
                                    variant='filled'
                                    radius='md'
                                  >
                                    Add
                                  </Button>
                                </div>
                                <div>
                                  {Feedback.map((keyD) => {
                                    return (
                                      <div className='item'>
                                        <div>{keyD.QuestionFeedback}</div>
                                        <div>
                                          <ActionIcon
                                            color='red'
                                            onClick={() => {
                                              (handleID(keyD.id),
                                                setQ("Feedback-Question"));
                                            }}
                                          >
                                            <IconTrash size={17} />
                                          </ActionIcon>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </ScrollArea>
                    </div>
                  </Tabs.Panel>

                  <Tabs.Panel value='Settings'>
                    <div>
                      <div
                        style={{
                          backgroundColor: "	rgb(255, 105, 0)",
                          border: "5px solid 	rgb(255, 105, 0)",
                          marginTop: "-3px",
                        }}
                      >
                        <h2
                          style={{
                            marginLeft: "30px",
                            display: "flex",
                            color: "white",
                          }}
                        >
                          Settings
                          <label
                            style={{ marginLeft: "1020px", marginTop: "5px" }}
                          >
                            {stafflog
                              .filter(
                                (v) =>
                                  v.Role === adminData.Role &&
                                  v.id === adminData.id,
                              )
                              .map((c) => {
                                return c.Role;
                              })}
                          </label>
                          <ThemeIcon
                            size='xl'
                            color='tranfarent'
                            autoContrast
                          >
                            <IconUser size={30} />
                          </ThemeIcon>
                        </h2>
                      </div>
                      <ScrollArea
                        h={600}
                        style={{ backgroundColor: "	rgb(240, 235, 235)" }}
                      >
                        <div
                          style={{ backgroundColor: "white", margin: "20px" }}
                        >
                          <div
                            style={{
                              padding: "50px",
                              paddingLeft: "100px",
                              borderBottom: "2px solid black",
                            }}
                          >
                            <Avatar
                              style={{
                                border: "2px solid black",
                                width: "150px",
                                height: "150px",
                              }}
                              variant='outline'
                              radius='lg'
                              src=''
                            />
                            <Group justify=''>
                              <FileButton
                                onChange={setFile}
                                accept='image/png,image/jpeg'
                              >
                                {(props) => (
                                  <Button {...props}>Upload image</Button>
                                )}
                              </FileButton>
                            </Group>
                          </div>
                          <div>
                            <Table
                              variant='vertical'
                              layout='fixed'
                              withTableBorder
                            >
                              {stafflog
                                .filter(
                                  (v) =>
                                    v.id?.toString() ===
                                    adminData.id?.toString(),
                                )
                                .map((datas) => {
                                  return (
                                    <Table.Tbody>
                                      <Table.Tr>
                                        <Table.Th
                                          style={{ padding: "20px" }}
                                          w={260}
                                        >
                                          Name:
                                        </Table.Th>
                                        <Table.Td>
                                          {datas.First_Name} {datas.Last_Name}
                                        </Table.Td>
                                        <Button
                                          style={{
                                            marginLeft: "350px",
                                            marginTop: "12px",
                                          }}
                                          variant='filled'
                                        >
                                          Edit
                                        </Button>
                                      </Table.Tr>

                                      <Table.Tr>
                                        <Table.Th style={{ padding: "20px" }}>
                                          Email:
                                        </Table.Th>
                                        <Table.Td>{datas.Email}</Table.Td>
                                        <Button
                                          style={{
                                            marginLeft: "350px",
                                            marginTop: "12px",
                                          }}
                                          variant='filled'
                                        >
                                          Edit
                                        </Button>
                                      </Table.Tr>

                                      <Table.Tr>
                                        <Table.Th style={{ padding: "20px" }}>
                                          Contact Number:
                                        </Table.Th>
                                        <Table.Td>{datas.Contact}</Table.Td>
                                        <Button
                                          style={{
                                            marginLeft: "350px",
                                            marginTop: "12px",
                                          }}
                                          variant='filled'
                                        >
                                          Edit
                                        </Button>
                                      </Table.Tr>

                                      <Table.Tr>
                                        <Table.Th style={{ padding: "20px" }}>
                                          Role:
                                        </Table.Th>
                                        <Table.Td> {datas.Role}</Table.Td>
                                      </Table.Tr>

                                      <Table.Tr>
                                        <Table.Th style={{ padding: "20px" }}>
                                          Password:
                                        </Table.Th>
                                        <Table.Td>
                                          {"•".repeat(datas.Password)}
                                        </Table.Td>
                                        <Button
                                          style={{
                                            marginLeft: "340px",
                                            marginTop: "12px",
                                          }}
                                          variant='filled'
                                        >
                                          Change
                                        </Button>
                                      </Table.Tr>
                                    </Table.Tbody>
                                  );
                                })}
                            </Table>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </Tabs.Panel>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
