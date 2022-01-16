import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Modal } from 'antd';
import api from '../../utils/api';
import PropTypes from 'prop-types';

// const data = {
//   question_id: 9,
//   question_title: 'day la nam bao nhieu',
//   data: [
//     {
//       choice: '2019',
//       quantity: 1
//     },
//     {
//       choice: '2020',
//       quantity: 1
//     },
//     {
//       choice: '2021',
//       quantity: 1
//     },
//     {
//       choice: '2022',
//       quantity: 2
//     }
//   ]
// };
function SurveyStatistic({ id, context }) {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  console.log(id, context);
  const [labels, setLablels] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    setLablels(context ? context.choices : '');
  }, []);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: context.title
      }
    }
  };
  const data = {
    labels,
    datasets: [
      {
        data: context ? context.answers : [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  };
  return (
    <>
      <a style={{ color: '#228B22' }} onClick={() => setIsModalVisible(true)}>
        Statistic
      </a>
      <Modal
        title="Ümfrage statistic"
        visible={isModalVisible}
        footer={null}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Bar options={options} data={data} />
      </Modal>
    </>
  );
}

SurveyStatistic.propTypes = {};

export default SurveyStatistic;
