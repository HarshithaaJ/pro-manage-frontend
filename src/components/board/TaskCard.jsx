import React, { useState, useMemo, useEffect } from "react";
import styles from "../css/TaskCard.module.scss";
import { format, isPast, isToday } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { IoIosArrowDown } from "react-icons/io";
import Select from "../form-inputs/Select";
import TaskForm from "./TaskForm";
import DeletePopup from "./DeletePopup";
import { useOutletContext } from "react-router-dom";
import Spinner from '../Spinner';
// import { getAllTasks } from "../../apis/tasks";
import { ItemTypes } from './constants';
 import { useDrag } from 'react-dnd';




const priorityColors = {
  low: "#63C05B",
  moderate: "#18B0FF",
  high: "#FF2473"
}

const stateOptions = [
  { title: "BACKLOG", dataIndex: "backlog" },
  { title: "TO-DO", dataIndex: "to-do" },
  { title: "PROGRESS", dataIndex: "progress" },
  { title: "DONE", dataIndex: "done" },
]



function TaskCard({
  task,
  collapseAll,
  setCollapseAll,
  moveTaskToState,
  showPopupModal,
  updateTask,
  deleteTask,
  toggleCheck,
  
  
}) {
  const [showChecklist, setShowChecklist] = useState(false);
  const [showTaskOptions, setShowTaskOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notifySuccess } = useOutletContext();
  // const [dragging, setDragging] = useState(false);
  
  

  
  useEffect(()=> {
    if(collapseAll) setShowChecklist(false);
    else setShowChecklist(true);
  }, [collapseAll])

  

  const [isDue, formattedDate] = useMemo(() => {
    const date = task.dueDate ? format(new Date(task.dueDate), "MMM do") : "";
    const isDatePast = task.dueDate ? isPast(task.dueDate) && !isToday(task.dueDate) : false;

    return [isDatePast, date];
  }, [task]);

  const handleShareTask = () => {
    notifySuccess("Link Copied");
    navigator.clipboard.writeText(`${window.location.origin}/view/${task._id}`);
  };

  const handleTaskOperation = (taskFunction) => {
    taskFunction();
    setShowTaskOptions(false);
  };

  const toggleChecklist = () => {
    !showChecklist && setCollapseAll(false);
    setShowChecklist((prev) => !prev);
  };

  const selectBgColor = (isPast) => {
    return task.state === "done" ? "#63C05B" : (isPast ? "#CF3636" : "#DBDBDB");
  };

  const handleMoveTask = (currentState, newState, task, taskId) => {
    setLoading(true);

    setTimeout(async () => {
      try {
        await moveTaskToState(currentState, newState, task, taskId);
      } catch (error) {
        console.error('Error moving task:', error);
      }
      setLoading(false);
    }, 1000);
  };

  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.TASK,
      item: task,
      // end:  (item, monitor) => {
      //   const dropResult = monitor.getDropResult();
      //   if (item && dropResult) {
      //     try {
      //        moveTaskToState(task.state, dropResult.state, task, task._id);
      //     } catch (error) {
      //       console.error('Error moving task:', error);
      //     }
      //   }
      // },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
    const opacity = isDragging ? 0.5 : 1 ;
    //console.log("Task Object: ", task);
  return (
    
    <div  ref={drag} style={{opacity}}
     className={styles.task_card}>
      <div  className={styles.header}>
        <span>
          <span style={{ color: priorityColors[task.priority] }}>&bull;</span>{" "}
           {task.priority ? task.priority.toUpperCase()  : "NO PRIORITY"} 
          {/* {task.priority.toUpperCase()} PRIORITY */}
        </span>
        <div>
          <span
            onClick={(e) => {
              setShowTaskOptions((prev) => !prev);
              e.stopPropagation();
            }}
          >
            <BsThreeDots />
          </span>
          {showTaskOptions && (
            <Select setShowSelect={setShowTaskOptions}>
              <option
                onClick={() =>
                  handleTaskOperation(() =>
                    showPopupModal(TaskForm, {
                      task,
                      updateTask,
                    })
                  )
                }
              >
                Edit
              </option>
              <option onClick={() => handleTaskOperation(handleShareTask)}>
                Share
              </option>
              <option
                onClick={() =>
                  handleTaskOperation(() =>
                    showPopupModal(DeletePopup, {
                      from: task.state,
                      deleteTask,
                      taskId: task._id,
                    })
                  )
                }
                style={{ color: "#CF3636" }}
              >
                Delete
              </option>
            </Select>
          )}
        </div>
      </div>
      <h3
        data-tooltip-id="title-tooltip"
        data-tooltip-content={task.title}
         data-tooltip-hidden={task.title && task.title.length < 60} 
        //  data-tooltip-hidden={task.title.length < 60}
      >
        {task.title.length > 60
          ? task.title.substring(0, 61) + "..."
          : task.title}
      </h3>
      <Tooltip
        id="title-tooltip"
        className={styles.tooltip}
        arrowColor="#000"
      />
      <section className={styles.all_checklist}>
        <div>
          <h4>
            Checklist (
              {`${task.checklists ? task.checklists.reduce(
              (acc, list) => (list.isChecked ? acc + 1 : acc),
              0
            ) : 0}/${task.checklists ? task.checklists.length : 0}`}
            {/* {`${task.checklists.reduce(
              (acc, list) => (list.isChecked ? acc + 1 : acc),
              0
            )}/${task.checklists.length}`} */}
            )
          </h4>
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleChecklist();
             
          }}
          >
            <IoIosArrowDown
              style={{
                transform: showChecklist ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </div>
        {showChecklist && (
          <div>
            
            {task.checklists.map((list) => (
              <div key={list._id} className={styles.checklist}>
                <input
                  type="checkbox"
                  checked={list.isChecked}
                  onChange={(e) => toggleCheck(task.state, task._id, list._id, e.target.checked)}
                 
               />
                <p>{list.description}</p>
              </div>
            ))}
           
          </div>
        )}
      </section>
      <div className={styles.footer}>
        {formattedDate ? (
          <div
            style={{
              backgroundColor: selectBgColor(isDue),
              color: isDue || task.state === "done" ? "#FFF" : "#000",
            }}
          >
            {formattedDate}
          </div>
        ) : (
          <span></span>
        )}
        <div>
        
        
 
          {stateOptions.map((state) =>
            state.dataIndex !== task.state ? (
              <span
              
                key={state.dataIndex}
                onClick={() =>
                  handleMoveTask(task.state, state.dataIndex, task, task._id)
                

                }
              >
                {state.title}
              </span>
            ) : (
              ""
            )
          )}
         
        </div>
      </div>
      {loading && (
        <div className={styles.spinner_container}>
          <Spinner />
        </div>
      )}
    </div>
   
  );
}




