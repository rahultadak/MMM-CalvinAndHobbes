# MMM-CalvinAndHobbes
 A module for MagicMirror2 that displays the daily Calvin and Hobbes comic.
### Manual install

- (1) Clone this repository in your `modules` folder, and install dependencies:
```bash
cd ~/MagicMirror/modules # adapt directory if you are using a different one
git clone https://github.com/rahultadak/MMM-CalvinAndHobbes.git
cd MMM-CalvinAndHobbes
npm install
```

- (2) Add the module to your `config/config.js` file, if you add a `position`, it will display the URL to the remote on the mirror.
```js
{
    module: 'MMM-CalvinAndHobbes',
			 position: 'top_center',
			 config: {
                invertColors: true,
                grayScale: true
            }
},
