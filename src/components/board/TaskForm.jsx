import { IoAdd } from "react-icons/io5";
import styles from "../css/TaskForm.module.scss";
import Button from "../form-inputs/Button";
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";
import { createTask, editTask } from "../../apis/tasks";

const priorities = [
    {name: "high", color: "#FF2473"},
    {name: "moderate", color: "#18B0FF"},
    {name: "low", color: "#63C05B"},
]
function TaskForm({
    notifyError,
    notifySuccess,
    removePopupModal,
    task: prevTask=null,
    updateTask,
    addTask,
}) {
    const [task, setTask] = useState({
        title: prevTask?.title || "",
        priority: prevTask?.priority || "",
        dueDate: prevTask?.dueDate || ""
    })
    const [checklists, setChecklists] = useState(prevTask?.checklists || [])
    const [processing, setProcessing] = useState(false);
    const datePickerRef = useRef();

    const addNewList = ()=> {
        setChecklists((prev) => ([...prev, { isChecked: false, description: "" },]));
    }

    const handleList = (index, operation, desc="")=> {
        switch (operation) {
            case "check":
                setChecklists((prev) =>
                  prev.map((list, idx) =>
                    idx === index
                      ? { ...list, isChecked: !list.isChecked }
                      : list
                  )
                );
            break;
            case "text":
                setChecklists((prev) =>
                  prev.map((list, idx) =>
                    idx === index
                      ? { ...list, description: desc }
                      : list
                  )
                );
            break;
            case "delete":
                setChecklists((prev) => prev.filter((_, idx) => idx !== index));
            break;
            default:
                break;
        }
    }

    const handleTaskSubmit = async(e)=> {
        e.preventDefault();
        setProcessing(true);
        let error = "";

        //Error Handling
        if(!task.title.trim()) error = "Title is required"
        else if(!task.priority) error = "Priority is required"
        else if(!checklists.length) error = "Atleast one checklist is required"
        else if (checklists.some((list)=> list.description.trim()==="")) error = "Every checklist needs a description"
        
        if(error) {
            notifyError(error);
            setProcessing(false);
            return
        }

        task.checklists = checklists;

        const {data: taskData, error: taskError} = !prevTask?._id ? await createTask(task) : await editTask(task, prevTask._id);

        if(taskError) {
            notifyError(taskError)
            setProcessing(false);
        } else {
            !prevTask?._id ? notifySuccess("New Task Created!") : notifySuccess("Task Updated!");
            !prevTask?._id ? addTask(taskData) : updateTask(prevTask.state, taskData, prevTask._id);
            setProcessing(false);
            removePopupModal();
        }
    }

  return (
    <div className={styles.task_form}>
      <form onSubmit={(e) => handleTaskSubmit(e)}>
        <div className={styles.title}>
          <label htmlFor="task-title">
            Title <span>*</span>
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
            name="title"
            id="task-title"
            placeholder="Enter Task Title"
          />
        </div>
        <div className={styles.priority}>
          <label htmlFor="priority">
            Select Priority <span>*</span>
          </label>
          {priorities.map((priority) => (
            <div
              key={priority.name}
              onClick={()=> setTask((prev)=> ({...prev, priority: priority.name}))}
              style={{
                backgroundColor:
                  task.priority === priority.name ? "#EEECEC" : "",
              }}
            >
              <span style={{ color: priority.color }}>&bull;</span>{" "}
              {priority.name.toUpperCase()} PRIORITY
            </div>
          ))}
        </div>
        <div className={styles.checklist}>
          <label>
            Checklist (
            {`${checklists.reduce(
              (acc, list) => (list.isChecked ? acc + 1 : acc),
              0
            )}/${checklists.length}`}
            ) <span>*</span>
          </label>
          {
            <div>
              {checklists.map((list, index) => (
                <Checklist key={list._id ?? index} list={list} index={index} handleList={handleList} />
              ))}
            </div>
          }
          <button type="button" onClick={addNewList}>
            <IoAdd /> Add New
          </button>
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.date_input}
            onClick={() => datePickerRef.current.showPicker()}
          >
            {task.dueDate
              ? format(task.dueDate, "MM/dd/yyyy")
              : "Select Due Date"}
          </button>
          <input
            type="date"
            ref={datePickerRef}
            name="dueDate"
            style={{ visibility: "hidden" }}
            value={task.dueDate}
            onChange={(e)=> setTask((prev)=> ({...prev, dueDate: e.target.value}))}
          />
          <div>
            <button onClick={() => removePopupModal()}>Cancel</button>
            <Button processing={processing} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TaskForm

const Checklist = ({list, index, handleList})=> {
    return (
      <div className={styles.checklist_input}>
        <input type="checkbox" checked={list.isChecked} onChange={(e)=> handleList(index, "check")} />
        <textarea rows={1} value={list.description} onChange={(e)=> handleList(index, "text", e.target.value)} />
        <span onClick={()=> handleList(index, "delete")}><MdDelete/></span>
      </div>
    );
}