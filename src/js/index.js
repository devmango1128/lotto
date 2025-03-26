let LOTTO = {
    lottoData : null, //로또 데이터
    weekLottoData : null, //이번주 로또 데이터
    autoLottoData : [], //자동 로또 데이터
    fixedList : [], //반자동 선택 수
    isNumberCreate : false, //번호 생성 여부
    storeData : null,   //판매점데이터
    perpData : null,    //오행 데이터
    inputBirth : "",    //오행 생일
    fiveResult : null, //오행 결과
    fiveResultIdx : -1,
    //시작
    init : function() {
        this.fn_five_day_result_data();
        this.fn_lotto_turn_change();
        this.fn_create_fixed_number_ball();
    },
    //오행
    fn_five_day_result_data : function() {
        let _this = this;

        const url = '/lotto/perpCal.json?date=' + new Date();
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                _this.perpData = JSON.parse(xhr.responseText);
                console.log('perpData 로딩완료....');

            } else {
                console.error('Error:', xhr.status);
            }
        };

        xhr.onerror = function() {
            console.error('Request failed');
        };

        xhr.send();

        const url2 = '/lotto/fiveResult.json?date=' + new Date();
        const xhr2 = new XMLHttpRequest();

        xhr2.open('GET', url2, true);
        xhr2.onload = function() {
            if (xhr2.status >= 200 && xhr2.status < 400) {

                _this.fiveResult = JSON.parse(xhr2.responseText);
                console.log('fiveResult 로딩완료....');
            } else {
                console.error('Error:', xhr2.status);
            }
        };

        xhr2.onerror = function() {
            console.error('Request failed');
        };

        xhr2.send();
    }
    //로또 회차별 데이터 조회
    , fn_lotto_turn_change : function() {
        let _this = this;

        const url = '/lotto/turnHistory.json?date=' + new Date();
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                _this.lottoData = JSON.parse(xhr.responseText);
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
    //로또 회차 리스트
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
    //당첨번호 그리기
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
            document.getElementById('ball-' + i).className = '';
            document.getElementById('ball-' + i).innerHTML = drwtArr[i-1];
            document.getElementById('ball-' + i).classList.add("ball-" + _this.fn_digitNumber(drwtArr[i-1]));
        }
    },
    //공 1자리, 10자리, 20자리, 30자리, 40자리일때 색 다르게 하기 위해 시작숫자 구하기
    fn_digitNumber : function(number) {

        if (number < 1) {
            return 0;
        }
        return Math.ceil(number / 10) - 1;

    },
    //반자동(고정수)안에 볼 그리기
    fn_create_fixed_number_ball : function() {

        const _this = this;

        //우선 숨김 처리
        document.getElementById('fixedNumberList').style.display = 'none';

        let fixedBallList = document.getElementById('fixedNumberList');
        let fixedListDiv = document.createElement('div');

        for (let i = 1; i <= 45; i++) {
            let ballDiv = document.createElement('div');
            ballDiv.className = 'ball-' + _this.fn_digitNumber(i);
            ballDiv.textContent = i;
            ballDiv.onclick = _this.fn_fixed_choice;
            fixedBallList.appendChild(ballDiv);
        }
    },
    //고정수 반자동 숫자 선택
    fn_fixed_choice : function(event) {

        const _this = LOTTO;
        const choiceNumber = event.target.textContent;

        //5개일 이상 선택했을 때(같은 번호 해제인 경우는 제외)
        if(_this.fixedList.length > 4 && !_this.fixedList.includes(choiceNumber)) {
            alert('5개를 초과하여 선택 할 수 없습니다.');
            return;
        }

        if(_this.fixedList.includes(choiceNumber)) {
            event.target.classList.remove('ball-click');
            const index = _this.fixedList.indexOf(choiceNumber);
            if (index !== -1) {
                _this.fixedList.splice(index, 1);
            }
        } else  {
            event.target.classList.add('ball-click');
            _this.fixedList.push(choiceNumber);
        }
    },
    //모달 페이지 열기
    fn_modal_page : function(page) {

        const _this = this;

        switch (page) {
            case 'M' : _this.fn_display_show('mainSection'); break;
            case 'A' :
                _this.fn_set_modal_title('autoTitle', '번호 추천');
                _this.fn_modal_page_init(page);
                _this.fn_auto_ball_list_init();
                _this.fn_display_show('autoSection-modal');
                break;
            case 'V' :
                _this.fn_set_modal_title('saveNumberTitle', '관심번호 즐겨찾기');
                _this.fn_modal_page_init(page);
                _this.fn_get_save_number_list();
                _this.fn_display_show('saveNumberSection-modal');
                break;
            case 'W' :
                _this.fn_set_modal_title('winRateTitle', '당첨번호 분석');
                _this.fn_modal_page_init(page);
                _this.fn_get_win_rate_list();
                _this.fn_display_show('winRateSection-modal');
                _this.fn_lotto_start_end();
                break;
            case 'S' :
                _this.fn_set_modal_title('storeTitle', '1등 판매점');
                _this.fn_modal_page_init(page);
                _this.fn_get_store_data();
                _this.fn_display_show('storeSection-modal');
                break;
            case 'F' :
                _this.fn_set_modal_title('fiveTitle', '정통사주 복권 추천일');
                _this.fn_modal_page_init(page);
                _this.fn_five_init();
                _this.fn_display_show('fiveSection-modal');
                break;
            case 'C' :
                 _this.fn_set_modal_title('calculatorTitle', '실수령액 계산기');
                 _this.fn_modal_page_init(page);
                 _this.fn_calculator_init();
                 _this.fn_display_show('calculatorSection-modal');
                 break;
            case 'Q' :
                _this.fn_qr_camera_show(); break;
            case 'E' :
                _this.fn_send_mail(); break;
        }
    },
    //모달 타이틀 설정
    fn_set_modal_title : function(titleId, title) {

        document.getElementById(titleId).innerText = title;
    },
    //모달 페이지 초기화
    fn_modal_page_init : function(page) {

        const _this = this;

        switch (page) {
            case 'M' : break;
            case 'A' :
                document.getElementById('fixedCheckbox').checked = false;
                document.getElementById('fixedNumberList').innerHTML = '';
                _this.fixedList = [];
                _this.autoLottoData = [];
                _this.fn_create_fixed_number_ball();
                _this.isNumberCreate = false;
                break;
            case 'V' : break;
            case 'W' :
                document.getElementById('winRateList').innerHTML = '';
                break;
            case 'S' :
                document.getElementById('storeList').innerHTML = '';
                break;
            case 'C' : break;
            case 'F' : break;
        }
    },
    //모달 페이지 보이기
    fn_display_show : function(id) {

        document.getElementById(id).classList.add('dp-b');
    },
    //모달 페이지 닫기
    fn_modal_close : function(id) {

        const _this = this;

        this.fn_auto_ball_list_init();
        this.fn_win_rate_init();

        document.getElementById(id).classList.remove('dp-b');
        document.getElementById(id).classList.add('dp-n');
    },
    //생성된 로또 번호 리스트 초기화
    fn_auto_ball_list_init : function() {

        document.getElementById('autoBallList').innerHTML = '';

        let autoBallList = document.getElementById('autoBallList');

        let listDiv = document.createElement('div');
        listDiv.classList.add('list');
        listDiv.classList.add('mg-b5');

        for (let j = 0; j < 6; j++) {
            let ballDiv = document.createElement('div');
            ballDiv.className = 'ball-q';
            ballDiv.textContent = '?';
            listDiv.appendChild(ballDiv);
        }

        autoBallList.appendChild(listDiv);

    },
    //반자동(고정수) 체크
    fn_fixed_number_check : function() {

        const _this = this;
        const checkbox = document.getElementById('fixedCheckbox');
        const fixedList = document.getElementById('fixedNumberList');

        if (checkbox.checked) {
            fixedList.style.display = '';
        } else {
            fixedList.style.display = 'none';
            let elements = document.querySelectorAll('.ball-click');

            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                element.classList.remove('ball-click');
            }
            _this.fixedList = [];
        }
    },
    //로또번호 생성
    fn_lotto_number_create : function() {

        const _this = this;

        const checkbox = document.getElementById('fixedCheckbox');

        //반자동 체크가 되어있으면서 숫자가 선택 안 된 경우
        if (checkbox.checked && _this.fixedList.length === 0) {
            alert('반자동 숫자를 선택해주세요.');
            return;
        }

        _this.fn_lotto_number_create_init();

        for (let i = 0; i < 5; i++) {

            let includedNumbers = [..._this.fixedList]; //고정수(반자동)수
            let selectedNumbers = []; //로또번호
            let availableNumbers = Array.apply(null, Array(45)).map(function (_, i) {
                return i + 1;
            });

            // 특정 숫자들을 포함하여 중복되지 않는 랜덤한 6개의 숫자 선택
            for (let j = 0; j < includedNumbers.length; j++) {
                let includedNum = Number(includedNumbers[j]);

                if (selectedNumbers.indexOf(includedNum) !== -1) {
                    continue; // 이미 선택된 숫자는 건너뜀
                }

                selectedNumbers.push(includedNum);
                availableNumbers.splice(availableNumbers.indexOf(includedNum), 1);
            }

            while (selectedNumbers.length < 6) {
                let randomIndex = Math.floor(Math.random() * availableNumbers.length);
                let randomNum = availableNumbers[randomIndex];

                selectedNumbers.push(randomNum);
                availableNumbers.splice(randomIndex, 1);
            }

            // 선택된 숫자 정렬
            selectedNumbers.sort(function(a, b) {
                return a - b;
            });

            _this.autoLottoData.push(selectedNumbers);
        }

        _this.fn_create_lotto_ball_list();
    },
    //로또 자동 html 초기화
    fn_lotto_number_create_init : function() {
        this.autoLottoData = [];
        document.getElementById('autoBallList').innerHTML = '';
    },
    //자동 생성된 로또번호 리스트 그리기
    fn_create_lotto_ball_list : function() {

        const _this = this;

        let lottoData = this.autoLottoData;
        let autoBallList = document.getElementById('autoBallList');

        for(let i = 0; i < lottoData.length; i++) {

            let listDiv = document.createElement('div');
            listDiv.classList.add('list');
            listDiv.classList.add('mg-b5');

            for (let j = 0; j < lottoData[i].length; j++) {

                let ballDiv = document.createElement('div');
                let alp = document.createElement('div');
                alp.classList.add('alp');

                if (i === 0) alp.innerHTML = 'A';
                else if (i === 1) alp.innerHTML = 'B';
                else if (i === 2) alp.innerHTML = 'C';
                else if (i === 3) alp.innerHTML = 'D';
                else if (i === 4) alp.innerHTML = 'E';

                if(j === 0) listDiv.appendChild(alp);
                ballDiv.className = 'ball-' + _this.fn_digitNumber(lottoData[i][j]);
                ballDiv.textContent = lottoData[i][j];
                listDiv.appendChild(ballDiv);
            }

            autoBallList.appendChild(listDiv);
        }

        _this.isNumberCreate = true;
    },
    //로또 번호 저장
    fn_lotto_number_save : function() {

        const _this = this;

        if(_this.autoLottoData.length === 0) {
            alert('저장 할 로또 번호를 생성해주세요.');
            return;
        }

        if(!_this.isNumberCreate) {
            alert('이미 저장 된 번호입니다.\n저장 할 번호를 새로 생성해주세요.');
            return;
        }

        const saveDate = _this.fn_set_now_date();

        let storageData = {
            'lottoData' : _this.autoLottoData,
            'saveDate' : saveDate.currentDateTime,
            'key' : saveDate.key
        }

        // 배열을 JSON 문자열로 변환
        let arrayString = JSON.stringify(storageData);

        // Local Storage 저장
        localStorage.setItem('lottoData_' + saveDate.key, arrayString);

        alert('저장되었습니다.');
        _this.isNumberCreate = false;

    },
    //현재 날짜 및 시간 생성
    fn_set_now_date : function() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const date =  {
            'key' : year + month + day + hours + minutes + seconds,
            'currentDateTime' : year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        };

        return date;
    },
    //저장된 로또 번호 들고오기
    fn_get_save_number_list : function() {

        const _this = this;
        let roundSelect  = document.getElementById('roundSelect');
        let infoText = document.getElementById('infoText');
        let draw = {};
        let winningNumbers = [];

        localStorage.removeItem('adfit.storage.test');
        localStorage.removeItem('adfit.ba.creativeCacheItems');
        localStorage.removeItem('adfit.ba.lazyLoadingOptions');

        //초기화
        document.getElementById('saveLottoList').innerHTML = '';

        let keyArr = [];

        //storage 키 저장
        for (let i = 0; i < localStorage.length; i++) {
            if(localStorage.key(i).startsWith('lottoData_')) keyArr.push(localStorage.key(i));
        }

        // 선택된 숫자 정렬
        keyArr.sort().reverse();

        const saveLottoList = document.getElementById('saveLottoList');

        //데이터가 없는 경우
        if(keyArr.length === 0) {

            let listDiv= document.createElement('div');

            listDiv.classList.add('list');
            listDiv.classList.add('mg-t100');

            let iEle = document.createElement('i');
            iEle.classList.add('fa-solid');
            iEle.classList.add('fa-circle-exclamation');
            iEle.classList.add('fa-2xl');
            listDiv.appendChild(iEle);

            let noDataDiv = document.createElement('div');
            noDataDiv.classList.add('mg-t10');
            noDataDiv.textContent = '저장 된 데이터가 없습니다.';

            listDiv.appendChild(noDataDiv);
            saveLottoList.appendChild(listDiv);
        } else {

            roundSelect.style.display = 'inline-block';
            infoText.style.display = 'inline-block';

            if(roundSelect.children.length === 0) {

                let defaultOption = document.createElement('option');
                defaultOption.selected = true;
                defaultOption.value = '0';
                defaultOption.text = '====== 회차 선택 ======';

                roundSelect.appendChild(defaultOption);

                for (let i = _this.lottoData.length; i >= 1; i--) {
                    let roundOption = document.createElement('option');
                    roundOption.value = i;
                    roundOption.text = i + '회 (' + _this.lottoData[i - 1].drwNoDate + ')';
                    roundSelect.appendChild(roundOption);
                }
            }

            draw = _this.lottoData.find(item => item.drwNo === Number(roundSelect.value));

            if (draw) {
                winningNumbers = [
                    draw.drwtNo1,
                    draw.drwtNo2,
                    draw.drwtNo3,
                    draw.drwtNo4,
                    draw.drwtNo5,
                    draw.drwtNo6,
                ];
            }
        }

        //생성된 storage key 갯수만큼 생성
        for (let i = 0; i < keyArr.length; i++) {

            let listDiv = document.createElement('div');

            listDiv.classList.add('list');
            listDiv.classList.add('mg-t10');

            const lottoData = JSON.parse(localStorage.getItem(keyArr[i]));

            //저장 날짜
            let dateDiv = document.createElement('div');
            dateDiv.classList.add('save-date');

            let spanDiv = document.createElement('span');
            spanDiv.textContent = lottoData.saveDate;

            let btnDiv = document.createElement('button');
            btnDiv.classList.add('btn');
            btnDiv.classList.add('red');
            btnDiv.classList.add('delete-btn');
            btnDiv.setAttribute('data-key', lottoData.key);
            btnDiv.textContent = '삭제';
            btnDiv.onclick = LOTTO.fn_delete_save_lotto_number;

            dateDiv.appendChild(spanDiv);
            dateDiv.appendChild(btnDiv);
            listDiv.appendChild(dateDiv);

            //로또 번호
            let lottoNumberDivs = document.createElement('div');
            lottoNumberDivs.classList.add('lotto-number-list');

            //key storage 안에 로또 번호 데이터 row 를 생성
            for (let j = 0; j < lottoData.lottoData.length; j++) {
                let count = 0;
                let bonus = false;
                let lottoNumbers = document.createElement('div');
                lottoNumbers.classList.add('save-ball-list');
                lottoNumbers.classList.add('txt-ai-c');
                lottoNumbers.classList.add('mg-b5');

                //row 안 숫자 정렬
                for (let k = 0; k < lottoData.lottoData[j].length; k++) {
                    const userNumber = lottoData.lottoData[j][k];
                    let lottoNumber = document.createElement('div');
                    // lottoNumber.className = 'ball-gray' + _this.fn_digitNumber(userNumber);
                    lottoNumber.className = 'ball-gray';

                    if (draw) {
                        if (winningNumbers.includes(userNumber)) {
                            count++;
                            lottoNumber.className = 'ball-' + _this.fn_digitNumber(userNumber);
                        }

                        if(draw.bnusNo === userNumber) bonus = true;
                    }

                    lottoNumber.textContent = lottoData.lottoData[j][k]
                    lottoNumbers.appendChild(lottoNumber);
                }

                let span = document.createElement('span');
                span.classList.add('result-span');
                span.innerText = roundSelect.value === '0' ? '-' : '낙첨';
                span.style.background = '#a4a4a4';

                // 1등: 6개 일치
                if (count === 6) {
                    span.innerText = '1등🎉';
                    span.style.background = '#c36cf5';
                    span.classList.add('ball-check');
                    _this.celebrate_lotto_win(1);

                // 2등: 5개 + 보너스
                } else if (count === 5 && bonus) {
                    span.innerText = '2등';
                    span.style.background = '#46affc';
                    span.classList.add('ball-check');
                    _this.celebrate_lotto_win(2);

                // 3등: 5개
                } else if (count === 5) {
                    span.innerText = '3등';
                    span.style.background = '#b2f343';
                    span.classList.add('ball-check');
                    _this.celebrate_lotto_win(3);

                // 4등: 4개
                } else if (count === 4) {
                    span.innerText = '4등';
                    span.classList.add('ball-check');
                    span.style.background = '#f59451';
                    _this.celebrate_lotto_win(4);

                // 5등: 3개
                } else if (count === 3) {
                    span.innerText = '5등';
                    span.classList.add('ball-check');
                    span.style.background = '#f58e8e';
                    _this.celebrate_lotto_win(5);
                }
                lottoNumbers.appendChild(span);
                listDiv.appendChild(lottoNumbers);
            }
            saveLottoList.appendChild(listDiv);
        }
    },
    //storage 에서 삭제
    fn_delete_save_lotto_number : function(e) {

        const key = 'lottoData_' + e.target.attributes['data-key'].value;
        localStorage.removeItem(key);

        //삭제 후 다시 새로 그려준다.
        LOTTO.fn_get_save_number_list();

        alert("삭제되었습니다.");
    },
    //당첨번호 분석
    fn_get_win_rate_list : function() {

        const _this = this;

        const drwtNoCnt = new Array(46).fill(0); // 당첨 번호 카운트 배열 초기화

        const start = document.getElementById('start').value === '' ? 1 : document.getElementById('start').value;
        const end = document.getElementById('end').value === '' ? _this.lottoData.length : document.getElementById('end').value;
        const hasBonus = document.getElementById('hasBonus').value;

        for (let i = 0; i < _this.lottoData.length; i++) {

            if(i + 1 >= start && i + 1 <= end) {
                const lottoData = _this.lottoData[i];

                for (let j = 1; j <= 6; j++) {
                    if (lottoData[`drwtNo${j}`] <= 46) {
                        drwtNoCnt[lottoData[`drwtNo${j}`]]++;
                    }
                }
                if(hasBonus === 'Y') {
                    drwtNoCnt[lottoData[`bnusNo`]]++;
                }
            }
        }

        const drwtNoCntArr = [];

        for (let i = 1; i <= 45; i++) {
            let obj = {};
            obj[i] = drwtNoCnt[i];
            drwtNoCntArr.push(obj);
        }

        // 값을 기준으로 정렬
        drwtNoCntArr.sort(function(a, b) {
            return b[Object.keys(b)[0]] - a[Object.keys(a)[0]];
        });

        const winRateList = document.getElementById('winRateList');

        for (let i = 0; i < drwtNoCntArr.length; i++) {

            let winRateDiv = document.createElement('div');
            winRateDiv.classList.add('win-rate-list-group');
            const key = Object.keys(drwtNoCntArr[i])[0];
            const value = drwtNoCntArr[i][key];

            let winRateBallDiv = document.createElement('div');
            winRateBallDiv.classList.add('ball-' + _this.fn_digitNumber(key));
            winRateBallDiv.textContent = key;

            let winRateCntDiv = document.createElement('div');
            winRateCntDiv.classList.add('win-rate-cnt-div');
            winRateCntDiv.textContent = value + '번';

            winRateDiv.appendChild(winRateBallDiv);
            winRateDiv.appendChild(winRateCntDiv);

            winRateList.appendChild(winRateDiv);
        }
    },
    //당첨번호 초기화
    fn_win_rate_init : function() {
        const winRateList = document.getElementById('winRateList');
        winRateList.innerText = '';
    },
    //시작일, 종료일
    fn_lotto_start_end : function() {

        const _this = this;

        const start = document.getElementById('start');
        const end = document.getElementById('end');

        for(let i = 1; i <= _this.lottoData.length; i++) {
            let startOption = document.createElement('option');
            startOption.value = i;
            startOption.text = i + '회 (' + _this.lottoData[i-1].drwNoDate + ')';
            start.appendChild(startOption);

            let endOption = document.createElement('option');
            endOption.value = i;
            endOption.text = i + '회 (' + _this.lottoData[i-1].drwNoDate + ')';
            end.appendChild(endOption);
            if(_this.lottoData.length === i) endOption.selected = true;
        }
    },
    //1등 판매점 리스트 조회
    fn_get_store_data : function() {
        let _this = this;

        _this.fn_get_turn_list();

        const url = '/lotto/lottoStore.json?date=' + new Date();
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                const response = JSON.parse(xhr.responseText);

                _this.storeData = response;

                _this.fn_create_store_list();

            } else {
                console.error('Error:', xhr.status);
            }
        };

        xhr.onerror = function() {
            console.error('Request failed');
        };

        xhr.send();
    },
    fn_get_turn_list : function() {
        const _this = this;

        const turn = document.getElementById('turnList');

        for(let i = 1; i <= _this.lottoData.length; i++) {
            let turnOption = document.createElement('option');
            turnOption.value = i;
            turnOption.text = i + '회 (' + _this.lottoData[i-1].drwNoDate + ')';
            turn.appendChild(turnOption);

            if(_this.lottoData.length === i) turnOption.selected = true;
        }
    },
    //1등 판매점 리스트 생성
    fn_create_store_list : function() {

        const _this = this;

        const turn = document.getElementById('turnList').value;
        const storeDiv = document.getElementById('storeList');

        let hasDrwNo = false;

        for(let i = 0; i < _this.storeData.length; i++) {

            if(Number(_this.storeData[i].drwNo) === Number(turn)) {

                hasDrwNo = true;

                const list = _this.storeData[i].list;

                for(let j = 0; j < list.length; j++) {

                    let storeSubDiv = document.createElement('div');
                    storeSubDiv.classList.add('store-sub-div');

                    let titleDiv = document.createElement('div');
                    titleDiv.classList.add('store-title');
                    titleDiv.textContent = list[j].storeName;

                    let gubunDiv = document.createElement('div');
                    gubunDiv.classList.add('store-gubun');
                    gubunDiv.textContent = ' | ' + list[j].gubun;

                    //지도 표출 삭제
                    //let pointDiv = document.createElement('a');
                    //pointDiv.classList.add('store-point');
                    //pointDiv.href = list[j].point;

                    //let imgDiv = document.createElement('img');
                    //imgDiv.classList.add('store-img');
                    //imgDiv.src ='src/img/ico_location.png';

                    //pointDiv.appendChild(imgDiv);

                    let addrDiv = document.createElement('div');
                    addrDiv.classList.add('addr-gubun');
                    addrDiv.textContent = list[j].addr;

                    storeSubDiv.appendChild(titleDiv);
                    storeSubDiv.appendChild(gubunDiv);
                    //storeSubDiv.appendChild(pointDiv);
                    storeSubDiv.appendChild(addrDiv);

                    storeDiv.appendChild(storeSubDiv);
                }
            }
        }

        if(!hasDrwNo) {
            let storeSubDiv = document.createElement('div');
            storeSubDiv.classList.add('store-sub-empty-div');
            storeSubDiv.textContent = '등록된 데이터가 없습니다.';
            storeDiv.appendChild(storeSubDiv);
        }
    }
    //로또 수령금 초기화
    , fn_calculator_init : function() {
        document.getElementById('calculator').style.display = 'inline-block';
        document.getElementById('calculator').value = '';
        document.getElementById('calculator-btn').style.display = 'inline-block';

        const elementsToDelete = document.getElementsByClassName('calculator-table');

        Array.from(elementsToDelete).forEach(function(element) {
            element.remove();
        });
    }
    //로또 수령금 계산하기
    , fn_calculator : function() {

        const _this = this;
        const money = document.getElementById('calculator').value;

        if(money === '') {

            alert('당첨금액을 입력하세요.');
            document.getElementById('calculator').focus();
            return;
        } else {

            _this.fn_set_modal_title('calculatorTitle', '실수령액 확인');
            document.getElementById('calculator').style.display = 'none';
            document.getElementById('calculator-btn').style.display = 'none';

            let container = document.getElementById('lotto-calculator');

            // 테이블 요소를 생성
            let table = document.createElement('table');
            table.classList.add('calculator-table');

            let tax = 0;
            let salary = Number(money.replace(/,/g, ''));

            let receivedAmount = 0;

            if (salary <= 2000000){
                tax = 0;
            }else if (salary <= 300000000) {
                tax = (salary-1000) * 0.22;
            } else {
                tax = (300000000*0.22)+((salary-300000000-1000) * 0.33);
            }

            receivedAmount = Number(salary) - Number(tax);

            for (let i = 0; i < 3; i++) {

                let row = table.insertRow();

                for (let j = 0; j < 2; j++) {
                    let cell = row.insertCell();
                    if(i === 0 && j === 0) {
                        cell.textContent = '당첨금';
                    } else if(i === 0 && j === 1) {
                        cell.textContent = Number(money.replace(/,/g, '')).toLocaleString('ko-KR') + '원'
                    } else if(i === 1 && j === 0) {
                        cell.textContent = '세금';
                    } else if(i === 1 && i === 1) {
                        cell.textContent = Math.floor(tax).toLocaleString('ko-KR') + '원';
                    } else if(i === 2 && j === 0) {
                        cell.textContent = '예상 실수령액';
                        cell.classList.add('total-amount');
                    } else if(i === 2  && j === 1 ) {
                        //cell.textContent = receivedAmount.toLocaleString('ko-KR') + '원';
                        cell.textContent = Math.floor(receivedAmount).toLocaleString('ko-KR') + '원';
                        cell.classList.add('total-amount');
                    }
                    cell.classList.add('table-cell');
                }
            }

            container.appendChild(table);
        }
    }
    //로또 수령금 숫자만 입력 및 천단위로 콤마 찍기
    ,fn_formatNumber : function(input) {

        input.value = input.value.replace(/[^0-9]/g, '');

        const inputValue = input.value.replace(/,/g, '');

        if (!isNaN(Number(inputValue))) {
            input.value = Number(inputValue).toLocaleString();
        }
    }
    //정통사주 복권 추천일 초기화
    ,fn_five_init : function() {
        document.getElementById('birth').value = '';
        document.getElementById('birth-time').value = '';
        document.getElementById('sex').value = '';
        document.getElementById('five-lotto-search').style.display = 'inline-block';
        document.getElementById('five-lotto-result').style.display = 'none';

        let msgElements = Array.from(document.getElementsByClassName('five-result-msg'));

        // 배열의 각 요소를 순회하면서 제거
        msgElements.forEach(element => {
            element.remove();
        });

        const elementsToDelete = document.getElementsByClassName('five-table');

        Array.from(elementsToDelete).forEach(function(element) {
            element.remove();
        });

        const closeBtn = document.getElementsByClassName('result-close-btn');

        Array.from(closeBtn).forEach(function(element) {
            element.remove();
        });

        const list = document.getElementsByClassName('list');

        Array.from(list).forEach(function(element) {
            element.remove();
        });
    }
    //오행보기
    ,fn_five_day_view : function() {

        const _this = this;
        const birth = document.getElementById('birth').value;

        if(birth === '') {

            alert('생년월일을 입력하세요.');
            document.getElementById('birth').focus();
            return;
        }

        // 현재 날짜 생성
        const today = new Date();
        const birthDateString = birth.toString();
        const formattedBirthDate = `${birthDateString.substring(0, 4)}-${birthDateString.substring(4, 6)}-${birthDateString.substring(6, 8)}`;
        const birthDate = new Date(formattedBirthDate);

        // 오늘 이후의 날짜인지 체크
        if (birthDate > today) {
            alert('입력된 날짜는 오늘 이후의 날짜입니다.');
            document.getElementById('birth').focus();
            return;

        }

        const birthTime = document.getElementById('birth-time').value;

        if(birthTime === '') {

            alert('출생시간을 선택하세요.');

            document.getElementById('birth-time').focus();
            return;
        }
        const sex = document.getElementById('sex').value;

        if(sex === '') {

            alert('성별을 선택하세요.');

            document.getElementById('sex').focus();
            return;
        }
        if (!_this.fn_isValid_date(birth)) {

            alert(`${birth}은(는) 올바른 생년월일 형식이 아닙니다.`);
            document.getElementById('birth').focus();
            document.getElementById('birth').innerText = '';
            return;
        }

        this.inputBirth = birth;
        this.fn_five_day_result_view_init();
    }
    , fn_isValid_date : function(inputDate) {
        // yyyymmdd 형식의 정규식
        const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

        // 정규식과 매치되는지 확인
        return regex.test(inputDate);
    }
    //modal 화면 다시 그리기
    ,fn_five_day_result_view_init : function() {

        const _this = this;
        const loadingSpinner = document.getElementById("loadingSpinner");

        // 로딩 바를 표시
        loadingSpinner.style.display = 'block';

        document.getElementById('five-lotto-search').style.display = 'none';
        document.getElementById('five-lotto-result').style.display = 'inline-block';
        document.getElementById('loading-msg-1').style.display = 'inline-block';

        setTimeout(function() {
            document.getElementById('loading-msg-1').style.display = 'none';
            document.getElementById('loading-msg-2').style.display = 'inline-block';

            setTimeout(function() {
                document.getElementById('loading-msg-2').style.display = 'none';
                loadingSpinner.style.display = 'none';
                _this.fn_five_day_result_view();
            }, 5000);
        }, 5000);
    }
    //결과 보여주기
    ,fn_five_day_result_view : function() {

        const _this = this;

        _this.fn_set_modal_title('fiveTitle', '정통사주 추천일 확인결과');

        let container = document.getElementById('five-lotto-result');

        //오늘 날짜
        const today = _this.fn_get_today();

        //테이블에서 사용 할 현재 날짜 가져오기
        let tbToday = new Date();

        // 5일치 날짜를 저장할 배열 생성
        let dateArray = [];

        //오행 데이터 들고오기
        _this.fn_get_five_day_result_data();

        if(_this.fiveResultIdx === -1) {
            //데이터가 없는 경우
            let listDiv = document.createElement('div');

            listDiv.classList.add('list');
            listDiv.classList.add('mg-t100');

            let iEle = document.createElement('i');
            iEle.classList.add('fa-solid');
            iEle.classList.add('fa-circle-exclamation');
            iEle.classList.add('fa-2xl');
            listDiv.appendChild(iEle);

            let noDataDiv = document.createElement('div');
            noDataDiv.classList.add('mg-t10');
            noDataDiv.textContent = '조회된 된 데이터가 없습니다.';

            listDiv.appendChild(noDataDiv);
            container.appendChild(listDiv);
            container.appendChild(_this.fn_close_btn());

        } else {
            setTimeout(function() {

                let msgDiv = document.createElement('div');
                msgDiv.classList.add('five-result-msg');

                let msgSpan = document.createElement('span');
                msgSpan.classList.add('five-result-today-msg');
                msgSpan.innerHTML = today;

                msgDiv.innerHTML = '<br/> 회원님의 <br/>';
                msgDiv.appendChild(msgSpan); // msgSpan을 msgDiv에 추가
                msgDiv.innerHTML += '기준 <br/> 5일간의 추천일입니다.'; // HTML 형식의 줄바꿈 추가
                container.appendChild(msgDiv);

                // 테이블 요소를 생성
                let table = document.createElement('table');
                table.classList.add('five-table');
                table.classList.add('mg-b10');

                for (let i = 0; i < 5; i++) {

                    let row = table.insertRow();
                    // UTC 날짜로 변환하여 사용
                    let currentDate = new Date(tbToday.getTime() + i * 24 * 60 * 60 * 1000);
                    // 월과 일을 가져와서 2자리 숫자로 만들기
                    let mm = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                    let dd = currentDate.getDate().toString().padStart(2, '0');

                    // mm-dd 형식으로 조합
                    let formattedDate = `${mm}월${dd}일`;

                    dateArray.push(formattedDate);

                    for (let j = 0; j < 2; j++) {
                        let cell = row.insertCell();
                        if(i === 0 && j === 0) {
                            cell.textContent = dateArray[0];
                            if(_this.fiveResult[_this.fiveResultIdx].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 0 && j == 1) {
                            cell.textContent = _this.fiveResult[_this.fiveResultIdx].Result;
                            if(_this.fiveResult[_this.fiveResultIdx].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 1 && j === 0) {
                            cell.textContent = dateArray[1];
                            if(_this.fiveResult[_this.fiveResultIdx + 1].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 1 && i === 1) {
                            cell.textContent = _this.fiveResult[_this.fiveResultIdx + 1].Result;
                            if(_this.fiveResult[_this.fiveResultIdx + 1].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 2 && j === 0) {
                            cell.textContent = dateArray[2];
                            if(_this.fiveResult[_this.fiveResultIdx + 2].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 2  && j === 1 ) {
                            cell.textContent = _this.fiveResult[_this.fiveResultIdx + 2].Result;
                            if(_this.fiveResult[_this.fiveResultIdx + 2].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 3  && j === 0 ) {
                            cell.textContent = dateArray[3];
                            if(_this.fiveResult[_this.fiveResultIdx + 3].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 3  && j === 1 ) {
                            cell.textContent = _this.fiveResult[_this.fiveResultIdx + 3].Result;
                            if(_this.fiveResult[_this.fiveResultIdx + 3].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 4  && j === 0 ) {
                            cell.textContent = dateArray[4];
                            if(_this.fiveResult[_this.fiveResultIdx + 4].Score === 3) cell.classList.add('blue-font');
                        } else if(i === 4  && j === 1 ) {
                            cell.textContent = _this.fiveResult[_this.fiveResultIdx + 4].Result;
                            if(_this.fiveResult[_this.fiveResultIdx + 4].Score === 3) cell.classList.add('blue-font');
                        }
                        cell.classList.add('table-cell');
                    }
                }

                container.appendChild(table);
                container.appendChild(_this.fn_close_btn());

            }, 100);
        }
    }
    , fn_close_btn : function() {

        let newButton = document.createElement('button');
        newButton.className = 'btn bottom-btn-gray result-close-btn';
        newButton.textContent = '닫기';

        // 클릭 이벤트 핸들러 추가 (LOTTO.fn_modal_close 함수 호출)
        newButton.addEventListener('click', function() {
            LOTTO.fn_modal_close('fiveSection-modal');
        });

        return newButton;
    }
    , fn_get_today : function() {
        // 현재 날짜 객체 생성
        let today = new Date();

        // 년, 월, 일 정보 가져오기
        let year = today.getFullYear();
        let month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
        let day = today.getDate();

        // 날짜를 원하는 형식으로 표시
        let formattedDate = year + '년 ' + (month < 10 ? '0' + month : month) + '월 ' + (day < 10 ? '0' + day : day) + '일';

        return formattedDate;
    }
    //오행 데이터 찾아오기
    ,fn_get_five_day_result_data : function() {

        const _this = this;

        const birth = this.inputBirth;
        const perp = this.perpData;
        let fiveElem = '';

        let yyyy = Number(birth.slice(0, 4));
        let mm = Number(birth.slice(4, 6));
        let dd = Number(birth.slice(6, 8));

        for(let i = 0; i < perp.length; i++) {
            if(perp[i].year === yyyy && perp[i].month === mm && perp[i].day === dd) {
                fiveElem = perp[i].fiveElem;
                break;
            }
        }

        // 현재 날짜 객체 생성
        let today = new Date();

        // getDay() 메서드를 사용하여 요일(0~6) 가져오기
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        let fiveElem2 = '';

        for(let i = 0; i < perp.length; i++) {
            if(perp[i].year === year && perp[i].month === month && perp[i].day === day) {
                fiveElem2 = perp[i].fiveElem;
                break;
            }
        }

        for(let i = 0; i < _this.fiveResult.length; i++) {
            if(_this.fiveResult[i].Birth === fiveElem && _this.fiveResult[i].Today === fiveElem2 ) {
                _this.fiveResultIdx = i;
                break;
            }
        }
    }
    //QR카메라
    , fn_qr_camera_show : function() {
        if (window.Android && Android.openQRScanner) {
            Android.openQRScanner();
        }
    }
    , fn_send_mail : function() {
        const subject = encodeURIComponent('조상님로또 의견/문의글입니다.');
        window.location.href = `mailto:devmango1128@gmail.com?subject=${subject}`;
    }
    //폰트사이즈변경
    , fn_font_size_change: function(factor) {
        let html = document.documentElement;
        let baseFontSize = parseInt(localStorage.getItem("fontSize")) || 16;
        let newFontSize = baseFontSize + factor;
        // newFontSize = Math.max(9, Math.min(16, newFontSize));
        localStorage.setItem("fontSize", newFontSize);
        html.style.fontSize = `${newFontSize}px`;
        let baseLineHeight = baseFontSize * 2 + factor;
        html.style.lineHeight = `${baseLineHeight}px`;

        let body = document.body;
        body.style.transformOrigin = "0 0";
        body.style.position = "fixed";
        body.style.width = "100vw";
        body.style.height = "100vh";
        body.style.overflow = "hidden";
    }
    //화면사이즈변경
    , fn_view_size_change : function(factor) {
        let body = document.body;
        let currentScale = parseFloat(body.dataset.scale) || 1;
        let newScale = currentScale + factor;

        if(newScale > 1) return;

        body.style.transform = `scale(${newScale})`;
        body.style.transformOrigin = "0 0";
        body.style.position = "fixed";
        body.style.width = "100vw";
        body.style.height = "100vh";
        body.style.overflow = "hidden";

        body.dataset.scale = newScale;
    }

    , celebrate_lotto_win : function(rank) {
        const banner = document.getElementById('congrats-banner');
        const lines = banner.querySelectorAll('.banner-line');
        const rankSpan = document.getElementById('lotto-rank');

        rankSpan.textContent = `${rank}등`;
        banner.classList.remove('hidden');

        lines.forEach((line, idx) => {
            setTimeout(() => line.classList.add('show'), 100 * idx);
        });

        setTimeout(() => {
            lines.forEach((line) => line.classList.remove('show'));
            setTimeout(() => banner.classList.add('hidden'), 100);
        }, 1000);
        console.log('-----1');
        const duration = 2000;
        const end = Date.now() + duration;
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 80,
            zIndex: 9999,
            colors: ['#1976d2', '#ff4081', '#4caf50', '#ffeb3b']
        };
        console.log('------2');
        // (function frame() {
        //     confetti({
        //         ...defaults,
        //         particleCount: 4,
        //         origin: { x: Math.random(), y: Math.random() * 0.4 }
        //     });
        //     console.log('-------3');
        //     if (Date.now() < end) requestAnimationFrame(frame);
        // })();

        window.addEventListener('load', () => {
            const interval = setInterval(() => {
                confetti({
                    ...defaults,
                    particleCount: 4,
                    origin: { x: Math.random(), y: Math.random() * 0.4 }
                });
            
                if (Date.now() > end) {
                    clearInterval(interval);
                }
            }, 16);
        });
    }
}

document.addEventListener('DOMContentLoaded', function(){
    LOTTO.init();
});
