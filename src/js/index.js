let LOTTO = {
    lottoData : null,
    weekLottoData : null,
    init : function() {
        this.fn_lotto_turn_change();
    },
    fn_lotto_turn : function(lotto_len) {
        let _this = this;
        const lottoTurn = document.getElementById('lottoTurn');

        for (let i = lotto_len; i > 0; i--) {

            let newOption = document.createElement('option');
            newOption.value = i;
            newOption.text = i + '회';

            lottoTurn.appendChild(newOption);
        }
    },
    fn_lotto_turn_change : function() {
        let _this = this;

        const url = '/lotto/turnHistory.json?date=' + new Date();
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = JSON.parse(xhr.responseText);

                _this.lottoData = response;
                _this.fn_lotto_turn(_this.lottoData.length);

                const selectElement = document.getElementById('lottoTurn');
                const selectedValue = selectElement.value ? selectElement.value : selectElement.options[0].value;

                _this.weekLottoData = _this.lottoData[selectedValue-1];

                let drwtNo1 = _this.weekLottoData.drwtNo1;
                let drwtNo2 = _this.weekLottoData.drwtNo2;
                let drwtNo3 = _this.weekLottoData.drwtNo3;
                let drwtNo4 = _this.weekLottoData.drwtNo4;
                let drwtNo5 = _this.weekLottoData.drwtNo5;
                let drwtNo6 = _this.weekLottoData.drwtNo6;
                let drwtNoB = _this.weekLottoData.bnusNo;

                 document.getElementById('winDate').innerHTML = '(' + _this.weekLottoData.drwNoDate + ')';
                 document.getElementById('ball-1').innerHTML = drwtNo1;
                 document.getElementById('ball-1').className = "";
                 document.getElementById('ball-1').classList.add("ball-" + _this.fn_digitNumber(drwtNo1));
                 document.getElementById('ball-2').innerHTML = drwtNo2;
                 document.getElementById('ball-2').className = "";
                 document.getElementById('ball-2').classList.add("ball-" + _this.fn_digitNumber(drwtNo2));
                 document.getElementById('ball-3').innerHTML = drwtNo3;
                 document.getElementById('ball-3').className = "";
                 document.getElementById('ball-3').classList.add("ball-" + _this.fn_digitNumber(drwtNo3));
                 document.getElementById('ball-4').innerHTML = drwtNo4;
                 document.getElementById('ball-4').className = "";
                 document.getElementById('ball-4').classList.add("ball-" + _this.fn_digitNumber(drwtNo4));
                 document.getElementById('ball-5').innerHTML = drwtNo5;
                 document.getElementById('ball-5').className = "";
                 document.getElementById('ball-5').classList.add("ball-" + _this.fn_digitNumber(drwtNo5));
                 document.getElementById('ball-6').innerHTML = drwtNo6;
                 document.getElementById('ball-6').className = "";
                 document.getElementById('ball-6').classList.add("ball-" + _this.fn_digitNumber(drwtNo6));
                 document.getElementById('ball-b').innerHTML = drwtNoB;
                 document.getElementById('ball-b').className = "";
                 document.getElementById('ball-b').classList.add("ball-" + _this.fn_digitNumber(drwtNoB));
                /*bnusNo: 18
                drwNo: 1067
                drwNoDate: "2023-05-13"
                drwtNo1: 7
                drwtNo2: 10
                drwtNo3: 19
                drwtNo4: 23
                drwtNo5: 28
                drwtNo6: 33
                firstAccumamnt: 25754482130
                firstPrzwnerCo: 13
                firstWinamnt: 1981114010
                returnValue: "success"
                totSellamnt: 110703299000
                                * */
            } else {
                console.error('Error:', xhr.status);
            }
        };

        xhr.onerror = function() {
            console.error('Request failed');
        };

        xhr.send();
    },
    fn_digitNumber : function(number) {

        if (number < 10) {
            return 0;
        } else if (number >= 10 && number < 100) {
            const tensDigit = Math.floor(number / 10) * 1;
            return tensDigit;
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    LOTTO.init();
});
