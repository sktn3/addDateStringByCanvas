// 定数定義

// オブジェクト
const Banner = {
  font: 'bold 42px serif', // フォント
  fontcolor: 'red', // 文字色
  text: getYMD(new Date()), // テキスト

  board: null,
  reader: null,

  // Canvas情報
  canvas: {
    width: null, // 横幅
    height: null, // 高さ
    ctx: null // context
  }
}

function getYMD(d){
    return d.getFullYear() + "/" +
        (d.getMonth()+1) + "/" + 
        d.getDate();
        //d.getDate() + "," + 
        //[ "日", "月", "火", "水", "木", "金", "土" ][d.getDay()] ;    // 曜日(日本語表記)
}

// [event] ページ読み込み完了
window.onload = function(e){
  const message = document.querySelector('#txt-message'); // テキストボックス
  const colorText = document.querySelector('#color-text'); // 文字色
  const colorBg = document.querySelector('#color-bg'); // 背景色

  // Canvasの情報を代入
  const board = document.querySelector('#board');
  Banner.canvas.ctx = board.getContext('2d');
  Banner.canvas.width = board.width;   // 横幅
  Banner.canvas.height = board.height;  // 高さ
  Banner.board = board;

    document.getElementById("file").addEventListener('change', function(e){
        const canvas = Banner.board;
        const ctx = Banner.canvas.ctx;
        const reader = new FileReader();
        const img = document.getElementById("img");

        // EXIF.getDataでexif情報を解析
        EXIF.getData(e.target.files[0], function() {
            Banner.text = (EXIF.getTag(this, "DateTimeOriginal")).split(" ")[0].replace(/:/g,"/");
        });

        reader.onload = function(event) {
            let image = new Image();
            image.onload = function() {
                canvas.width  = image.naturalWidth;
                canvas.height = image.naturalHeight;

                // 画像を表示
                ctx.drawImage(image, 0, 0);

                // 文字を描画
                ctx.font = Banner.font;
                ctx.fillStyle = Banner.fontcolor;
                ctx.fillText(Banner.text, canvas.width-300, 40, canvas.width);

                img.src = canvas.toDataURL();
                canvas.style.display = "none";
            }
            image.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);

    });
}


