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
        console.log(latestRound);
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
    }
}

document.addEventListener("DOMContentLoaded", function(){
    LOTTO.init();
});
