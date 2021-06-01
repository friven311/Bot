require('dotenv').config()
const telegrafModule = require('telegraf');
const api = require('covid19-api');

const Telegraf = telegrafModule.Telegraf;
const Markup = telegrafModule.Markup;

const bot = new Telegraf(process.env.botToken);

bot.start((ctx) => ctx.reply(`
Привет, ${ctx.message.from.first_name}!
Бот для того, чтобы узнать статистику о короне.
Введи название страны латиницей.
Посмотреть список стран можно командой /help.
`));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on('text', async (ctx) => {
  let data = {};

  try {
  data = await api.getReportsByCountries(ctx.message.text);

  const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечилось: ${data[0][0].recovered}
  `;
  ctx.reply(formatData);
} catch {
  console.log('error');
  ctx.reply('Ошибка, такой страны нет');
}
});
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
console.log('Бот запущен');
