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
            document.getElementById('ball-' + i).classList.add("ball-" + _this.fn_digitNumber(drwtArr[i-1]));
        }
    },
    fn_modal_page : function(page) {

        const _this = this;

        switch (page) {
            case 'M' : _this.fn_display_show('mainSection'); break;
            case 'A' :
                _this.fn_display_show('autoSection-modal');
                _this.auto_number_create();
                break;
            case 'S' : _this.fn_display_show('semiSection'); break;
            case 'V' : _this.fn_display_show('saveSection'); break;
            case 'F' : _this.fn_display_show('fortuneSection'); break;
            case 'E' : _this.fn_display_show('emergeSection'); break;
            case 'R' : _this.fn_display_show('storeSection'); break;
        }
    },
    fn_display_show(id) {

        document.getElementById(id).classList.add("dp-b");
    },
    fn_modal_close(id) {

        document.getElementById(id).classList.remove("dp-b");
        document.getElementById(id).classList.add("dp-n");
    },
    fn_lotto_refresh() {

        document.getElementById('lottoRefresh').classList.add("fa-spin");
        this.auto_number_create();

        setTimeout(function(index) {
            document.getElementById('lottoRefresh').classList.remove("fa-spin");
        }, 1000);
    },
    auto_number_create() {

        const _this = this;
        let numbers = [];

        // 1부터 45까지의 숫자 배열 생성
        for (let i = 1; i <= 45; i++) {
            numbers.push(i);
        }

        let lottoNumbers = [];

        for (let i = 0; i < 6; i++) {

            let randomIndex = Math.floor(Math.random() * numbers.length);
            lottoNumbers.push(numbers[randomIndex]);
            numbers.splice(randomIndex, 1);
        }

        lottoNumbers.sort(function(a, b) {
            return a - b;
        });

        _this.fn_auto_create_ball(lottoNumbers);
    },
    fn_auto_create_ball : function(lottoNumbers) {

        let _this = this;

        _this.fn_auto_ball_init();

        for(let i = 1; i <= lottoNumbers.length; i++) {
            setTimeout(function(index) {
                document.getElementById('auto-ball-' + i).className = "";
                document.getElementById('auto-ball-' + i).innerHTML = lottoNumbers[i-1];
                document.getElementById('auto-ball-' + i).classList.add("ball-" + _this.fn_digitNumber(lottoNumbers[i-1]));
            }, 500 * i, i);
        }
    },
    fn_auto_ball_init() {
        for(let i = 1; i < 7; i++) {
            document.getElementById('auto-ball-' + i).className = "";
            document.getElementById('auto-ball-' + i).innerHTML = '?';
            document.getElementById('auto-ball-' + i).classList.add("ball-s");
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    LOTTO.init();
});
