'use strict';

// 定数定義


// オブジェクト
const Font = {
  font: 'bold {{}}px serif', // フォント
  fontcolor: 'red' // 文字色
}

function getYMD(d){
    return d.getFullYear() + "/" +
        (d.getMonth()+1) + "/" + 
        d.getDate();
        //d.getDate() + "," + 
        //[ "日", "月", "火", "水", "木", "金", "土" ][d.getDay()] ;    // 曜日(日本語表記)
}

function msg(str){
    document.getElementById("msg").innerHTML = str;
}

// [event] ページ読み込み完了
window.onload = function(e){
    const message = document.querySelector('#txt-message'); // テキストボックス
    const colorText = document.querySelector('#color-text'); // 文字色
    const colorBg = document.querySelector('#color-bg'); // 背景色

    document.getElementById("file").addEventListener('change', function(e){

        const files = e.target.files;
        console.log("file num: "+files.length);
        let readers = new Array();
        let dateStrs = new Array();

        for(let i=0; i<files.length; i++){
            // EXIF.getDataでexif情報を解析
            EXIF.getData(files[i], function() {
                const date = EXIF.getTag(this, "DateTimeOriginal");
                if(date){
                    dateStrs.push( date.split(" ")[0].replace(/:/g,"/"));
                    console.log(dateStrs[i]);
                }else{
                    msg("Exif情報がありません。本日の日付を入れます");
                    dateStrs.push( getYMD(new Date()));
                    console.log(dateStrs[i]);
                }
            });
        
            readers[i] = new FileReader();

            readers[i].onload = function(event) {
                let image = new Image();
                image.onload = function() {
                    //canvas と img の作成
                    // Canvasの情報を代入
                    const view = document.querySelector('#view');
                    const canvases = [];
                    const imgs = [];
                    canvases[i] = document.createElement("canvas");
                    imgs[i] = document.createElement("img");
                    view.appendChild(canvases[i]);
                    view.appendChild(imgs[i]);

                    canvases[i].ctx = canvases[i].getContext('2d');

                    canvases[i].width  = image.naturalWidth;
                    canvases[i].height = image.naturalHeight;

                    // 画像を表示
                    canvases[i].ctx.drawImage(image, 0, 0);

                    // 文字を描画
                    const fontSize = Math.round(canvases[i].height/24)
                    const strH = Math.round(fontSize*1.3);
                    canvases[i].ctx.font = Font.font.replace("{{}}",fontSize);
                    canvases[i].ctx.fillStyle = Font.fontcolor;
                    canvases[i].ctx.fillText(dateStrs[i], 40, strH, canvases[i].width);

                    imgs[i].src = canvases[i].toDataURL("image/jpeg");
                    canvases[i].style.display = "none";
                }
                image.src = event.target.result;
            }
            readers[i].readAsDataURL(e.target.files[i]);
        }

    });
}


