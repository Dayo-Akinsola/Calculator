//Operators
const addition = (a, b) => a + b;

const subtraction = (a, b) => a - b;

const multiplication = (a, b) => a * b;

const division = (a, b) => a / b;

const power = (a, b) => a**b;

const squareRoot = a => a**(1/2);

const cubeRoot = a => a**(1/3);

const g = 7;
const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

const factorial = a => {
    if (a === 0) return 1;
    if (Number.isInteger(a)){
        let total = a;
        while(a > 1){
            total = total * (a-1); 
            a = a - 1;
        }
    return total;
    }

    /*
    Used to calculate factorial of a decimal.
    Source for the function is apelsinapa's answer here: 
    https://stackoverflow.com/questions/15454183/how-to-make-a-function-that-computes-the-factorial-for-numbers-with-decimals
    */
    if (!Number.isInteger(a)){
        a = a + 1;
        if (a < 0.5) {return Math.PI / (Math.sin(Math.PI * a) * factorial(1 - a));}
        else{
            a -= 1;

            let x = C[0];
            for (let i = 1; i < g + 2; i++){
                x += C[i] / (a + i);
            }

            let t = a + g + 0.5;
            return Math.sqrt(2 * Math.PI) * Math.pow(t, (a + 0.5)) * Math.exp(-t) * x;
        }
    }
}

const numbers = document.querySelectorAll('[data-number]');
const input = document.querySelector('#input');
const output = document.querySelector('#equation');
const operators = document.querySelectorAll('[data-operator]');
const equalSign = document.querySelector(['[data-result]']);
const decimalPoint = document.querySelector('[data-decimal]');
const powerButton = document.querySelector('[data-power]');
const rootButtons = document.querySelectorAll('[data-root]');
const factorialButton = document.querySelector('[data-factorial]');
const clearButton = document.querySelector('[data-clear]');
const deleteButton = document.querySelector('[data-delete]');
let operation;
let equation = [];
// Controls when numbers are inputted as a exponent (e.g. x^y when true, y when false).
let exponents = false;

// function to use the operators
const operate = (operator, a, b) => operator(a, b);

const resetDisabledButtons = () => {
    decimalPoint.disabled = false;
    powerButton.disabled = false;
    factorialButton.disabled = false;
    exponents = false;
    rootButtons.forEach(button => button.disabled = false);
}

const clearDisplay = () => {
    clearButton.addEventListener('click', () => {
        while(equation.length > 0) equation.pop();
        input.textContent = "";
        output.textContent = "";

        resetDisabledButtons();
    })
}

const deleteDisplay = (element, listener) => {
    const operatorsArray = []
    
    operators.forEach(operator => operatorsArray.push(operator.dataset.operator));

    element.addEventListener(listener, (event) => {
        if (listener === 'click' || (listener === 'keydown' && event.key === deleteButton.dataset.delete)){
            const powerDisplay = document.querySelector('#powerDisplay');
            const powerSymbol = document.querySelector('#powerSymbol');
            let equationLength = 0;
            // Calculates length of all the strings together inside the equation array.
            for (let i = 0; i < equation.length; i++){
                equationLength += equation[i].length;
            }

            // Allows user to type these operations again when they have been deleted from the display
            if (input.textContent.slice(-1) === factorialButton.dataset.factorial) factorialButton.disabled = false;
            if (input.textContent.slice(-1) === decimalPoint.dataset.decimal) decimalPoint.disabled = false;
            rootButtons.forEach(button => {
                if (input.textContent.slice(-1) === button.dataset.root){
                    rootButtons[0].disabled = false; rootButtons[1].disabled = false;
                }
            })
            
            //Handles case where user deletes an operator
            if (operatorsArray.includes(equation[equation.length - 1]) 
                && operatorsArray.includes(input.textContent[input.textContent.length - 2])){
                equation.pop();
                input.textContent = input.textContent.substring(0, input.textContent.length - 3);

                if (equation[equation.length - 1].includes(factorialButton.dataset.factorial)) factorialButton.disabled = true;
                if (equation[equation.length - 1].includes(decimalPoint.dataset.decimal)) decimalPoint.disabled = true;
                rootButtons.forEach(button => {
                    if (equation[equation.length - 1].includes(button)){
                        rootButtons[0].disabled = true; rootButtons.disabled = true;
                    }
                })
            }

            /* 
                Checks if the length of the strings in the equations array and the length if the input text are the same.
                If they are not the same then the only the last index in the input textContent is removed.
                If they are the same the last index of the last element in the equations array will also be removed.
            */ 
            else if (equation[equation.length - 1] !== "" && equationLength !== input.textContent.replace(/\s+/g, '').length){
                // Deletes exponents instead of bases when the power button has been clicked
                if (exponents && powerDisplay.textContent.length === 1){
                    powerDisplay.remove(); powerSymbol.remove();
                    exponents = false;
                    powerButton.disabled = false;
                }
                
                else if (exponents){
                    powerDisplay.textContent = powerDisplay.textContent.substring(0, powerDisplay.textContent.length - 1);
                }
                
                else{
                input.textContent = input.textContent.substring(0, input.textContent.length - 1);
                }
                console.log("case2");   
            }

            else if (equationLength === input.textContent.replace(/\s+/g, '').length){
                console.log("case3");
                input.textContent = input.textContent.substring(0, input.textContent.length - 1);
                equation[equation.length - 1] = equation[equation.length - 1].substring(0, equation[equation.length - 1].length - 1);
            }

            if (equation[equation.length - 1] === "") equation.pop();
        }
        })
  
}

