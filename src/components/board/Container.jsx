import styles from "../css/Container.module.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import TaskCard from "./TaskCard";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
//  import { v4 as uuidv4 } from 'uuid';
import { useDrop } from "react-dnd";
import { ItemTypes } from "./constants"; 

function Container({
  tasks = [],
  title = "",
  moveTaskToState,
  loading,
  showPopupModal,
  addTask,
  updateTask,
  deleteTask,
  toggleCheck,
  state
 
}) {
  const [collapseAll, setCollapseAll] = useState(true);
 
  //  const [cards,setCards] = useState();

  useEffect(() => {
  console.log("Tasks in Container:", tasks);
  }, [tasks]);
  
    const [{ isOver }, drop] = useDrop(() => ({
     
      accept: ItemTypes.TASK,
      drop: (item) => {
        moveTaskToState(item.state, state.dataIndex, item, item.id);
        //  return { state: state.dataIndex };
      },
      // collect: (monitor) => ({
      //   isOver: monitor.isOver(),
      // }),
    }));

  return (
    <div ref={drop} className={styles.tasks_container} >
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
          tasks.map((task) => {
              // const uniqueKey = uuidv4();
          //  console.log('Task Key:', uniqueKey);
          
            return (
              
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
            );
        
          })  
          
        ) : (
          <div className={styles.task_skeleton}>
            <div />
          </div>
        )}
      
      </main>
    </div>
  ) ;
}
export default Container;
 // const moveCard = useCallback((dragIndex, hoverIndex) => {
  //   setCard((prevCards) =>
  //     update(prevCards, {
  //       $splice: [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, prevCards[dragIndex]],
  //       ],
  //     }),
  //   )
  // }, [])

  // const moveCard = useCallback((dragIndex, hoverIndex) => {
  //   setCards((prev) =>
  //    ({ ...prev, hoverIndex: [...prev[hoverIndex], dragIndex] }));
  // }, []);



