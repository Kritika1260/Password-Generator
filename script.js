const inputSlider = document.querySelector("[data-lengthSlider]")
const lenghtDisplay = document.querySelector("[data-lengthNumber]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]") 
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const indicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector(".generateButton")
const allCheckbox = document.querySelectorAll("input[type=checkbox]")
const symbols = '`~!@#$%^&*()_-+={[}]|\;:"<,>.?/'

let password =""
let passwordLength = 10
let checkCount = 0 
handleSlider()
//set strength colour to grey
setIndicator("#ccc")

//set password length according to the slider value
//password length ko ui pr reflect krwata h
function handleSlider(){
    inputSlider.value = passwordLength
    lenghtDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min
    //this will give value from min to max
    //usually the value of random is from 0 to 1
    //where 0 is inclusive and 1 is exclusive
}

// function generateRandomNumber(){
//     return getRandomInteger(0, 9)
// }

function generateRandomNumber() {
    return getRandomInteger(0, 10).toString();
}


function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97, 123)) 
    //97-a
    //123-z
    //converted ascii value number to character
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91)) 
    //for A and Z
}

//how we will do symbols because we dont know their ascii value
//we will create a string which will store all the symbols and when we will want a symbol we will access some random index of the string

function generateSymbol(){
    const randomNum = getRandomInteger(0, symbols.length)
    return symbols.charAt(randomNum)
}

function calcStrength(){
    let hasUpper = false
    let hasLower = false
    let hasNum = false
    let hasSym = false

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0")
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        //copy password to keyboard
        copyMsg.innerText = "Copied"
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    //to make copy span visible (it shoes copied when we choose copy icon)
    copyMsg.classList.add('active')
    //remove the copy msg after 2 sec
    setTimeout(() =>{
        copyMsg.classList.remove("active")
    }, 2000)
}

function shufflePassword(array){
    //algo is availiable
    //fisher yates method = apply on array to shuffle it
    for (let i = array.length - 1; i > 0 ; i--) {
        //find random j
        const j = Math.floor(Math.random() * (i+1))
        //do swapping
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    let str =""
    array.forEach((el) => (str += el))
    return str

}

function handleCheckboxChange(){
    checkCount=0;
    // allCheckbox.forEach((check) =>{
    //     if(checkbox.checked)
    //     { checkCount++ }
    allCheckbox.forEach((check) => {
    if (check.checked) {
        checkCount++;
    }
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount
        handleSlider()
    }
}

allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange)
})

inputSlider.addEventListener("input", (e) =>{
    passwordLength = e.target.value
    handleSlider()
})

copyBtn.addEventListener("click", () =>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener("click", () =>{
    //none of the checkbox is selected
    if(checkCount == 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount
        handleSlider()
    }

    //find new password
    //remove old pass
    password = ""

    //lets pur the dtuff mentioned by checkboxes
    //find which checkbox is checked 

    // if(uppercaseCheck.checked){
    //     password += generateUppercase()
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase()
    // }

    // if(numersCheck.checked){
    //     password += generateRandomNumber
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol()
    // }

    let funArr =[]
    if(uppercaseCheck.checked){
        funArr.push(generateUppercase)
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowercase)
    }

    if(numbersCheck.checked){
        funArr.push(generateRandomNumber)
    }

    if(symbolsCheck.checked){
        funArr.push(generateSymbol)
    }

    //compulsary addition of the checked boxes
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]()
    }

    //remaining addition
    for (let i = 0; i< passwordLength - funArr.length;  i++) {
      let randIndex = getRandomInteger(0, funArr.length)
      password += funArr[randIndex]()
    }

    //shuffle the password
    password = shufflePassword(Array.from(password))

    //show in UI
    passwordDisplay.value = password

    //calculate strength
    calcStrength()
})