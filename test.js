import axios from 'axios';
import cheerio from 'cheerio';

// const axios = require('axios');
// const cheerio = require('cheerio');

const html = await axios.get('https://www.gocomics.com/calvinandhobbes/2025/04/03');
const $ = cheerio.load(html.data);

// Find the image inside the button inside the div with class "Comic_comic__7K2CQ"
const imgSrc = $('div.Comic_comic__7K2CQ button img').attr('src');

console.log('Image src:', imgSrc);






