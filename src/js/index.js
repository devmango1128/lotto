let LOTTO = {
    init : function() {

    },
    number_create : function(obj, type) {
        let menus = document.getElementsByClassName("menu");

        for(let i = 0; i < menus.length; i++) {
            let menu = menus.item(i);
            menu.classList.remove('active')
        }

        obj.classList.toggle('active', true);
        alert('lotto 자동생성');
    }
}

document.addEventListener("DOMContentLoaded", function(){
    LOTTO.init();
});
