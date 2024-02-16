# SpotyCards - Trasform the way we see links!
Introducing GoShort – your ultimate destination for hassle-free **URL shortening!** With the power of __Rebrand.ly's__ RESTful API, GoShort empowers users like **you** to effortlessly create personalized and branded shortened links in just a **few clicks**.

## Table of contents 🗃

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### Screenshot 📷

## Desktop Layout 💻

![](./images/GoShort_desktop.png)

## Mobile Layout 📱

![](./images/GoShort_mobile.gif)

### The challenge 🎯

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- Shorten any valid URL
- See a list of their shortened links
- Copy the shortened link to their clipboard in a single click
- Receive an error message when the `form` is submitted if:
  - The `input` field is empty

### Links 🔗

- Live Site URL: [GOShort Live Link](https://carvso.github.io/SpotyCard/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- Vanilla JavaScript

### What I learned 📚

To realize this project i first started to look at the design that i was imagening and converted it into figma draft. The hero image was also realized by me into figma using an image generated via "blush" and vector image of a cutting url and some vectors to add movement to the image.
Then, I started building the skeleton of the web application, the HTML, and added css styling.The major things I've learnt during this project for the css part are:
```css
.opacity:hover{
    opacity: .5;
}
```
Added an opacity class, targetting the pseudo class ":hover" to change opacity when hovering the btns.

But i also learnt how to set an element with position absolute fixed to its relative parent, for example to fix an image relatively to the hero section like this:

```css
.blue-line{     /* <-- child element */
    border: .2em solid var(--WowBlue);
    width: 70%;
    position: absolute;
    bottom: 7em;
}
.about-cards{   /* <-- parent element */
    display: flex;
    gap: 2em;
    position: relative;
}
```
Another trick I've learnt, is relatively to mobile responsiveness: if you give at the html (absolute parent) a font size of 50%, the layout will automatically fit in your content even for mobile users, making it responsive

```css
@media (max-width: 879px){
    html{
        font-size: 50%;
    }
}
``` 

For the JavaScript part, I created a function that validates the inputs, as I did with my prev. project **AgeCalculator App**:
```js
const validateInputs = () => {
    const urlValue = url.value;
    const slashtagValue = slashtag.value;
    
    if(urlValue === '') {
        setError(url, 'Questo campo è necessario');
    }
    else {
        setSuccess(url);
    }

    if(slashtagValue === '') {
        setError(slashtag, 'Questo campo è necessario');
    }
    else {
        setSuccess(slashtag);
    }
};
const setError = (element, message) => {
    element.placeholder = message;
    element.value = "";
};  
const setSuccess = (element) => {
    element.placeholder = "Successful";
    element.placeholder = "Shorten";
}; 
```

Then, I needed to make a fetch post request to the __Rebrand.ly__ API's in order to get me returned an object which containes the shortened link and other parameters, that, for the purpose of this app, are no needed.
To achieve this, i created an __async__ function named **dataFetch**:

```js
const headers = {
  'Content-Type': 'application/json',
  'apikey': API_KEY,
};

async function dataFetch(){
    const data = {
        destination: url.value,     //<-- input tag
        slashtag: slashtag.value,   //<-- input tag
        domain: {
          fullName: ''              //<-- empty because we are going to use rebrandly domain
        }
    }
    const response = await fetch(API_URL, {
        method: 'POST',   
        headers: headers,
        body: JSON.stringify(data)  //<-- It converts JS Object in to strings
    });
    return response.json();         //<--Used to read and parse the result of the promise  
}
```

I want also to highlight how I managed the needs to update the height of the **about** section every time the new div, **shorten-link-wrapper**, is appended to the DOM tree. I created a function called __addHeightToSection()__ that takes the actual height of the page (in pixels) and then modifies it, adding 150px. The function is then nested inside createShortenLinkElement, and called every time a new shotened link is generated: 

```js
function addHeightToSection(){
    const sectionAbout = document.querySelector('.about');
    const sectionHeight = sectionAbout.offsetHeight; 

    const newSectionHeight = sectionHeight + 150; 
    sectionAbout.style.height = newSectionHeight + 'px'; 
}
```

### Continued development 👨‍💻

In future I want to focus more on RESTful APIS to master not only the managing but also the creation of those.

## Author 👤

- Website - [Vincenzo Caruso](https://www.carvso.me)
- LinkedIn - [Vincenzo Caruso](https://www.linkedin.com/in/vincenzo-carvso/)