//Shows number on calculator display when clicked
const displayNumber = (element, listener) => {
    numbers.forEach(number => {
        if (listener === 'click') element = number;
        element.addEventListener(listener, (event) =>{
            if (listener === 'click' || (listener === 'keydown' && event.key === number.dataset.number)){
                if (exponents === false && input.textContent[input.textContent.length - 1] !== factorialButton.dataset.factorial){
                    // if statment resets the calculator if a number is pressed after the equals sign is pressed
                    if (equation.length === 1){
                        input.textContent = `${number.dataset.number}`;
                        equation.splice(0, 1);
                        output.textContent = '';
                    }
                    else {
                        input.textContent += `${number.dataset.number}`;
                    }
                }
            }
        })
    })

}

const operatorsDisplay = (element, listener) => {
    operators.forEach(operator => {
        if (listener === 'click') element = operator;
        element.addEventListener(listener, (event) => {
            if (listener === 'click' || event.key === operator.dataset.key){
                // Removes power if user clicks an operator without giving the power any values.
                const power = document.querySelector('#powerDisplay');
                const powerSymbol  = document.querySelector('#powerSymbol');
                if ( exponents && power && (!power.textContent)){
                    power.remove(); powerSymbol.remove();
                }

                // Does same as above for roots.
                rootButtons.forEach(button => {
                    if (input.textContent[input.textContent.length - 1] === button.dataset.root){
                        input.textContent += '0';
                    }
                })

                // Adds operands and operators to equations array when there is nothing on the display.
                if (equation.length === 0)
                {
                    let firstNumber = (input.textContent) ? input.textContent : input.textContent = '0';
                    operation = operator.dataset.operator;
                    equation.push(firstNumber);
                    equation.push(operator.dataset.operator);
                    input.textContent += ` ${operator.dataset.operator} `;
                }


                // Checks for the index of the last operator added to the equations array and pushes the next number into the array.
                // This allows the user to perform multiple operations.
                else if (equation.length !== 1){
                    // If statement to stop user from inputting two operators next to eachother
                    if (input.textContent[input.textContent.length - 1] !== " ")
                    {
                        input.textContent += ` ${operator.dataset.operator} `;
                        equation = input.textContent.split(' ');
                        equation.pop();
                        operation = operator.dataset.operator;
                    }
                }

                if ( equation.length === 1 && exponents){
                    equation[0] = input.textContent;
                }

                if (equation.length === 1){
                    output.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
                    equation.push(operator.dataset.operator);
                    input.textContent += ` ${operator.dataset.operator} `;
                    operation = operator.dataset.operator;
                }
                resetDisabledButtons();
            }
        })
    })

}

// Shows decimal point on the display
const decimals = (element, listener) => {
    element.addEventListener(listener, (event) => {
        if (listener === 'click' || (listener === 'keydown' && event.key === decimalPoint.dataset.decimal)){
            if (input.textContent[input.textContent.length - 1] !== factorialButton.dataset.factorial && !decimalPoint.disabled){
                if (exponents){
                    const power = document.querySelector('#powerDisplay');
                    if (power.textContent.length === 0){
                        power.textContent = '0';
                    }

                    power.textContent += '.';
                }

                else if (equation.length === 0 && !input.textContent){
                    input.textContent = '0';
                    input.textContent += '.';
                }

                else if (equation.length <= 1 && output.textContent !== ''){
                    input.textContent = '0';
                    equation.splice(0, 1);
                    output.textContent = '';
                    input.textContent += '.';
                }

                else if (input.textContent[input.textContent.length - 1] === " "){
                    input.textContent += '0';
                    input.textContent += '.';
                }

                else{
                    input.textContent += '.';
                }
                decimalPoint.disabled = true;
            }
        }
    })

}

