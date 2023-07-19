function validateEmail() {
    let email = document.getElementById('email').value;
    if (!String(email).match('^[a-zA-Z0-9_.]*@(yahoo|gmail).com$')){
        window.alert('Invalid email');
    }
}

function isValidEmail() {
    let email = document.getElementById('email').value;
    if (!String(email).match('^[a-zA-Z0-9_.]*@(yahoo|gmail).com$')){
        return false;
    }
    return true;
}

function validateWebpage() {
    let webpage = document.getElementById('webpage').value;  
    if (!String(webpage).match('^.*\..*\.[A-z0-9\-_\/]*$')) {
        window.alert('Invalid URL');
    }
}

function isValidWebpage() {
    let webpage = document.getElementById('webpage').value;  
    if (!String(webpage).match('^.*\..*\.[A-z0-9\-_\/]*$')) {
        return false;
    }
    return true;
}

function showSubmit() {
    let email = document.getElementById('name');
    if(isValidEmail() && isValidWebpage() && email.validity.valid) {
        document.getElementById('submit').style.display='block';
    }
    else
    {
        document.getElementById('submit').style.display='none';
    }
}

function hideSubmit()
{
    document.getElementById('submit').style.display='none';
}

function setFooter() {
    document.getElementsByTagName('footer')[0].innerText = String(document.lastModified);
}

let form = document.getElementById('form');
form.addEventListener('input', setFooter );

function generateRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genPlus() {
    return [generateRand(1, 50), generateRand(1, 50)];
}

function genMinus() {
    return [generateRand(1, 50) + 50, generateRand(1, 50)];
}

function genMul() {
    return [generateRand(1, 10), generateRand(1, 10)];
}

function genDiv() {
    return [generateRand(1, 50) + 50, generateRand(1, 10)];
}

function shuffle()
{
    for(let i = 0; i<10; i++){
        let p1 = generateRand(0, qa.length-1);
        let p2 = generateRand(0, qa.length-1);
        let temp = qa[p1];
        qa[p1] = qa[p2];
        qa[p2] = temp;
    }
}

let qa = [], matches = [];
let generated = 0;

function createQuestions() {
    if(!generated)
    {

        document.getElementById('questions').style.visibility = 'visible';
        document.getElementById('qa').style.visibility = 'visible';
        document.getElementById('answers').style.visibility = 'visible';
        document.getElementById('playbox').style.visibility = 'visible';
        let nr = parseInt(document.getElementById('nr').value);
        let canvas = document.getElementById('canvas');
        canvas.height = nr * 90;
        canvas.style.visibility = 'visible';
        canvas.style.backgroundColor = '#F0FFFF';
        let operation = document.getElementById('operation').value;
        for (let i = 0; i<nr; i++){
            let newquestion = document.createElement('div');
            newquestion.id = `q${i}`;
            newquestion.style.marginTop = '50px';
            newquestion.className = 'q';
            newquestion.style.border = 'thin solid black';
            newquestion.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            newquestion.style.textAlign = 'center';
            let numbers, num;
            switch(operation){
            case '+':
                numbers = genPlus();
                num = `${numbers[0]}+${numbers[1]}`;
                x = numbers[0] + numbers[1];
                break;
            case '-':
                numbers = genMinus();
                num = `${numbers[0]}-${numbers[1]}`;
                x = numbers[0] - numbers[1];
                break;
            case '*':
                numbers = genMul();
                num = `${numbers[0]}*${numbers[1]}`;
                x = numbers[0] * numbers[1];
                break;
            case '/':
                numbers = genDiv();
                num = `${numbers[0]}\/${numbers[1]}`;
                x = numbers[0] / numbers[1];
                break;
            }
            newquestion.innerText = num;
            document.getElementById('questions').appendChild(newquestion);
            newquestion.onclick = function() { questionClicked(newquestion); }
            
            qa[qa.length] = [x, i];
            matches[num] = x.toString();
        }
        shuffle();
        for (let i = 0; i<nr; i++){
            let newanswer = document.createElement('div');
            newanswer.id = `a${i}`;
            newanswer.className = 'a';
            newanswer.style.marginTop = '50px';
            newanswer.style.border = 'thin solid black';
            newanswer.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;    
            newanswer.style.textAlign = 'center';
            newanswer.innerText = qa[i][0];
            document.getElementById('answers').appendChild(newanswer);
            newanswer.onclick = function() { answerClicked(newanswer); }
        }
        let evaluateButton = document.createElement('button');
        evaluateButton.innerText = 'Evaluate';
        evaluateButton.id = 'evaluateButton'
        evaluateButton.onclick = function() { evaluateBoxes(); }
        let pb = document.getElementById('playbox');
        pb.parentNode.insertBefore(evaluateButton, pb.nextSibling);
        evaluateButton.style.visibility = 'hidden';
        generated = 1;
    } 
}

let questionIsClicked = 0, playbox, qx, qy, ax, ay, cq, clickedQuestionsArray = [], clickedAnswersArray = [], nrMatched = 0;

function questionClicked(box){
    if(!questionIsClicked && !clickedQuestionsArray.includes(box))
    {
        cq = box;
        box.style.border = 'thick solid red';
        questionIsClicked = 1;
        let offsets = box.getBoundingClientRect();
        qy = offsets.top;
        qx = offsets.right;
        clickedQuestionsArray[clickedQuestionsArray.length] = box;
    }
}

function answerClicked(box)
{
    if(questionIsClicked && !clickedAnswersArray.includes(box))
    {
        playbox = document.getElementById('playbox').getBoundingClientRect();
        py = playbox.top;
        px = playbox.left;
        let offsets = box.getBoundingClientRect();
        ay = offsets.top;
        ax = offsets.left;
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(qx-px, qy-py);
        ctx.lineTo(ax-px, ay-py);
        ctx.strokeStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        ctx.stroke();
        cq.style.border = 'thin solid black';
        questionIsClicked = 0;
        clickedAnswersArray[clickedAnswersArray.length] = box;
        nrMatched++;
    }
    let nr = parseInt(document.getElementById('nr').value);
    if(nrMatched == nr)
    {
        document.getElementById('evaluateButton').style.visibility = 'visible';
    }
}

function evaluateBoxes() {
    let nr = parseInt(document.getElementById('nr').value);
    if(nr === nrMatched)
    {
        for(let i=0; i<nr; i++){
            let offsets = clickedAnswersArray[i].getBoundingClientRect();
            ay = offsets.top;
            ax = offsets.left;
            offsets = clickedQuestionsArray[i].getBoundingClientRect();
            qy = offsets.top;
            qx = offsets.right;
            let canvas = document.getElementById('canvas');
            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(qx-px, qy-py);
            ctx.lineTo(ax-px, ay-py);
            ctx.lineWidth = 3;
            if(matches[clickedQuestionsArray[i].innerText] != clickedAnswersArray[i].innerText)
            {
                ctx.strokeStyle = '#DC143C';
            }
            else
            {
                ctx.strokeStyle = '#006400';
            }
            ctx.stroke();
        }
    }   
}


