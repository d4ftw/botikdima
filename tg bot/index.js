const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,restartOptions} = require('./options')
const token= "7332335624:AAEJyUgQ1u9Hsr0WoSOQA2QfwA1e2mchHXM"

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId,"Сейчас я загадаю число, а тебе надо его отгадать!")
    const randomedNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomedNumber;
    await bot.sendMessage(chatId,"Отгадывай!", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/date', description: 'Время в данный момент'},
        {command: '/game', description: 'Угадайка'},
    ])

    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;
        const chatName = message.chat.first_name;
        const time = () => {
            const date = new Date();

            const formatNumber = (num) => String(num).padStart(2, '0');

            const day = formatNumber(date.getDate());
            const monthNames = [
                'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
                'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
            ];
            const month = monthNames[date.getMonth()]; // Месяцы в JavaScript начинаются с 0
            const year = date.getFullYear();
            const hours = formatNumber(date.getHours());
            const minutes = formatNumber(date.getMinutes());
            const seconds = formatNumber(date.getSeconds());

            return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
        }
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/cc1/11a/cc111a71-df25-4ff8-a7d1-113a5106d52d/1.jpg')
            return  bot.sendMessage(chatId, `привет ${chatName}, ты вызвал ботика димы2006, что тебе надо?`)

        }
        if (text === '/date') {
            return  bot.sendMessage(chatId, `Сейчас ${time()}`)
        }
        if (text === '/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId,"Такой команды не существует!")
    })

    bot.on('callback_query', async message => {
        const data = message.data;
        const chatId = message.message.chat.id;
        if (data === '/again'){
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId,`Ты угадал число! моё число было ${chats[chatId]}`, restartOptions)
        }
        else {
            return await bot.sendMessage(chatId,`Ты не угадал число... :( моё число было ${chats[chatId]}, твоё ${data}`, restartOptions)
        }

    })
}

start()