// Activates when the power button is clicked so that numbers clicked while active are exponents.
const powerDisplay = (element, listener) => {
    element.addEventListener(listener, (event) => {
        if (listener === 'click' || event.key === powerButton.dataset.power && !powerButton.disabled){
            if ((!input.textContent)
                || input.textContent[input.textContent.length - 1] === ' '
                || input.textContent[input.textContent.length - 1] === rootButtons[0].dataset.root
                || input.textContent[input.textContent.length - 1] === rootButtons[1].dataset.root){

                input.textContent += '0';
            }

            if (input.textContent[input.textContent.length - 1] !== "."){
                const powerSymbol = document.createElement('span');
                const power = document.createElement('span');
                powerSymbol.id = 'powerSymbol';
                powerSymbol.textContent = '^';
                power.id = 'powerDisplay';
                input.appendChild(powerSymbol);
                input.appendChild(power);
                exponents = true;
                addPower(power);
                powerButton.disabled = true;

            }
        }

    })

}

const addPower = (span) => {
    numbers.forEach(number => {
        number.addEventListener('click', (event) => {
            if (exponents && span.textContent[span.textContent.length - 1] !== factorialButton.dataset.factorial){
                span.textContent += event.target.dataset.number;
            }
        })
    })

    rootButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (exponents){
                span.textContent += button.dataset.root;
                rootButtons[0].disabled = true; rootButtons[1].disabled = true;
            }
        })
    })

    factorialButton.addEventListener('click', (event) => {
        const fact = event.target.dataset.factorial;
        if (exponents){
             if (isNaN(span.textContent[span.textContent.length - 1]) || span.textContent.length === 0 
             || span.textContent[span.textContent.length - 1] === " "){
             span.textContent += "0";
             span.textContent += fact;
            }

            else{
                span.textContent += `${fact}`;
            }
            factorialButton.disabled = true;
            }
        })

}

const rootDisplay = (element, listener) => {
    rootButtons.forEach(button => {
        if (listener === 'click') element = button;
            element.addEventListener(listener, (event) => {
                console.log(event.key);
                console.log(button.dataset.key);
                if (listener === 'click' || event.key === button.dataset.key && !button.disabled){
                    // Preserves previous answer if user clicks one of the root symbols after an equation is solved.
                    if (equation.length === 1){
                        output.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
                        equation.splice(0, 1);
                        input.textContent += `${button.dataset.root}`;
                        rootButtons[0].disabled = true; rootButtons[1].disabled = true;
                    }

                    else if (button === rootButtons[0] && exponents === false && !document.querySelector('#powerDisplay')){
                        input.textContent += button.dataset.root;
                        rootButtons[0].disabled = true; rootButtons[1].disabled = true;
                    }

                    else if (button === rootButtons[1] && exponents === false && !document.querySelector('#powerDisplay')){
                        input.textContent += button.dataset.root;
                        button.disabled = true;
                        rootButtons[0].disabled = true; rootButtons[1].disabled = true;
                    }
                }
            })
        })
}

const factorialDisplay = (element, listener) => {
    element.addEventListener(listener, (event) => {
        if (listener === 'click' || event.key === factorialButton.dataset.factorial && !factorialButton.disabled){
            const fact = factorialButton.dataset.factorial;
            if (exponents === false){
                // Ensures that factorial symbol is only allowed after a number
                if (isNaN(input.textContent[input.textContent.length - 1]) || input.textContent.length === 0 
                    || input.textContent[input.textContent.length - 1] === " "){
                    input.textContent += "0";
                    input.textContent += fact;
                }

                else if (equation.length === 1){
                    output.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
                    equation.slice(0,1);
                    input.textContent = output.textContent + fact;
                    equation[0] += fact;
                    
                }

                else{
                    input.textContent += `${fact}`;
                }
                factorialButton.disabled = true;
            }
        }

    })
}

