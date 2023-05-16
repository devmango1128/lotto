let LOTTO = {
    latestRound : 1,
    init : function() {
        this.fn_lotto_last_turn_number();
    },
    fn_lotto_last_turn_number : function() {

        const currentDate = new Date();
        const currentDay = currentDate.getDay();

        const saturday = 6; // 토요일은 6번째 요일

        // 현재 요일이 토요일이 아닌 경우, 가장 최근의 토요일로 이동
        if (currentDay !== saturday) {
            const diff = currentDay > saturday ? currentDay - saturday : (7 - saturday) + currentDay;
            currentDate.setDate(currentDate.getDate() - diff);
        }

        const baseDate = new Date('2002-12-07'); // 한국 로또 시작 : 2002년 12월 7일 토요일
        const diffDays = Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24));
        const latestRound = Math.floor(diffDays / 7) + 1;

        this.latestRound = latestRound;
        this.fn_lotto_turn();
    },
    fn_lotto_turn : function() {
        let _this = this;
        const lottoTurn = document.getElementById("lottoTurn");

        for (let i = _this.latestRound; i > 1; i--) {

            let newOption = document.createElement("option");
            newOption.value = i;
            newOption.text = i + '회';

            lottoTurn.appendChild(newOption);
        }
    },
    fn_lotto_turn_change : function() {
        let _this = this;

        const selectElement = document.getElementById("lottoTurn");
        const selectedValue = selectElement.value;

        console.log(selectedValue); // 선택된 옵션의 값 출력

        // var url = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=' + selectedValue;
        //
        // $.ajax({
        //     url: url,
        //     method: 'GET',
        //     dataType: 'jsonp',
        //     jsonpCallback: 'processLottoData',
        //     success: function(response) {
        //         console.log(response);
        //         // 응답 데이터를 처리하는 코드 작성
        //     },
        //     error: function(xhr, status, error) {
        //         console.error(error);
        //     }
        // });

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=' + selectedValue, true); // AJAX 요청 설정

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = xhr.responseText;
                // AJAX 요청이 완료되고 응답이 성공적으로 도착한 경우에 실행할 코드
                console.log(response);
            }
        };

        xhr.send(); // AJAX 요청 보내기
    }
}

function processLottoData(data) {
    // 로또 데이터를 처리하는 코드 작성
    console.log(data);
}

document.addEventListener("DOMContentLoaded", function(){
    LOTTO.init();
});
