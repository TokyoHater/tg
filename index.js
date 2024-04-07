const TelegramAPI = require("node-telegram-bot-api");

require('dotenv').config();

const token = (process.env.TOKEN)

const bot = new TelegramAPI(token, { polling: true });

const chats = {};

const {gameOptions, againOptions} = require('./options')

const startGame = async (chatID) => {
  await bot.sendMessage(
    chatID,
    `Сейчас я загадаю цифру от 0 до 9 , а ты должен её Угадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatID] = randomNumber;
  await bot.sendMessage(chatID, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начало работы с ботом" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatID,
        "https://tlgrm.ru/_/stickers/86d/582/86d582c8-f348-4df5-9275-2d1da94fe858/8.webp"
      );
      return bot.sendMessage(
        chatID,
        `Добро пожаловать в thBOT от автора Tokyo.Hater`
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatID,
        `Ваш текущий никнейм ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatID);

      return bot.sendMessage(chatID, "Я тебя не понимаю , попробуй ещё раз!)");
    }
  });
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatID = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatID);
    }
    if (Number(data) === chats[chatID]) {
      return await bot.sendMessage(
        chatID,
        `Поздравляю ты отгадал цифру! ${chats[chatID]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatID,
        `К сожалению ты не угадал , бот загадал цифру ${chats[chatID]}`,
        againOptions
      );
    }
  });
};
start();
