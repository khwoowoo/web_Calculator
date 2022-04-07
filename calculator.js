class Stack{
    constructor(){
        this.items = [];
        this.curIdx = -1;
        this.size = 0;
    }

    push(data){
        this.items.push(data);
        this.curIdx++;
        this.size++;
    }

    pop(){
        if(this.size === 0){
            console.log("stack size is 0");
            return -1;
        }

        const data = this.items.pop();
        this.curIdx--;
        this.size--;
        return data;
    }

    peek(){
        if(this.size === 0){
            console.log("stack size is 0");
            return -1;
        }

        return this.items[this.curIdx];
    }

    isEmpty(){
        return (this.size === 0);
    }

    getSize(){
        return this.size;
    }
}

class Calculator{
    constructor(infix){
        this.infix = infix;
    }

    Compare(oper1, oper2){
        //0: ( )
        //1: + -
        //2: / *
        //앞에 있는 연산자을 기준으로 비교
        //같으면 -1, 높으면 1, 낮으면 0, 이상한 문자가 들어왔으면 -9999

        let num1 = 0;
        let num2 = 0;

        if(oper1 == "(" || oper1 == ")"){
            num1 = 0;
        } else if(oper1 == "+" || oper1 == "-"){
            num1 = 1;
        } else if(oper1 == "/" || oper1 == "*"){
            num1 = 2;
        } else{
            return -9999;
        }

        if(oper2 == "(" || oper2 == ")"){
            num2 = 0;
        } else if(oper2 == "+" || oper2 == "-"){
            num2 = 1;
        } else if(oper2 == "/" || oper2 == "*"){
            num2 = 2;
        } else{
            return -9999;
        }


        if(num1 === num2){
            return -1;
        }
        else if(num1 > num2){
            return 1;
        }
        else{
            return 0;
        }
    }

    isOperand(data){
        return (data !== "(" && data !== ")" && data !== "+" && data !== "-" && data !== "/" && data !== "*");
    }

    GetPostfix(){
        let stack = new Stack();
        let data = this.infix.split(' ');
        let postfix = "";
 
        // debugger;
        for(let i of data){
            //1. 숫자인지 연산자인지 확인한다
            //2. 숫자라면 바로 넣어주고
            //3. 연산자라면 우선순위를 고려하여 신행한다.
            if(this.isOperand(i)){
                postfix += i + " ";
            }
            else{
                if(stack.isEmpty() || this.Compare(i, stack.peek()) === 1){
                    stack.push(i);
                } else{
                    while(!stack.isEmpty()){
                        if(stack.peek() === "(" || stack.peek() === ")"){
                            stack.pop();
                            continue;
                        }
                        postfix += stack.pop() + " ";
                    }
                    
                    if(i !== ")"){
                        stack.push(i);
                    }
                }
            }
        }

        while(!stack.isEmpty()){
            postfix += stack.pop() + " ";
        }
        return postfix;
    }

    GetResult(){
        let temp = this.GetPostfix().split(' ');
        let stack = new Stack();
        
        temp.pop();
        for(let i of temp){
            if(this.isOperand(i)){
                stack.push(parseFloat(i));
            }else{
                let num1 = stack.pop();
                let num2 = stack.pop();
                switch(i){
                    case '+':
                        num2 += num1;
                        break;
                    case '-':
                        num2 -= num1;
                        break;
                    case '*':
                        num2 *= num1;
                        break;
                    case '/':
                        num2 /= num1;
                        break;
                }

                stack.push(num2);
            }
        }

        return stack.pop();
    }
    
}

class Apps{
    constructor(operandDomArr, operatorDomArr, specialDomArr, infixDom){
        //피연산자
        this.infixDom = infixDom;
        //피연산자 버튼 배열
        this.operandDomArr =  Array.from(operandDomArr);
        //연산자 버튼 배열
        this.operatorDomArr =  Array.from(operatorDomArr);
        //특수문자 버튼 배열
        this.specialDomArr =  Array.from(specialDomArr);
        //계산기를 시작 했는지
        this.isStart = false;
        this.infix = "";

        //이벤트 설정
        this.operandDomArr.forEach(i=>{
            i.addEventListener("click", (event)=>{
                this.HandleOperand(event);
                console.log(this.infix);
            });
        });
        this.operatorDomArr.forEach(i=>{
            i.addEventListener("click", (event)=>{
                this.HandleOperator(event);
                console.log(this.infix);
            });
        });
        this.specialDomArr.forEach(i=>{
            i.addEventListener("click", (event)=>{
                this.HandleSpecial(event);
                console.log(this.infix);
            });
        });
    }

