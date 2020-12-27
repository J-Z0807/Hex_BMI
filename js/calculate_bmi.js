//排序
let localStorageKey = Object.keys(localStorage).sort(function(a, b) {
    return a.substr(a.lastIndexOf("_") + 1) - b.substr(b.lastIndexOf("_") + 1);
});

//抓取所有紀錄的排序過後最大key值(最大為最後一筆)
localStorageKey = localStorageKey[localStorageKey.length-1];

//用來命名紀錄的key值索引(抓取key的最後一個字元看他索引是多少，加一是為了可以新增下一筆資料)
var dataIndex = localStorageKey != "" ? parseInt(localStorageKey.substr(localStorageKey.lastIndexOf("_") + 1)) + 1 : 0;

$(document).ready(function(){
    if(localStorage.length > 0){ //如果有紀錄時才做顯示動作
        show_record();
        $(".main__title--no_Record").addClass("display_none"); //隱藏查無紀錄訊息
    }
    else{
        $(".main__title--no_Record").removeClass("display_none"); //顯示查無紀錄訊息
    }

    let calculate_btn = document.querySelector('.header__calculateBtn');

    calculate_btn.addEventListener('click',function(){
        let height = document.querySelector('.height').value;
        let weight = document.querySelector('.weight').value;

        if(height != "" && weight != ""){
            let BMI = weight / (height/100 * height/100);
            BMI = BMI.toFixed(2); //取小數點後兩位

            let conclusion = "理想"; //身體狀況文字
            let record_border_color = ""; //紀錄邊框顏色
            let color = ""; //預設為理想顏色

            if(BMI < 18.5){ //過輕
                record_border_color = "Too_light";
                color = "#31BAF9";
                conclusion = "過輕";
            }
            else if(BMI >= 18.5 && BMI < 24){ //理想
                record_border_color = "ideal";
                color = "#86D73F";
                conclusion = "理想";
            }
            else if(BMI >= 24 && BMI < 27){ //過重
                record_border_color = "Too_heavy";
                color = "#FF982D";
                conclusion = "過重";
            }
            else if(BMI >= 27 && BMI < 30){ //輕度肥胖
                record_border_color = "Mild_obesity";
                color = "#FF6C02";
                conclusion = "輕度肥胖";
            }
            else if(BMI >= 30 && BMI < 35){ //中度肥胖
                record_border_color = "Moderate_obesity";
                color = "#FF6C02";
                conclusion = "中度肥胖";
            }
            else if(BMI >= 35){ //重度肥胖
                record_border_color = "Severe_obesity";
                color = "#FF1200";
                conclusion = "重度肥胖";
            }
            else{
                //超出預期，直接跳開
                alert("哇! 你的BMI數值太特殊拉~" + `BMI值:${BMI}`);
                return;
            }

            //更改呈現顏色
            $(".header__resultBtn").css("color", color);
            $(".header__resultBtn__area").css("borderColor", color);
            $(".refresh").css("backgroundColor", color);

            $(".header__resultBtn__value").text(BMI); //更改BMI數值
            $(".header__resultText").text(conclusion); //更改身體狀況提示文字

            $(".header__calculateBtn").addClass("display_none"); //隱藏計算按鈕
            $(".header__resultBtn").removeClass("display_none"); //顯示結果按鈕

            let date = new Date();
            let Data = {
                "BMI":BMI,
                "resultText":conclusion,
                "height":height,
                "weight":weight,
                "date": `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()}`,
                "border-color": record_border_color
            }

            $(".main__title--no_Record").addClass("display_none"); //隱藏查無紀錄訊息
            
            $(".main__list__area").prepend(`<div class="main__list main__list__border--${Data['border-color']}">
            <p class="main__list__status">${Data['resultText']}</p>
            <p><small>BMI</small><span class="main__list__BMI"><b>${Data['BMI']}</b></span></p>
            <p><small>weight</small><span class="main__list__weight"><b>${Data['weight']}kg</b></span></p>
            <p><small>height</small><span class="main__list__height"><b>${Data['height']}cm</b></span></p>
            <small class="main__list__date__title--mobile">檢測日期</small>
            <p class="main__list__date">${Data['date']}</p>
            <i class="fa fa-trash trash${dataIndex}" onclick="del_record(${dataIndex})"></i>
        </div>`);

            localStorage.setItem("BMI_DATA_" + dataIndex, JSON.stringify(Data));
            dataIndex++; //紀錄+1
        }
        else{
            alert("身高或體重欄位不可為空!");
        }     
        
    })
})

//刷新按鈕
function refresh(){
    document.querySelector('.height').value = "";
    document.querySelector('.weight').value = "";
    $(".header__calculateBtn").removeClass("display_none");
    $(".header__resultBtn").addClass("display_none");
}

//顯示紀錄
function show_record(){
    let record;
    let record_html = "";
    let record_index = localStorage.length;
    
    for(let i = dataIndex; i >= 0 ; i--){ //從最新到最舊顯示
        record = JSON.parse(localStorage.getItem("BMI_DATA_" + i));

        if(record != null){
            record_html += `<div class="main__list main__list__border--${record['border-color']} ${ i < record_index - 10 ? 'display_none': ''}">
            <p class="main__list__status">${record['resultText']}</p>
            <p><small>BMI</small><span class="main__list__BMI"><b>${record['BMI']}</b></span></p>
            <p><small>weight</small><span class="main__list__weight"><b>${record['weight']}kg</b></span></p>
            <p><small>height</small><span class="main__list__height"><b>${record['height']}cm</b></span></p>
            <small class="main__list__date__title--mobile">檢測日期</small>
            <p class="main__list__date">${record['date']}</p>
            <i class="fa fa-trash trash${i}" onclick="del_record(${i})"></i>
        </div>`;
        }
    }

    $(".main__list__area").append(record_html);

    if(record_index > 10){
        $(".more_record").removeClass("display_none");
    }
}

//顯示全部記錄
function all_record(){
    $(".main__list").removeClass("display_none"); //將所有紀錄顯示出來
    $(".more_record").addClass("display_none"); //更多紀錄按鈕隱藏
}

//刪除紀錄
function del_record(index){
    if(confirm("你確定要刪除此筆紀錄嗎?")){
        localStorage.removeItem("BMI_DATA_" + index);
        $(".trash" + index).parent()[0].remove(); //及時刪除畫面中該筆BMI紀錄

        //重新抓取最後一筆索引值
        //排序
        localStorageKey = Object.keys(localStorage).sort(function(a, b) {
            return a.substr(a.lastIndexOf("_") + 1) - b.substr(b.lastIndexOf("_") + 1);
        });

        //抓取所有紀錄的排序過後最大key值(最大為最後一筆)
        localStorageKey = localStorageKey[localStorageKey.length-1];

        //用來命名紀錄的key值索引(抓取key的最後一個字元看他索引是多少，加一是為了可以新增下一筆資料)
        dataIndex = localStorageKey != "" ? parseInt(localStorageKey.substr(localStorageKey.lastIndexOf("_") + 1)) + 1 : 0;
    }
}