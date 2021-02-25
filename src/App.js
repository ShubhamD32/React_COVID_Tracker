import React from 'react';

import { Cards, CountryPicker, Chart } from './components';
import { fetchData } from './api/';
import styles from './App.module.css';
import coronaImage from './images/coronaImage.png';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Paper, Switch } from '@material-ui/core';

class App extends React.Component {
	state = {
		data: {},
		country: '',
		darkMode: false,
	};

	async componentDidMount() {
		const data = await fetchData();

		this.setState({ data });
	}

	handleCountryChange = async (country) => {
		const data = await fetchData(country);

		this.setState({ data, country });
	};

	render() {
		const { data, country, darkMode } = this.state;

		const theme = createMuiTheme({
			palette: {
				type: darkMode ? 'dark' : 'light',
			},
		});

		return (
			<ThemeProvider theme={theme}>
				<Paper>
					<div className={styles.container}>
						<Switch
							color='primary'
							className={styles.toggle}
							checked={darkMode}
							onChange={() => {
								this.setState({ darkMode: !darkMode });
							}}
						/>

						<img
							src={coronaImage}
							alt='COVID description'
							className={styles.image}
						/>
						<Cards data={data} />
						<CountryPicker handleCountryChange={this.handleCountryChange} />
						<Chart data={data} country={country} darkMode={darkMode} />
					</div>
				</Paper>
			</ThemeProvider>
		);
	}
}

export default App;
