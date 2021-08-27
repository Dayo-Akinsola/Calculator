//Operators
const addition = (a, b) => a + b;

const subtraction = (a, b) => a - b;

const multiplication = (a, b) => a * b;

const division = (a, b) => a / b;

const power = (a, b) => a**b;

const numbers = document.querySelectorAll('[data-number]');
const input = document.querySelector('#input');
const output = document.querySelector('#equation')
const operators = document.querySelectorAll('[data-operator]');
const equalSign = document.querySelector(['[data-result]']);
const decimalPoint = document.querySelector('[data-decimal]');
const powerButton = document.querySelector('[data-power]');
console.log(powerButton);
let operation;
const equation = [];

// function to use the operators
const operate = (operator, a, b) => operator(a, b);

// function to display numbers on the calculator screen
const displayNumber = () => {
    numbers.forEach(number => {
        number.addEventListener('click', (event) =>{
            // if statment resets the calculator if a number is pressed after the equals sign is pressed
            if (equation.length === 1){
                input.textContent = `${number.dataset.number}`;
                equation.splice(0, 1);
                output.textContent = '';
            }
            else {
                input.textContent += `${number.dataset.number}`;
            }
        })
    })
}

const operatorsDisplay = () => {
    operators.forEach(operator => {
        operator.addEventListener('click', (event) => {
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

            if (equation.length === 1){
                output.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
                equation.push(event.target.dataset.operator);
                input.textContent += ` ${event.target.dataset.operator} `;
                operation = event.target.dataset.operator;
            }
            decimalPoint.disabled = false;
        })
    })

}

// Shows decimal point on the display
const decimals = () => {
    decimalPoint.addEventListener('click', (event) => {
        if (equation.length <= 1 && output.textContent !== ''){
            input.textContent = '0';
            equation.splice(0, 1);
            output.textContent = '';
        }

        else if (input.textContent[input.textContent.length - 1] === " "){
            input.textContent += '0';
        }
        input.textContent += '.'
        decimalPoint.disabled = true;
    })
}

const equals = () => {
    equalSign.addEventListener('click', (event) => {
        if (input.textContent[input.textContent.length - 1] !== " " && equation.length > 1)
        {
            const operatorIndex = input.textContent.lastIndexOf(operation) + 2;
            const lastNumber = input.textContent.substring(operatorIndex);
            equation.push(lastNumber);
            let operator;
            let result;
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
                            break
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
            output.textContent = input.textContent + ' =';
            //Sets decimals to 4 decimal places and deals with floating point errors.
            input.textContent = parseFloat(parseFloat(equation[0]).toFixed(4)).toString();
            decimalPoint.disabled = false;
        }
        })
}

const powerDisplay = () => {
    powerButton.addEventListener('click', (event) => {
        const powerTag = document.querySelector('#powerDisplay');
        console.log(powerTag);
        powerTag.textContent = '22';
        input.firstChild.nodeValue = '3';

    })
}



const solveEquation = () => {
    displayNumber();
    decimals();
    operatorsDisplay();
    equals();
    powerDisplay();
}


solveEquation();

