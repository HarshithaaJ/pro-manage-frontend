import styles from "./css/Dashboard.module.scss";
import { useAuth } from "../context/user.context";
import { format } from "date-fns";
import Container from "../components/board/Container";
import Select from "../components/form-inputs/Select";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllTasks, updateTaskChecklist, updateTaskState } from "../apis/tasks";
import { IoIosArrowDown } from "react-icons/io";

const formattedDate = format(new Date(), "do MMM, yyyy");
const tasksState = [
  { title: "Backlog", dataIndex: "backlog" },
  { title: "To do", dataIndex: "to-do" },
  { title: "In progress", dataIndex: "progress" },
  { title: "Done", dataIndex: "done" },
];
const durationOptions = [
  { title: "Today", value: "Today" },
  { title: "This Week", value: "Week" },
  { title: "This Month", value: "Month" },
];

function Dashboard() {
  const { user: { name: username } } = useAuth();
  const [duration, setDuration] = useState("Week");
  const [loading, setLoading] = useState(true);
  const [tasksData, setTasksData] = useState({
    "backlog": [], "to-do": [], "progress": [], "done": []
  });
  const [showDurationSelect, setShowDurationSelect] = useState(false);
  const { notifyError, showPopupModal } = useOutletContext();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data: tasks, error } = await getAllTasks(duration);
      if (error) {
        notifyError("Something went wrong");
        setLoading(false);
        return;
      }

      setTasksData(tasks);
      setLoading(false);
    })();
  }, [duration]);

  useEffect(() => {
    console.log("Tasks Data in Dashboard:", tasksData);
  }, [tasksData]);

  const moveTaskToState = async (from, to, task, taskId) => {
    const { error } = await updateTaskState(to, taskId);
    if (error) {
      notifyError("Error occurred while moving the task");
      return;
    }

    task.state = to;
    setTasksData((prev) => {
      return {
        ...prev,
        [from]: prev[from].filter((task) => task._id !== taskId),
        [to]: [...prev[to], task]
      };
    });
  };

  const addTask = (task) => {
    setTasksData((prev) => ({ ...prev, "to-do": [...prev["to-do"], task] }));
  };

  const updateTask = (to, newTask, taskId) => {
    setTasksData((prev) => {
      return {
        ...prev,
        [to]: prev[to].map((task) => task._id === taskId ? newTask : task),
      };
    });
  };

  const deleteTask = (from, taskId) => {
    setTasksData((prev) => {
      return {
        ...prev,
        [from]: prev[from].filter((task) => task._id !== taskId),
      };
    });
  };

  const toggleCheck = async (to, taskId, checklistId, isChecked) => {
    const { error } = await updateTaskChecklist(taskId, checklistId, isChecked);
    if (error) {
      notifyError("Something went wrong");
      return;
    }

    setTasksData((prev) => ({
      ...prev,
      [to]: prev[to].map((task) =>
        task._id === taskId
          ? {
            ...task,
            checklists: task.checklists.map((list) => list._id === checklistId ? { ...list, isChecked } : list),
          }
          : task
      ),
    }));
  };

  return (
    <div className={styles.dashboard}>
      <section className={styles.board_header}>
        <section>
          <h3>Welcome! {username}</h3>
          <p className={styles.date}>{formattedDate}</p>
        </section>
        <section>
          <h3>Board</h3>
          <div>
            <div
              onClick={(e) => {
                setShowDurationSelect((prev) => !prev);
                e.stopPropagation();
              }}
            >
              {duration !== "Today" && "This"} {duration} <IoIosArrowDown />
            </div>
            {showDurationSelect && (
              <Select setShowSelect={setShowDurationSelect}>
                {durationOptions.map((duration) => (
                  <option
                    key={duration.value}
                    onClick={() => {
                      setDuration(duration.value);
                      setShowDurationSelect(false);
                    }}
                  >
                    {duration.title}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </section>
      </section>
      <main className={styles.states_container}>
        {tasksState.map((state) => (
          <div key={state.dataIndex}>
            <Container
              showPopupModal={showPopupModal}
              loading={loading}
              tasks={tasksData[state.dataIndex]}
              moveTaskToState={moveTaskToState}
              title={state.title}
              addTask={addTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
              toggleCheck={toggleCheck}
            />
          </div>
        ))}
      </main>
    </div>
  );
}

export default Dashboard;
