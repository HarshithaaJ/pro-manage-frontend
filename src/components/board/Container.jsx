import styles from "../css/Container.module.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import TaskCard from "./TaskCard";
import { useState } from "react";
import TaskForm from "./TaskForm";

function Container({
    tasks=[],
    title="",
    moveTaskToState,
    loading,
    showPopupModal,
    addTask,
    updateTask,
    deleteTask,
    toggleCheck,
}) {
  const [collapseAll, setCollapseAll] = useState(true);
  return (
    <div className={styles.tasks_container}>
      <div className={styles.container_title}>
        <h3>{title}</h3>
        <div>
          <span onClick={() => showPopupModal(TaskForm, { addTask })}>
            {title === "To do" && <IoAdd />}
          </span>
          <span onClick={() => setCollapseAll(true)}>
            <VscCollapseAll />
          </span>
        </div>
      </div>
      <main>
        {!loading ? (
          tasks.map((task) => (
            <TaskCard
              deleteTask={deleteTask}
              updateTask={updateTask}
              showPopupModal={showPopupModal}
              key={task._id}
              task={task}
              moveTaskToState={moveTaskToState}
              collapseAll={collapseAll}
              setCollapseAll={setCollapseAll}
              toggleCheck={toggleCheck}
            />
          ))
        ) : (
          <div className={styles.task_skeleton}>
            <div />
          </div>
        )}
      </main>
    </div>
  );
}

export default Container