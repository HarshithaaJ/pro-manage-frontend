import { useNavigate, useParams } from "react-router-dom";
import styles from "./css/ViewTask.module.scss";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getTaskById } from "../apis/tasks";
import Spinner from "../components/Spinner";

const priorityColors = {
    low: "#63C05B",
    moderate: "#18B0FF",
    high: "#FF2473"
}

function ViewTask() {
    const {taskId} = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(()=> {
        setLoading(true);
        setError("");
        
        (async()=> {
            if(!taskId) {
              setError("404, Task Not Found")
              setLoading(false);
              return
            }
            const {data: task, error} = await getTaskById(taskId);
            if(error) setError("404, Task Not Found");
            else setTask(task);

            setLoading(false);
        })();
    }, [])

    if(error) {
        return (
            <h2 style={{textAlign: "center"}}>{error}</h2>
        )
    }

    if(loading) {
        return (
            <div style={{width: "100vw", height: "100vh"}}>
                <Spinner/>
            </div>
        )
    }

  return (
    <div className={styles.view_task}>
      <div className={styles.brand}>
        <h3>
          <span onClick={()=> navigate("/dashboard")}>
            <img src="/logo.svg" alt="logo" /> Pro Manage
          </span>
        </h3>
      </div>
      <main>
        <div className={styles.task_card}>
          <div className={styles.header}>
            <span>
              <span style={{ color: priorityColors[task.priority] }}>
                &bull;
              </span>{" "}
              {task.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <h3>{task.title}</h3>
          <section className={styles.all_checklist}>
            <div>
              <h4>
                Checklist (
                {`${task.checklists.reduce(
                  (acc, list) => (list.isChecked ? acc + 1 : acc),
                  0
                )}/${task.checklists.length}`}
                )
              </h4>
            </div>
            <div>
              {task.checklists.map((list, index) => (
                <div key={list._id ?? index} className={styles.checklist}>
                  <input type="checkbox" checked={list.isChecked} readOnly />
                  <p>{list.description}</p>
                </div>
              ))}
            </div>
          </section>
          {
            task.dueDate && (
            <div className={styles.footer}>
              <div className={styles.due_date}>
                <p>Due Date</p>
                <div>{format(task.dueDate, "MMM do")}</div>
              </div>
            </div>
            )
          }
        </div>
      </main>
    </div>
  );
}

export default ViewTask