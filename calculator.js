//Basic operators
const addition = (a, b) => a + b;

const subtraction = (a, b) => a - b;

const multiplication = (a, b) => a * b;

const division = (a, b) => a / b;

// function to use the operators
const operate = (operator, a, b) => operator(a, b);

const displayNumber = (numbers, input, output, equation) => {
    console.log(numbers);
    numbers.forEach(number => {
        number.addEventListener('click', (event) =>{
            if (equation.length === 1){
                input.textContent = `${number.dataset.number}`;
                equation.splice(0, 1);
                output.textContent = '';
            }
            else {
                input.textContent += `${number.dataset.number}`;
                console.log(equation);
            }
        })
    })
}

//function to display a number on screen when it is clicked
const solveEquation = () => {
    const numbers = document.querySelectorAll('[data-number]');
    const input = document.querySelector('#input');
    const output = document.querySelector('#equation')
    const operators = document.querySelectorAll('[data-operator]');
    const equalSign = document.querySelector(['[data-result]']);
    let operation;
    const equation = [];
    displayNumber(numbers, input, output, equation);

    operators.forEach(operator => {
        operator.addEventListener('click', (event) => {
            // Adds operands and operators to equations array when there is nothing on the display.
            if (equation.length === 0)
            {
                let firstNumber = (input.textContent) ? input.textContent : input.textContent = '0';
                operation = operator.dataset.operator;
                equation.push(firstNumber);
                equation.push(event.target.dataset.operator);
                console.log(equation);
                input.textContent += ` ${operator.dataset.operator} `;
            }

            // Checks for the index of the last operator added to the equations array and adds the next number into the array.
            // This allows the user to perform multiple operations on multiple numbers.
            else if (equation.length !== 1){
                // If statement to stop user from input operators next to eachother
                console.log(equation);
                if (input.textContent[input.textContent.length - 1] !== " ")
                {
                    const operationIndex = input.textContent.lastIndexOf(operation) + 2;
                    console.log(operationIndex);
                    let number = input.textContent.substring(operationIndex);
                    equation.push(number);
                    equation.push(event.target.dataset.operator);
                    input.textContent += ` ${event.target.dataset.operator} `;
                    operation = event.target.dataset.operator;
                    console.log(equation);
                }
            }

            if (equation.length === 1){
                output.textContent = equation[0];
                equation.push(event.target.dataset.operator);
                input.textContent += ` ${event.target.dataset.operator} `;
                operation = event.target.dataset.operator;
                console.log(equation);
            }
        })
    })

    equalSign.addEventListener('click', (event) => {
        if (input.textContent[input.textContent.length - 1] !== " " && equation.length > 1)
        {
            const operatorIndex = input.textContent.lastIndexOf(operation) + 2;
            const lastNumber = input.textContent.substring(operatorIndex);
            equation.push(lastNumber);
            console.log(equation);
            let operator;
            let result;
            // Variable checks if there is a multiplication or division symbol in the equation
            let multOrDiv = true; 

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
            input.textContent = equation[0];
        }
        })
}


solveEquation();

