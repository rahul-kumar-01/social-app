import React from 'react'
import { useState,useEffect } from 'react';
import {proxy} from '../../utils/proxy.js';



export default function Dashboard() {
  // const [sector, setSector] = useState({trendingSector: "- - -"});
  // const [topic, setTopic] = useState({trendingTopic: "- - -"});
  // const [lastYear, setLastYear] = useState({countForYear2024:'- - -'});
  // const [startYear, setStartYear] = useState({countForYear2024:'- - -'});

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const urls = [
  //       'http://localhost:8000/api/data/get-data/sector',
  //       'http://localhost:8000/api/data/get-data/topic',
  //       'http://localhost:8000/api/data/get-data/end-year',
  //       'http://localhost:8000/api/data/get-data/start-year'
  //     ];
  //     const responses = await Promise.all(urls.map(url => fetch(url)));
  //     const jsonResponses = await Promise.all(responses.map(response => response.json()));
  //     const [sectorData, topicData, lastYearData, startYearData] = jsonResponses;
  //     setSector(sectorData);
  //     setTopic(topicData);
  //     setLastYear(lastYearData);
  //     setStartYear(startYearData);
  //   };
  //   fetchData();
  // }, []);

  return (
    <>

      <div className="py-2">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, John Doe</p>
      </div>

      
    </>
  )
}


