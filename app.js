/*
Written by John S. Haworth 4.3.2020

This program takes a parent function f(x) and performs a transformation of it using randomly generated values for vertical stretch/compression, horizontal shift, and vertical shift. 

Two Desmos calculators appear when the user creates a problem. The first shows the parent function f(x) and a second transformed function which we will call g(x). The idea is for the user to use the right calculator to enter the correct parent and transformed functions so that they match the original graphed functions.

A timer can be started that shows the user the correct solution after a given amount of time.

*/


let graphCalc = undefined;
let graphCalc2 = undefined;

let problemCollection = [];
let qIndex = -1;
let highestIndex = -1;



let outcome = undefined;

//this method shows both graphing calculators
function start() {
    let elt = document.getElementById('calculator')

    graphCalc = Desmos.GraphingCalculator(elt,
        {
            expressionsCollapsed: true
        });

    graphCalc.updateSettings(
        {
            showGrid: true,
            projectorMode: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y',
            expressions: true

        });


    let elt2 = document.getElementById('calculator2')

    graphCalc2 = Desmos.GraphingCalculator(elt2,
        {
            expressionsCollapsed: true
        });

    graphCalc2.updateSettings(
        {
            showGrid: true,
            projectorMode: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y'

        });

    document.getElementById('btn-start').hidden = true;

    //createProblem();


}

function createProblem() {

    highestIndex++;
    qIndex = highestIndex;
    letFuncString = createParentFunction();
    let parameters = setParameters();
    let horizontalShift = parameters[0];
    let verticalShift = parameters[1];
    let verticalStretch = parameters[2];
    let transformedFunction =
        setTransformedFunction(horizontalShift, verticalShift, verticalStretch);
    console.log(transformedFunction);

    problem =
    {
        funcString,
        highestIndex,
        verticalStretch,
        verticalShift,
        horizontalShift,
        transformedFunction
    }

    console.log(problem);

    problemCollection.push(problem);

}

function getProblem(index) {

    let problem = problemCollection[index];



    console.log(funcString);

    graphCalc.setExpression({ id: 'parentFunction', latex: problem.funcString, color: Desmos.Colors.BLACK });
    graphCalc.setExpression({ id: 'defaultPoint', latex: '(1,1)', label: 'f(x)', showLabel: true, color: Desmos.Colors.RED })

    graphCalc.setExpression({ id: 'transformedFunction', latex: problem.transformedFunction })

    setTitle();


}

function createParentFunction() {
    outcome = Math.floor(1 + Math.random() * 5);
    console.log(`The value of the outcome is ${outcome}`);

    switch (true) {
        case (outcome === 1):
            {
                funcString = 'f(x) = x';
                break;
            }
        case (outcome === 2):
            {
                funcString = 'f(x) = x^2';
                break;
            }
        case (outcome === 3):
            {
                funcString = 'f(x) = x^3';
                break;
            }
        case (outcome === 4):
            {
                funcString = 'f(x) = \\sqrt{x}';
                break;
            }
        case (outcome === 5):
            {
                funcString = 'f(x) = \\abs(x)';
                break;
            }


    }

    return funcString;



}



function between(a, b) {
    let range = b - a + 1;
    return a + Math.floor(Math.random() * range);
}

//function g(x) 
//Case1 g(x)=af(x-b) +c
//Case 2 g(x) = 1/af(x-b) +c
function setParameters() {
    //generate random number between 0 and 1. If 0 < x <.7 then =>a
    //else use 1/a

    let rnd1 = Math.random();

    if (rnd1 >= 0 && rnd1 < 0.7) {
        verticalSquish = false;

        let temp = 0;

        while (temp === 0) {
            temp = between(-3, 3);
        }

        verticalStretch = temp;
        jsVerticalStretch = temp;

    }
    else {

        verticalSquish = true;

        let temp = 0;

        while (temp === 0) {
            temp = between(-3, 3)
        }

        verticalStretch = temp;
        jsVerticalStretch = temp;

    }

    horizontalShift = between(-4, 4);
    verticalShift = between(-4, 4);

    if (verticalSquish === true) {
        if (verticalStretch < 0) {

            verticalStretch = - verticalStretch;
            verticalStretch = '-\\frac{' + '1' + '}{' + verticalStretch + '}';
        }
        else {
            verticalStretch = '\\frac{' + '1' + '}{' + verticalStretch + '}';
        }

    }

    let parameters = [horizontalShift, verticalShift, verticalStretch]



    console.log(`The vertical stretch is ${verticalStretch}`);
    console.log(`The horizontal shift is ${horizontalShift}`);
    console.log(`The vertical shift is ${verticalShift}`);

    return parameters;


}

function setTransformedFunction(horizontalShift, verticalShift, verticalStretch) {
    let transformedFunc = undefined;
    let verticalIntercept = undefined;


    transformedFunc = 'g(x) = ' + verticalStretch + 'f(x - ' + horizontalShift + ') + ' + verticalShift;

    transformedFunc = transformedFunc
        .replace('1(x', '(x')
        .replace('x - 0', 'x')
        .replace('- -', '+')
        .replace('+ -', '-')
        .replace('- +', '-')





    console.log(transformedFunc)
    return transformedFunc;



}

function next() {



    graphCalc.updateSettings(
        {
            showGrid: true,
            projectorMode: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y',
            expressions: false

        });



    if (highestIndex === problemCollection.length - 1) {
        createProblem();
        getProblem(highestIndex);
    }

}

function prev() {
    if (qIndex > 0) {
        qIndex--;
        getProblem(qIndex);
    }
}

function first() {
    if (problemCollection.length) {
        qIndex = 0;
        getProblem(0);
    }
}

function last() {
    if (problemCollection.length) {
        qIndex = problemCollection.length - 1;
        getProblem(qIndex);
    }
}

function clearLines() {
    qIndex = -1;
    problemCollection = [];
    setTitle();


    graphCalc.removeExpressions(
        [
            { id: 'parentFunction' },
            { id: 'defaultPoint' },
            { id: 'transformedFunction' }
        ]);


}




function setTitle() {
    let title = 'Function Transformations of the form g(x) = af(x-b) + c: ';
    let desmosTitle = document.getElementById('desmosTitle');

    if (problemCollection.length) {
        title += 'Problem ' + (qIndex + 1) + ' of ' + problemCollection.length;
    }
    else {
        title += 'Click \'Next\' to create a new function transformation problem';
    }

    desmosTitle.innerText = title;
}



function showAnswer() {

    graphCalc.updateSettings(
        {
            showGrid: true,
            projectorMode: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y',
            expressions: true

        });

    clearTimeout(showAnswer);


};







function clearLines() {
    qIndex = -1;
    problemCollection = [];
    setTitle();


    graphCalc.removeExpressions(
        [
            { id: 'parentFunction' },
            { id: 'defaultPoint' },
            { id: 'transformedFunction' }
        ]);


}







