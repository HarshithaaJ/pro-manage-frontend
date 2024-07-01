import { useEffect, useState } from "react";
import styles from "./css/Analytics.module.scss";
import { getTasksAnalytics } from "../apis/tasks";
import {useOutletContext} from "react-router-dom";
import Spinner from "../components/Spinner";

const analyticsGroup = [
  [
    {title: "Backlog Tasks", dataIndex: "backlog"},
    {title: "To-do Tasks", dataIndex: "to-do"},
    {title: "In-Progress Tasks", dataIndex: "progress"},
    {title: "Completed Tasks", dataIndex: "done"},
  ],
  [
    {title: "Low Priority", dataIndex: "low"},
    {title: "Moderate Priority", dataIndex: "moderate"},
    {title: "High Priority", dataIndex: "high"},
    {title: "Due Date Tasks", dataIndex: "dueDate"},
  ],
]

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const {notifyError} = useOutletContext();

  useEffect(()=> {
    ;(async ()=> {
      const {data: analytics, error} = await getTasksAnalytics();
      if(error) {
        notifyError("Something went wrong");
        setLoading(false);
        return;
      }

      setAnalyticsData(analytics);
      setLoading(false);
    })();
  }, [])
  
  return (
    !loading ? 
    <div className={styles.analytics}>
      <h3>Analytics</h3>
      <main>
        {
          analyticsGroup.map((group, index)=> (
            <div key={index} className={styles.data}>
              {
                group.map(({title, dataIndex})=> (
                  <div key={dataIndex}>
                    <p><span>&bull;</span> {title}</p>
                    <h3>{analyticsData[dataIndex] < 10 && "0"}{analyticsData[dataIndex] ?? "00"}</h3>
                  </div>
                ))
              }
            </div>
          ))
        }
      </main>
    </div> : <Spinner />
  )
}

export default Analytics