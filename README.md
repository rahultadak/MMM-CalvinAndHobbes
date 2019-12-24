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

- (2) Add the module to your `config/config.js` file.
```js
{
    module: 'MMM-CalvinAndHobbes',
	position: 'middle_center',
	config: {
        invertColors: false, # Optional, default: false
        grayScale: false, # Optional, default: false
        updateInterval: 1000 * 60 * 60 * 12, // 12 Hr
    }
},

```
# Screenshot
![MMM-CalvinAndHobbes Screenshot](.screenshots/CAH_screenshot.png)
