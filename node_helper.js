const axios = require('axios');
const cheerio = require('cheerio');
const host = 'gocomics.com'
const comicPath = '/calvinandhobbes/';

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({

    start: function () {
        console.log("Starting node helper: " + this.name);
        this.today_url = '';
    },

    socketNotificationReceived: function(notification, payload) {
        console.log("Notification: " + notification + " Payload: " + payload);
        if(notification === "GET_COMIC") {
            console.log("Got notification to get the new comic");
            this.sendComic();
        }
    },

    fetchComicDom: function () {
        this.fetchValidComicLinkForToday();
        axios.get(this.today_url)
            .then(response => {
                // console.log(response.data);
                this.getComicLink(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    },

    fetchValidComicLinkForToday: function () {
        var today = new Date();
        var year = today.getUTCFullYear();
        var month = today.getUTCMonth() + 1;
        month = (month < 10 ? '0' : '') + month;
        var date = (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate();
        this.today_url = 'http://gocomics.com/calvinandhobbes/' + year + '/' + month + '/' + date;
    },

    getComicLink: function (html) {
        console.log("Trying to get comic link")
        comicUrl = ''
        const $ = cheerio.load(html);
        $('div.comic.container').each(function () {
            comicUrl = $(this).attr('data-image');
            console.log("Found data  url: " + $(this).attr('data-url'));
            console.log("Found comic url: " + comicUrl);
        });
    },

    sendComic: function () {
        this.fetchComicDom();
        comic = {text: this.comicUrl};
        console.log("Sending new comic");
        this.sendSocketNotification('COMIC', comic);
    },

});