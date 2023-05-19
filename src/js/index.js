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
                _this.fn_create_ball();

                document.getElementById('firstWinamnt').innerHTML =_this.weekLottoData.firstWinamnt.toLocaleString();
                document.getElementById('firstPrzwnerCo').innerHTML = _this.weekLottoData.firstPrzwnerCo;

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
    },
    fn_create_ball : function() {

        let _this = this;

        let drwtArr = [
            _this.weekLottoData.drwtNo1,
            _this.weekLottoData.drwtNo2,
            _this.weekLottoData.drwtNo3,
            _this.weekLottoData.drwtNo4,
            _this.weekLottoData.drwtNo5,
            _this.weekLottoData.drwtNo6,
            _this.weekLottoData.bnusNo,
        ];

        document.getElementById('winDate').innerHTML = '(' + _this.weekLottoData.drwNoDate + ')';

        for(let i = 1; i <= drwtArr.length; i++) {
            document.getElementById('ball-' + i).className = "";
            document.getElementById('ball-' + i).innerHTML = drwtArr[i-1];
            console.log(_this.fn_digitNumber(drwtArr[i-1]));
            document.getElementById('ball-' + i).classList.add("ball-" + _this.fn_digitNumber(drwtArr[i-1]));
        }
    },
    fn_go_page : function(page) {

        const _this = this;

        const elements = document.getElementsByClassName("section");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("dp_b");
            elements[i].classList.add("dp_n");
        }

        switch (page) {
            case 'M' : _this.fn_display_show('mainSection'); break;
            case 'A' : _this.fn_display_show('autoSection'); break;
            case 'S' : _this.fn_display_show('semiSection'); break;
            case 'F' : _this.fn_display_show('fortuneSection'); break;
            case 'E' : _this.fn_display_show('emergeSection'); break;
        }
    },
    fn_display_show(id) {
        document.getElementById(id).classList.add("dp_b");
    }
}

document.addEventListener("DOMContentLoaded", function(){
    LOTTO.init();
});
