//кнопка выхода
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    const callback = response => {
        if (response.success) {
            location.reload();
        }
    }
    ApiConnector.logout(callback);
}

//получение информации о пользователе
ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
})

//получение текущих курсов валют
const ratesBoard = new RatesBoard();
const getRatesBoards = () => {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data)
        }
    })
}
getRatesBoards();
setInterval(() => {
    getRatesBoards();
}, 60000)

//пополнение денег
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function (data) {
    const callback = response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.true, `Успешно пополнено: ${data.amount} ${data.currency}`)
        } else {
            moneyManager.setMessage(response.false, 'Ошибка пополнения');
        }
    }
    ApiConnector.addMoney({ currency: data.currency, amount: data.amount }, callback)
}

//конвертация валюты
moneyManager.conversionMoneyCallback = function (data) {
    const callback = response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.true, `Вы успешно конвертировали ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`)
        } else {
            moneyManager.setMessage(response.false, response.error)
        }
    }
    ApiConnector.convertMoney({ fromCurrency: data.fromCurrency, targetCurrency: data.targetCurrency, fromAmount: data.fromAmount }, callback)
}

//перевод валюты
moneyManager.sendMoneyCallback = function (data) {
    const callback = response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.true, `Вы успешно перевели ${data.amount} ${data.currency}`)
        } else {
            moneyManager.setMessage(response.false, response.error);
        }
    }
    ApiConnector.transferMoney({ to: data.to, currency: data.currency, amount: data.amount }, callback)
}

//работа с избранным
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
})

//добавить пользователя в избранное
favoritesWidget.addUserCallback = function (data) {
    const callback = response => {
        if (response.success) {
            favoritesWidget.setMessage(response.true, `Пользователь ${data.name} успешно добавлен в избранное`)
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        } else {
            favoritesWidget.setMessage(response.false, response.error);
        }
    }
    ApiConnector.addUserToFavorites({ id: data.id, name: data.name }, callback)
}

//удалить пользователя из избранного
favoritesWidget.removeUserCallback = function (id) {
    const callback = response => {
        if (response.success) {
            favoritesWidget.setMessage(response.true, `Пользователь успешно удален`)
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        } else {
            favoritesWidget.setMessage(response.false, response.error);
        }
    }
    ApiConnector.removeUserFromFavorites(id, callback)
}