    //피연산자 이벤트
    HandleOperand(event){
        if(this.isStart === false){
            // this.infixDom.innerText = "";
            this.infixDom.text('');
            this.isStart = true;
        }
        // this.infixDom.innerText += event.target.innerText;
        // this.infix += event.target.innerText;

        this.infixDom.append(event.target.innerText);
        this.infix += event.target.innerText;
    }

    //연산자 이벤트
    HandleOperator(event){
        if(this.isStart !== true){
            return;
        }

        // this.infixDom.innerText += event.target.innerText;
        this.infixDom.append(event.target.innerText);
        if(event.target.innerText === "X"){
            this.infix += "*";
        }else{
            // this.infix += event.target.innerText;
            this.infix += event.target.innerText;
        }
    }

    isOperand(data){
        return (data !== "(" && data !== ")" && data !== "+" && data !== "-" && data !== "/" && data !== "*");
    }

    //backspace key 
    KeyBackspace(){
        if(this.infix.length === 0){
            alert("지울 값이 없습니다.");
            this.KeyAC();
            return -1;
        }
        else if(this.infix.length === 1){
            this.KeyAC();
            return -1;
        }

        let temp = "";

        for(let i = 0; i < this.infix.length - 1; i++){
            temp += this.infix[i];
        }

        this.infix = temp;
        // this.infixDom.innerText = temp;
        this.infixDom.text(`${temp}`);
    }

    //괄호 키
    KeyParenthesis(event){
        if(this.isStart === false){
            // this.infixDom.innerText = "";
            this.infixDom.text('');
            this.isStart = true;
        }
        // this.infixDom.innerText += event.target.innerText;
        // this.infix += event.target.innerText;

        this.infixDom.append(event.target.innerText);
        this.infix += event.target.innerText;
    }

    //ac key
    KeyAC(){
        // this.infixDom.innerText = "0";
        this.infixDom.text('0');
        this.infix = "";
        this.isStart = false;
    }

    //중위식을 123 처럼 10보다 큰 수를 처리할 수 있는게
    //변환해주기
    Transformation(){
        if(this.infix.length === 0){
            return false;
        }

        let temp = "";

        for(let i of this.infix){

            if(this.isOperand(i)){
                temp += i;
            }
            else{
                if(i === "("){
                    temp += i + " ";
                }
                else if(i === ")"){
                    temp += " " + i;
                }
                else{
                    temp += " " + i + " ";
                }
            }
        }

        
        console.log(temp)
        const calculator = new Calculator(temp);
        
        this.infix = calculator.GetResult().toString();
        // this.infixDom.innerText = this.infix;
        this.infixDom.text(`${this.infix}`);

        if(isNaN(this.infix)){
            alert("잘 못 된 수식입니다.");
            this.KeyAC();
        }

        return true;
    }

    //특수 문자 키
    HandleSpecial(event){
        switch(event.target.innerText){
            case "AC":
                this.KeyAC();
                break;
            case "+/-":
                alert("아직 구현 중 입니다.")
                break;    
            case "%":
                alert("아직 구현 중 입니다.")
                break;
            case "←":
                this.KeyBackspace();
                break;
            case "(": case ")":
                this.KeyParenthesis(event);
                break;      
            case ".":
                // alert("아직 구현 중 입니다.")
                // this.infixDom.innerText += event.target.innerText;
                // this.infix += event.target.innerText;
                this.infixDom.append(event.target.innerText);
                this.infix += event.target.innerText;
                break; 
            case "=":
                this.Transformation();
                break; 
        }
    }
}


function main(){
    // const infixDom = document.getElementById("jsInfix");
    // const operandDomArr = document.getElementsByClassName("operand");
    // const operatorDomArr = document.getElementsByClassName("operator");
    // const specialDomArr = document.getElementsByClassName("special");

    const infixDom = $("#jsInfix");
    const operandDomArr = $(".operand");
    const operatorDomArr = $(".operator");
    const specialDomArr = $(".special");
    const apps = new Apps(operandDomArr, operatorDomArr, specialDomArr, infixDom);
}

main();