export default TaskCard

// function debounce(func, wait) {
//   let timeout;
//   return function(...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// }

// const debounceToggleCheck = useCallback(debounce(async (state, taskId, checklistId, checked) => {
    
  //   try {
  //     await toggleCheck(state, taskId, checklistId, checked);
  //   } catch (error) {
  //     console.error('Error toggling checklist:', error);
  //   }
  // //   // setLoading(false);
  //  } ),[]);

  //  const handleToggleCheck = (state, taskId, checklistId, checked) => {
  // //   // setLoading(true);
  //   debounceToggleCheck(state, taskId, checklistId, checked);
  // };


  
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.TASK,
//     item: { id: task.id, state: task.state },
//     end: (item, monitor) => {
//       const dropResult = monitor.getDropResult();
//       if (item && dropResult) {
//         moveTask(item.state, dropResult.state, item.id);
       
//           alert(`You dropped ${item.id} into ${dropResult.state}!`)
         
//       }
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));
  

  
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: ItemTypes.TASK,
//     item: { id: task.id,state: task.state },

//     drop: () => {
//       moveTaskToState(item.state, newState, item.id);
//     },
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//     hover(item, monitor) {
//       if (!ref.current) {
//         return
//       }
//       // const dragIndex = newState;
//       // const hoverIndex = item.state;
     
//       // if (dragIndex === hoverIndex) {
//       //   return
//       // }
//     }
// }));
  
//      const opacity = isDragging ? 0.5 : 1;
//     const backgroundColor = isOver ? '#f0f0f0' : '#ffffff';
   
// drag(drop(ref))



// const handleDragStart = (e) => {
//   e.preventDefault();
//   e.dataTransfer.setData("task-id", task._id);
//   e.dataTransfer.setData("task-state", task.state);
// };

// task.addEventListener('dragstart', function (event) {
//   event.target.id = "taskid";
//   event.dataTransfer.setData("taskItem", event.target.id);
//   }, false);