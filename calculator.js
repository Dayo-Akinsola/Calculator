//Operators
const addition = (a, b) => a + b;

const subtraction = (a, b) => a - b;

const multiplication = (a, b) => a * b;

const division = (a, b) => a / b;

const power = (a, b) => a**b;

const squareRoot = a => a**(1/2);

const cubeRoot = a => a**(1/3);

const logBase2 = (a) => {
    let count = 0;
    while (a > 1){
        a = a / 2;
        count++;
    }

    return count;
}

const logBase10 = (a) => {
    let count = 0;
    while (a > 1){
        a = a / 10;
        count++;
    }

    return count;
}

const numbers = document.querySelectorAll('[data-number]');
const input = document.querySelector('#input');
const output = document.querySelector('#equation');
const operators = document.querySelectorAll('[data-operator]');
const equalSign = document.querySelector(['[data-result]']);
const decimalPoint = document.querySelector('[data-decimal]');
const powerButton = document.querySelector('[data-power]');
const rootButtons = document.querySelectorAll('[data-root]');
let operation;
const equation = [];
// Controls when numbers are inputted as a power (e.g. x^y when true, y when false).
let powerNumbers = false;

// function to use the operators
const operate = (operator, a, b) => operator(a, b);

const displayNumber = () => {
    numbers.forEach(number => {
        number.addEventListener('click', (event) =>{
            if (powerNumbers === false){
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
        })
    })

}

const operatorsDisplay = () => {
    operators.forEach(operator => {
        operator.addEventListener('click', (event) => {

            // Removes power if user clicks an operator without giving the power any values.
            const power = document.querySelector('#powerDisplay');
            const powerSymbol  = document.querySelector('#powerSymbol');
            if ( powerNumbers === true && (!power.textContent)){
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
                equation.push(event.target.dataset.operator);
                input.textContent += ` ${operator.dataset.operator} `;
            }


            // Checks for the index of the last operator added to the equations array and pushes the next number into the array.
            // This allows the user to perform multiple operations.
            else if (equation.length !== 1){
                // If statement to stop user from inputting two operators next to eachother
                if (input.textContent[input.textContent.length - 1] !== " ")
                {
                    const operationIndex = input.textContent.lastIndexOf(operation) + 2;
                    let number = input.textContent.substring(operationIndex);
                    equation.push(number);
                    equation.push(event.target.dataset.operator);
                    input.textContent += ` ${event.target.dataset.operator} `;
                    operation = event.target.dataset.operator;
                }
            }

            if ( equation.length === 1 && powerNumbers === true){
                equation[0] = input.textContent;
            }

            if (equation.length === 1){
                output.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
                equation.push(event.target.dataset.operator);
                input.textContent += ` ${event.target.dataset.operator} `;
                operation = event.target.dataset.operator;
            }
            decimalPoint.disabled = false;
            powerNumbers = false;
            powerButton.disabled = false;
            rootButtons.forEach(button => button.disabled = false);
        })
    })

}

// Shows decimal point on the display
const decimals = () => {
    decimalPoint.addEventListener('click', (event) => {
        if (powerNumbers === true){
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
    })
}

// Activates when the power button is clicked so that numbers clicked are exponents.
const powerDisplay = () => {
    powerButton.addEventListener('click', (event) => {
        if ( (!input.textContent)
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
            powerNumbers = true;
            addPower(power);
            powerButton.disabled = true;

        }

    })

}

const addPower = (span) => {
    numbers.forEach(number => {
        number.addEventListener('click', (event) => {
            if (powerNumbers === true){
                span.textContent += event.target.dataset.number;
            }
        })
    })

    rootButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (powerNumbers === true){
                span.textContent += event.target.dataset.root;
                rootButtons[0].disabled = true; rootButtons[1].disabled = true;
            }
        })
    })

}

const rootDisplay = () => {
    rootButtons.forEach(button => {
            button.addEventListener('click', (event) => {
            if (button === rootButtons[0] && powerNumbers === false && !document.querySelector('#powerDisplay')){
                input.textContent += event.target.dataset.root;
                rootButtons[0].disabled = true; rootButtons[1].disabled = true;
            }

            if (button === rootButtons[1] && powerNumbers === false && !document.querySelector('#powerDisplay')){
                input.textContent += event.target.dataset.root;
                button.disabled = true;
                rootButtons[0].disabled = true; rootButtons[1].disabled = true;
            }

        })
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
    if (multOrDiv === true){
        for (let i = 1; i < equation.length; i += 2){
            if (equation[i] === '/' || equation[i] === 'x'){
                operator = (equation[i] === '/') ? division : multiplication;
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

            if (multOrDiv === false){
                for (let i = 1; i < equation.length; i += 2){
                    if (equation[i] === '+' || equation[i] === '-'){
                        operator = (equation[i] === '+') ? addition : subtraction;
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
    }
}

const equals = () => {
    equalSign.addEventListener('click', (event) => {
        if (input.textContent[input.textContent.length - 1] !== " " && equation.length > 1)
        {
            const operatorIndex = input.textContent.lastIndexOf(operation) + 2;
            const lastNumber = input.textContent.substring(operatorIndex);
            equation.push(lastNumber);
            let result;
            let operator;
            
            solveRoot(result);

            solvePowers(result);

            solveEquation(result, operator);

            output.textContent = input.textContent + ' =';
            //Sets decimals to 4 decimal places and deals with floating point errors.
            input.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();

            decimalPoint.disabled = false;
            powerButton.disabled = false;
            powerNumbers = false;
            rootButtons.forEach(button => button.disabled = false);
        }
        })
}

const solve = () => {

    displayNumber();
    decimals();
    operatorsDisplay();
    equals();
    powerDisplay();
    rootDisplay();
}


solve();

