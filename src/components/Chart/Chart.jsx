import React, { useState, useEffect } from 'react';

import { fetchDailyData } from '../../api';

import { Line, Bar } from 'react-chartjs-2';

import styles from './Chart.module.css';

import html2canvas from 'html2canvas';

import { jsPDF } from 'jspdf';

const Chart = ({
	data: { confirmed, recovered, deaths },
	country,
	darkMode,
}) => {
	const [dailyData, setDailyData] = useState([]);

	useEffect(() => {
		const fetchAPI = async () => {
			setDailyData(await fetchDailyData());
		};

		fetchAPI();
	}, []);

	const div2PDF = (e) => {

		let input = window.document.getElementsByClassName(
			'chartjs-render-monitor',
		)[0];

		console.log(input);

		var img_base64 = input.toDataURL('image/png');

		console.log(img_base64);

		const pdf = new jsPDF();
		pdf.addImage(img_base64, 'JPEG', 0, 0, 200, 200);
		pdf.save('chart.pdf');
	};

	const lineChart = dailyData.length ? (
		<Line
			data={{
				labels: dailyData.map(({ date }) => date),
				datasets: [
					{
						data: dailyData.map(({ confirmed }) => confirmed),
						label: 'Infected',
						borderColor: '#3333ff',
						fill: true,
						backgroundColor: 'rgba(0,0,255,0.5)',
					},
					{
						data: dailyData.map(({ deaths }) => deaths),
						label: 'Deaths',
						borderColor: 'red',
						fill: true,
						backgroundColor: 'rgba(255,0,0,0.5)',
					},
				],
			}}
			options={{
				legend: {
					labels: {
						fontColor: darkMode ? 'white' : 'black',
					},
				},
				scales: {
					yAxes: [
						{
							ticks: {
								fontColor: darkMode ? '#fff' : '#333',
							},
						},
					],
					xAxes: [
						{
							ticks: {
								fontColor: darkMode ? '#fff' : '#333',
							},
						},
					],
				},
			}}
		/>
	) : null;

	const barChart = confirmed ? (
		<Bar
			data={{
				labels: ['Infected', 'Recovered', 'Deaths'],
				datasets: [
					{
						label: 'People',
						backgroundColor: [
							'rgba(0,0,255,0.5)',
							'rgba(0,255,0,0.5)',
							'rgba(255,0,0,0.5)',
						],
						data: [confirmed.value, recovered.value, deaths.value],
					},
				],
			}}
			options={{
				legend: { display: false },
				title: {
					display: true,
					text: `Current State in ${country}`,
					fontColor: darkMode ? '#fff' : '#333',
				},
				scales: {
					yAxes: [
						{
							ticks: {
								fontColor: darkMode ? '#fff' : '#333',
							},
						},
					],
					xAxes: [
						{
							ticks: {
								fontColor: darkMode ? '#fff' : '#333',
							},
						},
					],
				},
			}}
		/>
	) : null;

	return (
		<div className={`${styles.container} div2PDF`}>
			{country ? barChart : lineChart}
			<button onClick={(e) => div2PDF(e)} className={styles.pdf_btn}>
				Convert to PDF
			</button>
		</div>
	);
};

export default Chart;
