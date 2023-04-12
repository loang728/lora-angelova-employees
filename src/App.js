import "./App.css";
import { useState } from "react";
import Papa from "papaparse";

const headerTitles = ["Employee ID #1", "Employee ID #2", "Project ID", "Days worked"]



function App() {

  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterRows, setilterRows] = useState([]);
  const [maxDays, setMaxDays] = useState(0);
  const [pairs, setPairs] = useState([]);

  function Today() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var datetoSend = new Date(yyyy, mm, dd);
    return datetoSend;
  }
  function dateParser(date, delimeter) {
    var start1Arr = [];

    if (date != "NULL") {
      start1Arr = date.split(delimeter);
      var dateObj = new Date(start1Arr[0], start1Arr[1], start1Arr[2]);
    } else
      var dateObj = Today();
    return dateObj;

  }
  function DayCount(start1, end1, start2, end2) {
    /* Counts the days intersection, throught detetmining sigger stardate and smaller enddate */
    var daysCount = 0;
    var oneDay = 24 * 60 * 60 * 1000;
    var start1Date = dateParser(start1, "-");
    var end1Date = dateParser(end1, "-")
    var start2Date = dateParser(start2, "-")
    var end2Date = dateParser(end2, "-")

    var biggerStart = start1Date;
    var smallerEnd = end1Date;
    if (start2Date > start1Date) var biggerStart = start2Date;
    if (end1Date > end2Date) var smallerEnd = end2Date;

    const diffDays = Math.round(Math.abs((smallerEnd - biggerStart) / oneDay));
    return diffDays;
  }

  function maxDaysPairs(arr) {
    /* Check which is the highestvalue of days, and creates an array
     with the record who has it (in case  thereare more than one pairs with same days all pairs will be shown */
    var maxvalue = 0;
    const allPairs = [];
    /* Researching for the highest value */
    arr.forEach((pair) => {
      console.log(pair[7])
      if (pair[7] > maxvalue) { maxvalue = pair[7] }
    });
  /*Array with the pair(s) with maximum days */
    arr.forEach((value) => {
      if (value[7] == maxvalue) { allPairs.push(value) }
    });

    return allPairs;

  }
  function transformforTable(arr) {

    var itemsToDisplay = [];
    arr.forEach((value) => {

      { itemsToDisplay.push([value[1], value[4], value[0], value[7]]) }
    });
    return itemsToDisplay
  }
  function ShowByPair() {
    /* After identifying the unique projects and pushing them into an array, each record 
    is checked and a new array is created containing the details of each employees who work on the same project in order to be processed 
    later on*/
    const allPairs = [];
    const pairDetails = [];
    const daysWorked = 0;

    projects.map((project) => {
      const pairDetails = [];
      pairDetails.push(project)
      values.map((value) => {
        if (project == value[1]) pairDetails.push(value[0], value[2], value[3])
      });

      if (pairDetails.length > 4) { allPairs.push(pairDetails) }
      /*checking length of added data ,to identidy which project has a pair*/
      allPairs.forEach((pair) => {
        if (pair.length < 8) { pair.push(DayCount(pair[2], pair[3], pair[5], pair[6])) }
        console.log("iteration")
      });
    });

    return allPairs
  }


  function MakeTable(props) {

    return ((props.rows.length > 0) ?
      <>
        <h2>{props.tableTitle}</h2>
        <table>
          <thead>
            <tr>
              {props.headers.map((val, i) => {
                return <th key={i}>{val}</th>;
              })}
            </tr>

          </thead>
          <tbody>
            {props.rows.map((value, index) => {
              return (
                <tr key={index}>
                  {value.map((val, i) => {
                    return <td key={i}>{val}</td>;

                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

      </> :
      null
    );
  }

  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];
        const projectArray = [];
        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
          projectArray.push(Object.values(d)[1]);
        });
        var uniqueProjects = [...new Set(projectArray)];

        setParsedData(results.data);
        setTableRows(rowsArray[0]);
        setValues(valuesArray);
        setProjects(uniqueProjects);

      }
    });
  };


  return (
    <>
      <div>
        <h1>Pair(s) of employees who have worked together on common projects for the longest period of time</h1>
        {/* File Uploader */}
        <input
          type="file"
          name="file"
          onChange={changeHandler}
          accept=".csv"
        />

        <MakeTable tableTitle="Content of the file:" headers={tableRows} rows={values} />
        <MakeTable tableTitle={"Pair(s)"} headers={headerTitles} rows={transformforTable(maxDaysPairs(ShowByPair()))} />
      </div>

    </>
  );

}

export default App;