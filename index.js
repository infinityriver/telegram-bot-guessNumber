const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '6998360751:AAEJ030M9axx2SPGFHtNTAZoK8JfaKg2Vvk'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, ты должен его отгадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Start!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Play game'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://sl.combot.org/jjjfhfsdds_by_demybot/webp/16xf09f9983.webp')
            return bot.sendMessage(chatId, `Hello!`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Your name: ${msg.from.first_name}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'I do not understand..')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        console.log(msg)
        if(data === '/again'){
            return startGame(chatId)
        }

        if(parseInt(data) === chats[chatId]){
            return bot.sendMessage(chatId, `Wow, your WIN! Number = ${chats[chatId]}`, againOptions)
        }else {
            console.log(data)
            console.log(chats[chatId])
            return bot.sendMessage(chatId, `Oh no... Number = ${chats[chatId]}`,  againOptions)
        }
    })
    
}

start()