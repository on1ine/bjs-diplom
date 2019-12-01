'use strict';

//Решение первой части задания

class Profile {
	constructor({ username, name: { firstName, lastName }, password, }) {
		this.username = username;
		this.name = { firstName, lastName };
		this.password = password;
	}

	createUser(callback) {
		return ApiConnector.createUser({ username: this.username, name: this.name, password: this.password },
			(err, data) => {
				console.log(`Создание пользователя ${this.username}`);
				callback(err, data);
			});
	}

	performLogin(callback) {
		return ApiConnector.performLogin({ username: this.username, password: this.password },
			(err, data) => {
				console.log(`Авторизация пользователя ${this.username}`);
				callback(err, data);
			});
	}

	addMoney({ currency, amount }, callback) {
		return ApiConnector.addMoney({ currency, amount },
			(err, data) => {
				console.log(`Начисление ${amount} ${currency} пользователю ${this.username}`);
				callback(err, data);
			});
	}

	convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
		return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount },
			(err, data) => {
				console.log(`Конвертация ${fromCurrency} в ${targetAmount} ${targetCurrency}`);
				callback(err, data);
			});
	}

	transferMoney({ to, amount }, callback) {
		return ApiConnector.transferMoney({ to, amount },
			(err, data) => {
				console.log(`Перевод ${amount} Неткоинов пользователю ${to}`);
				callback(err, data);
			});
	}
}

function getStocks(callback) {
	return ApiConnector.getStocks((err, data) => {
		console.log(`Получение текущих курсов валют`);
		callback(err, data);
	})
}

//Решение второй части задания

function main() {
	const Anton = new Profile({
		username: 'anton',
		name: { firstName: 'Anton', lastName: 'Winogradov' },
		password: 'mypass',
	});

	const Irina = new Profile({
		username: 'irina',
		name: { firstName: 'Irina', lastName: 'Vinogradova' },
		password: 'mypass',
	});

	const amountOfmoney = { currency: 'EUR', amount: 500000 };

	getStocks((err, data) => {
		if (err) {
			console.error('Ошибка при получении курсов валют');
		}
		const stocksInfo = data[0];

		Anton.createUser((err, data) => {
			if (err) {
				console.error(`Ошибка при создании аккаунта ${Anton.username}`);
			}
			else {
				console.log(`Аккаунт ${Anton.username} успешно создан`);
				Anton.performLogin((err, data) => {
					if (err) {
						console.error(`Аккаунт ${Anton.username} не авторизован`);
					}
					else {
						console.log(`Аккаунт ${Anton.username} авторизован`);
						Anton.addMoney(amountOfmoney, (err, data) => {
							if (err) {
								console.error(`Ошибка зачисления на счет аккаунта ${Anton.username}`);
							}
							else {
								console.log(`Зачислено ${amountOfmoney.amount} ${amountOfmoney.currency} на аккаунт ${Anton.username}`);

								const targetAmount = stocksInfo['EUR_NETCOIN'] * amountOfmoney.amount;
								Anton.convertMoney({ fromCurrency: amountOfmoney.currency, targetCurrency: 'NETCOIN', targetAmount: targetAmount }, (err, data) => {
									if (err) {
										console.error(`Ошибка конвертации ${amountOfmoney.currency} в NETCOIN`);
									}
									else {
										console.log(`Успешная конвертация ${amountOfmoney.amount} ${amountOfmoney.currency} в ${targetAmount} NETCOIN`);

										Irina.createUser((err, data) => {
											if (err) {
												console.error(`Ошибка при создании аккаунта ${Irina.username}`);
											}
											else {
												console.log(`Аккаунт ${Irina.username} успешно создан`);
												Anton.transferMoney({ to: Irina.username, amount: targetAmount }, (err, data) => {
													if (err) {
														console.error(`Ошибка при переводе на акканунт ${Irina.username}`);
													}
													else {
														console.log(`Успешный перевод ${targetAmount} NETCOIN на аккаунт ${Irina.username}`);
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	});
}

main();