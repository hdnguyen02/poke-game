

// * tổng cộng có 3 màn hình. 
// * tạo ra 3 component : trước tiên render ra component start game. 
// * bắt sự kiện chọn mần game -> đến màn -> bắt sự kiện người dùng sau khi người dùng chơi song -> hiển thị ra component kết quả. 


// * cho người dụng được quyền chọn số card sau đó render ra. ngoài ra còn hiển thị số thời gian thực tế người dùng chơi, Được thì còn tạo ra 1 bản xếp hạng. -> viết code phân định rõ ràng 


// * tạo ra phần data. 

// * viết ra 1 function 

// * render ra component.  


// * kết luận từ project : Việt bạn thực hiện remove đi 1 element không phải là xóa element ra khỏi biến đó mà xóa biến đó ra khỏi mô hình DOM 
// * sự kiện sau khi đã đính vào được lưu trữ tại object.


const startGameTemplate = document.getElementById("start-game-template");
const playGameTemplate = document.getElementById("play-game-screen");
const cardTemplate = document.getElementById("card-screen");
const startGameScreen = startGameTemplate.content.cloneNode(true);
const formSelectGame = startGameScreen.querySelector("[data-start-form]");
const playGameScreen = playGameTemplate.content.cloneNode(true);
const containerCard = playGameScreen.querySelector("[data-container-card]");

alert('Hello Lan'); 


let rules = []; // * chứa 2 thẻ.  


let infoGame = {
    numberCard: null,
    timeStart: null,
    cardSucsess: null,  //  
    startGame() {
        this.timeStart = Date.now();
        this.cardSucsess = 0;  // gán về 0 -> mới chơi chưa mở card nào. 
    },
    endGame() {
        if (this.cardSucsess === this.numberCard) {
            return true;
        }
        return false;
    },

    successCard() {
        this.cardSucsess = this.cardSucsess + 2;
    },
    computedTimeGame(endGame) {
        return (endGame - this.startGame)/1000
    }
}

function computedDisplayCard(numberSelect) {
    let percentWidthContainerCard = +containerCard.style.width.slice(0, -1);
    let widthContainerCard = (percentWidthContainerCard * window.innerWidth) / 100 - 30;
    let widhCard = widthContainerCard / numberSelect;
    let heightCard = 4 / 3 * widhCard;
    return {
        widhCard, heightCard
    }
}

function randomIndexArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i)
        let k = array[i]
        array[i] = array[j]
        array[j] = k
    }
}

function computedImg(numberCard) {
    let halfNumberCard = numberCard / 2;
    let halfArrayImg = Array.from({ length: halfNumberCard }, (_, index) => index + 1);
    let arrayImg = [...halfArrayImg, ...halfArrayImg];
    randomIndexArray(arrayImg);
    return arrayImg;
}

function renderCard(numberCard) {
    let numberSelect = Math.sqrt(numberCard);
    let displayCard = computedDisplayCard(numberSelect);
    let arrayImg = computedImg(numberCard);
    const fragment = new DocumentFragment();
    for (let i = 0; i < numberCard; i++) {
        let fragmentCard = cardTemplate.content.cloneNode(true); // clone ra thẻ card. 
        const card = fragmentCard.querySelector("[data-card-value]");
        card.dataset.cardValue = `${arrayImg[i]}-${i}`;
        const cardFaceFront = fragmentCard.querySelector('[data-card-face="back"]');
        cardFaceFront.style.backgroundImage = `url(./assets/images/${arrayImg[i]}.png)`
        const innerElement = fragmentCard.querySelector("[data-card-inner]");
        innerElement.style.width = `${displayCard.widhCard}px`;
        innerElement.style.height = `${displayCard.heightCard}px`;
        fragment.append(fragmentCard);
    }
    containerCard.append(fragment);
}


formSelectGame.onsubmit = function (event) {
    event.preventDefault();
    const inputSelectForm = this.elements.cardNumber;
    const numberSelect = inputSelectForm.value;
    const numberCard = numberSelect ** 2;
    // * đã có số number card -> đồng thời tính thời gian từ lúc này 
    infoGame.numberCard = numberCard;
    infoGame.startGame();

    renderCard(numberCard);
    document.body.replaceChildren(playGameScreen, startGameScreen);
}

containerCard.onclick = function (event) {
    const target = event.target;
    if (!target.hasAttribute("data-card-face")) return;
    const innerCard = target.parentElement;
    if (innerCard.hasAttribute("data-unable-flipped")) return;  // hông cho lật lại
    innerCard.classList.toggle('is__fliped');
    const card = innerCard.parentElement;
    const cardValue = card.dataset.cardValue;
    if (!innerCard.classList.contains('is__fliped')) return;
    rules.push(cardValue);
    if (rules.length === 2) {
        let card1 = document.querySelector(`[data-card-value="${rules[0]}"]`).firstElementChild;
        let card2 = innerCard;
        if (rules[0][0] === rules[1][0]) {
            card1.setAttribute('data-unable-flipped', '');
            card2.setAttribute('data-unable-flipped', '');

            // * chờ sau khi card lật song 
            setTimeout(() => {
                infoGame.successCard();
                if (infoGame.endGame()) {
                    
                    alert(`Hoàn thành game, thời gian:  ${infoGame.computedTimeGame(Date.now())}`);
                }
            },1000); 




        }
        else {
            setTimeout(
                () => {
                    card1.classList.remove('is__fliped');
                    card2.classList.remove('is__fliped');
                }
                , 1000)
        }
        rules = [];
    }
}


initGame();



function initGame() {
    document.body.prepend(startGameScreen);  // * Màn hình chọn game.  
}




// * kiểm tra xem đã hoàn thành game hay chưa. 