const solvePowers = (result) => {
    // Goes through the equations array an checks for any ^ so powers can be solved first
    for (let i in equation){
        if (typeof equation[i] == "string" && equation[i].indexOf('^') > -1){
            const caratIndex = equation[i].indexOf('^');
            const base = equation[i].slice(0, caratIndex);
            const exponent = equation[i].slice(caratIndex + 1);
            result = operate(power, parseFloat(base), parseFloat(exponent));
            result = result.toString();
            equation.splice(i, 1, result);
        }
    }
}


const solveEquation = (result, operator) => {
// Variable checks if there is a multiplication or division symbol in the equation
let multOrDiv = true;

// Solves the calculation in the equations array according to operator precedence
while (equation.length !== 1){
    if (multOrDiv){
        /* 
            If a multiplication or division sign is found in the equation array then the
            operation found is performed on the values to the left and right of the sign.
            Repeats until there are no more multiplication or division signs in the array.
        */
        for (let i = 1; i < equation.length; i += 2){
            if (equation[i] === operators[3].dataset.operator || equation[i] === operators[0].dataset.operator){
                operator = (equation[i] === operators[3].dataset.operator) ? division : multiplication;
                result = operate(operator, parseFloat(equation[i - 1]), parseFloat(equation[i + 1]));
                result = result.toString();
                equation.splice(i-1, 3, result);
                multOrDiv = true;
                break;
                }
            else{
                multOrDiv = false;
                }
            }
            }
            /* 
                Repeats the process above for addition and subtraction calculations after
                there are no more multiplication or division signs in the array.
            */
            if (multOrDiv === false){
                for (let i = 1; i < equation.length; i += 2){
                    if (equation[i] === operators[2].dataset.operator || equation[i] === operators[1].dataset.operator){
                        operator = (equation[i] === operators[2].dataset.operator) ? addition : subtraction;
                        result = operate(operator, parseFloat(equation[i - 1]), parseFloat(equation[i + 1]));
                        result = result.toString();
                        equation.splice(i-1, 3, result);
                        break;
                        }
                    }
                }
            }
}

const solveRoot = (result) => {
    const square = rootButtons[0].dataset.root;
    const cube = rootButtons[1].dataset.root;
    let root;
    let rootIndex;
    const lastValue = input.textContent[input.textContent.length - 1];
    if (lastValue === square || lastValue === cube){
        input.textContent += '0'; equation[equation.length - 1] += '0';
    } 
    for (let i in equation){
        // Solves case when there is just a root and a base i.e 3**0.5
        if ((equation[i][0] === square
            || equation[i][0] === cube)
            && equation[i].includes('^') === false){
            
            if (equation[i][0] === square) result = squareRoot(parseFloat(equation[i].slice(1)));
            
            else result = cubeRoot(parseFloat(equation[i].slice(1)));

            equation[i] = result.toString();
        }
        
        // Solves cases where there is a multiple in front of the root i.e 3(3**0.5)
        else if (isNaN(equation[i][0]) === false 
            && equation[i].includes('^') === false
            && (equation[i].includes(square) || equation[i].includes(cube))){
                
                if (equation[i].includes(square)){
                    rootIndex = equation[i].indexOf(square);
                    root = squareRoot;
                } 
                else {
                    rootIndex = equation[i].indexOf(cube);
                    root = cubeRoot;
                }

                const multiple = equation[i].slice(0, rootIndex);
                result = root(parseFloat(equation[i].slice(rootIndex + 1)));
                result = parseFloat(multiple) * result;
                equation[i] = result.toString();

        }

        // Solves case when power and root are both present with the power coming before the root i.e 3^2**0.5
        else if (equation[i].includes('^') 
            && (equation[i].includes(square) || equation[i].includes(cube))){
                let rootType;
                if (equation[i].includes(square)){
                    rootIndex = equation[i].indexOf(square);
                    root = squareRoot;
                    rootType = square;
                } 
                else {
                    rootIndex = equation[i].indexOf(cube);
                    root = cubeRoot;
                    rootType = cube;
                }
                // Case when power comes before the root in the number
                if (equation[i].indexOf('^') < rootIndex){
                    const powerBase = equation[i].slice(0, equation[i].indexOf('^'));
                    const exponent = equation[i].slice(equation[i].indexOf('^') + 1);

                    // If there is a number before the root we have to create a multiple variable
                    if (exponent[0] !== rootType){
                        const multiple = exponent.slice(0, exponent.indexOf(rootType));
                        const rootValue = exponent.slice(exponent.indexOf(rootType) + 1);
                        result = root(parseFloat(rootValue)) * parseFloat(multiple);
                        result = parseFloat(powerBase) ** result;
                        equation[i] = result.toString();
                    }

                    else if (exponent[0] === rootType){
                        const rootBase = exponent.slice(1);
                        result = root(parseFloat(rootBase));
                        result = parseFloat(powerBase) ** result;
                        equation[i] = result.toString();
                    }
                }

                // Case when the root comes before the power in the number
                else if (equation[i].indexOf('^') > rootIndex){
                    let multiple;
                    let rootBase;
                    
                    if (rootIndex !== 0){
                        multiple = equation[i].slice(0, rootIndex);
                        rootBase = equation[i].slice(rootIndex + 1);
                    }
                    else{
                        rootBase = equation[i].slice(rootIndex + 1);
                    }

                    const powerBase = rootBase.slice(0, rootBase.indexOf('^'));
                    const exponent = rootBase.slice(rootBase.indexOf('^') + 1)
                    result = root(parseFloat(powerBase) ** parseFloat(exponent));
                    if (equation[i].indexOf(rootType) !== 0) result = result * parseFloat(multiple);

                    equation[i] = result.toString();
                }
            }
    }
}

