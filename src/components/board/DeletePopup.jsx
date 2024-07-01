import { useState } from "react";
import styles from "../css/SmallPopup.module.scss";
import Button from "../form-inputs/Button";
import { deleteTask } from "../../apis/tasks";

function DeletePopup({
    from,
    deleteTask: removeTask,
    taskId,
    removePopupModal,
    notifySuccess,
    notifyError,
}) {

    const [processing, setProcessing] = useState(false);

    const handleDeleteTask = async()=> {
        setProcessing(true);
        const {error} = await deleteTask(taskId);
        if(error) {
            notifyError("Can't Delete Task, Try Again!");
            setProcessing(false);
            return;
        }

        removeTask(from, taskId);
        notifySuccess("Task deleted!");
        removePopupModal();
    }

  return (
    <div className={styles.small_popup}>
        <h3>Are you sure you want to Delete?</h3>
        <div>
            <Button processing={processing} onClick={handleDeleteTask}>Yes, Delete</Button>
            <button onClick={removePopupModal}>Cancel</button>
        </div>
    </div>
  )
}

export default DeletePopup