const solveFactorial = (result) => {
    const fact = factorialButton.dataset.factorial;
    const decimal = decimalPoint.dataset.decimal;
    for (let i in equation){
        if (equation[i].includes(fact)){
            /* 
            Finds the '!' symbol in the string then the while loop goes backwards from this point until 
            the start of the factorial is found. 
            */
    
            let factSymbolIndex = equation[i].indexOf(fact);
            let factStartIndex = factSymbolIndex;

            while ((equation[i][factStartIndex - 1] === decimal || !isNaN(equation[i][factStartIndex - 1])) && factStartIndex > 0)
            factStartIndex--;

            // Replaces factorial equation with the result in the string
            const factorialString = equation[i].slice(factStartIndex, factSymbolIndex + 1);
            result = factorial(parseFloat(factorialString));
            equation[i] = equation[i].replace(factorialString, result.toString());

        }

    }
}

const equals = (element, listener) => {
    element.addEventListener(listener, (event) => {
        if (listener === 'click' || event.key === equalSign.dataset.result){
            if (input.textContent[input.textContent.length - 1] !== " " && equation.length >= 0 && input.textContent)
            {
                //Appends a zero the end of the input when the last index of the input is not a number
                if (isNaN(input.textContent[input.textContent.length - 1]) 
                    && input.textContent[input.textContent.length - 1] != factorialButton.dataset.factorial){
                        input.textContent += 0; 
                        equation = input.textContent.split(' ');
                        equation.pop();
                }

                else if (equation.length !== 0 && isNaN(equation[equation.length - 1].slice(-1))){
                    const operatorIndex = input.textContent.lastIndexOf(operation) + 2;
                    const lastNumber = input.textContent.substring(operatorIndex);
                    equation.push(lastNumber);
                }
                let result;
                let operator;

                if (equation.length == 1 || equation.length == 2){
                    equation[0] = input.textContent;
                    equation.splice(1, 1);
                }

                if (equation.length === 0){
                    equation[0] = input.textContent;
                }


                solveFactorial(result);
                solveRoot(result);
                solvePowers(result);
                solveEquation(result, operator);

                output.textContent = input.textContent + ' =';
                //Sets decimals to 4 decimal places and deals with floating point errors.
                input.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
                if (equation[0] === 'NaN') input.textContent = 'Math ERROR';

                resetDisabledButtons();
                
            }
        }
    })
}

const solve = () => {

    displayNumber(document, 'keydown');
    displayNumber(numbers, 'click');

    decimals(document, 'keydown');
    decimals(decimalPoint, 'click');
    
    operatorsDisplay(document, 'keydown');
    operatorsDisplay(operators, 'click');
    
    equals(document, 'keydown');
    equals(equalSign, 'click');

    powerDisplay(document, 'keydown');
    powerDisplay(powerButton, 'click');
    
    rootDisplay(document, 'keydown');
    rootDisplay(rootButtons, 'click');

    factorialDisplay(document, 'keydown');
    factorialDisplay(factorialButton, 'click');

    clearDisplay();

    deleteDisplay(document, 'keydown');
    deleteDisplay(deleteButton, 'click');
}

solve();

