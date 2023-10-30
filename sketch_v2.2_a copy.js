  //DP'Brush version 2.2
  
  var Brushes = ["a", "b", "c", "d", "e", "f"];
  var imageIndex = 0;
  let img = [];
  
  let paths_x = [];
  let paths_y = [];
  let imgSizeArray = [];
  let rotateVal = [];
  let imgIndexArray = [];
  let maxSizeArray = [];
  
  let rotateNoiseOffset = 0;
  let sizeNoiseOffset = 0;
  let maxSizeNoiseOffset = 0;
  let maxSizeNoiseScale = 0.01;
  let rotateNoiseScale = 0.005; 
  let sizeNoiseScale = 0.005; 

  /*-----------------------------------------------------------------------------*/
  //自定义参数设置，UI控制

  var gui;
  var visible = true;

  //图片生成步长
  var ImgLength = 1;
  var ImgLengthMin = 1;
  var ImgLengthMax = 10;
  var ImgLengthStep = 1;

  //图片生成最小值，开始生成的图片尺寸
  var minImgSize = 10; 
  var minImgSizeMin = 0;
  var minImgSizeMax = 500;
  var minImgSizeStep = 10;

  //图片生成最大值，结束生成的图片尺寸
  var maxImgSize = 200; 
  var maxImgSizeMin = 0;
  var maxImgSizeMax = 500;
  var maxImgSizeStep = 10;

  //控制旋转的噪声大小
  var rotateScale = 1; 
  var rotateScaleMin = 0;
  var rotateScaleMax = 100;
  var rotateScaleStep = 1;
  
  //控制旋转速度
  var rotateSpeed = 5;
  var rotateSpeedMin = 0;
  var rotateSpeedMax = 100;
  var rotateSpeedStep = 1;

  //图片连续大小变化
  var imgSizeScale = 0.5;
  var imgSizeScaleMin = 0;
  var imgSizeScaleMax = 1;
  var imgSizeScaleStep = 0.01;
  
  
  /*-----------------------------------------------------------------------------*/
  //主要控制程序
  
  function preload() {

    img[0] = loadImage("../images/1.png");
    img[1] = loadImage("../images/2.png");
    img[2] = loadImage("../images/3.png");
    img[3] = loadImage("../images/4.png");
    img[4] = loadImage("../images/5.png");
    img[5] = loadImage("../images/6.png");
    //backgroundImg = loadImage("../images/3264bfd72bb878d3e13c8c2dd586e69.png");

  }
  
  function setup() {

    frameRate(60);
    createCanvas(windowWidth, windowHeight);

    //QuickSettings.useExtStyleSheet(); 
    gui = createGui("DP's Brush");
    gui.addGlobals("Brushes","minImgSize", "maxImgSize", "imgSizeScale", "rotateSpeed", "rotateScale", "ImgLength", "imgScale");
    
    //检测是否有上传背景图片，是则按图片的尺寸创建画布
    // if(backgroundImg != null){
    //   createCanvas(backgroundImg.width, backgroundImg.height);
    // }

    //移动设备设置
    //禁止浏览器的默认触摸事件
    document.getElementById("defaultCanvas0").addEventListener('touchmove', function(event) {

      event.preventDefault();

    }, {passive:false});
    
  }
  
  function draw() {
  
    rotateNoiseOffset += rotateNoiseScale;
    sizeNoiseOffset += sizeNoiseScale;
    maxSizeNoiseOffset += maxSizeNoiseScale;
    
    //设置minImgSize不为0，防止minImgSize为0时出现的大小异常
    if(minImgSize == 0){
      minImgSize = 0.001;
    }

    //background image setting according to the original width and height
    imageMode(CORNER);
    //background(backgroundImg, backgroundImg.width, backgroundImg.height);
    clear();
    background(255,255,255,0);
  
    for (let i = 0; i < paths_x.length; i++) {
      
      let x;
      let y;
      let size = imgSizeArray[i];
      let angle = rotateVal[i];
      let imgIndex = imgIndexArray[i];
      
      //对步长取余进行判断是否需要添加当前点到x，y值
      if(i%ImgLength < 1){

        x = paths_x[i];
        y = paths_y[i];
        size += 5;
        size = constrain(size, minImgSize, map(maxSizeArray[i], 0, 1, imgSizeScale, 1) * maxImgSize);
        angle += (noise(rotateNoiseOffset)) * rotateSpeed;
        draw_image(img[imgIndex], x, y, size, size, angle);

      } 
      else{
        
        //不绘制图片，但依然记录旋转量
        angle += (noise(rotateNoiseOffset)) * rotateSpeed;

      }
      
      rotateVal[i] = angle;
      imgSizeArray[i] = size;

    }
    
    if (mouseIsPressed && isMouseOnUi === false) {

      paths_x.push(mouseX);
      paths_y.push(mouseY);

      //根据噪声生成随机最大图片大小并存储到maxSizeArray数组
      maxSizeArray.push((noise(maxSizeNoiseOffset) - 0.5));
         
      //根据噪声生成图片的随机大小并存储到imgSizeArray数组
      imgSizeArray.push((noise(sizeNoiseOffset) - 0.5));
      //根据噪声生成图片的随机旋转角度并存储到rotateVal数组
      rotateVal.push((noise(rotateNoiseOffset) - 0.5) * map(rotateScale, 0, 100, 0, 10000));

      //获取下拉选中项的选项序号
      let selectedLabel = document.getElementById("mySelect");
      switchImg(selectedLabel.selectedIndex);
      
      //存储设置生成的图片序号
      imgIndexArray.push(imageIndex);

    }
  
    checkMousePos();

  }
  
  //定义函数让图片按照指定的位置、宽高和旋转角度(绕图片中心)生成
  function draw_image(imgSrc, img_x, img_y, img_width, img_height, img_angle) {

    imageMode(CENTER);
    push();
    translate(img_x, img_y);
    rotate(radians(img_angle));
    image(imgSrc, 0, 0, img_width, img_height);
    pop();

  }

  //根据传入的参数更改图片数组序号
  function switchImg(data){

    switch (data) {

      case 0:
        imageIndex = 0;
        break;
      case 1:
        imageIndex = 1;
        break;
      case 2:
        imageIndex = 2;
        break;
      case 3:
        imageIndex = 3;
        break;
      case 4:
        imageIndex = 4;
        break;
      case 5:
        imageIndex = 5;
        break;

    }

  }

  /*-----------------------------------------------------------------------------*/
  //保存到本地文件
  
  //检测按键行为
  function keyPressed() {
    switch(keyCode) {

      //回车保存当前画布
      case 13:
        saveCanvas('saved_image', 'png');
        break;

      //F2隐藏或显示UI界面
      case 113:
        visible = !visible;
        if(visible)
          gui.show();
        else 
          gui.hide();
        break;

    }
    
  }
  
  /*-----------------------------------------------------------------------------*/
  //浏览器控制

  //更新canvas大小
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
  //刷新画布按钮
  window.onload = function(){
    document.body.innerHTML = '<input id = "btn" class = "btn_class" type = "button" />';
    var refreshBtn = document.getElementById("btn");
    refreshBtn.onclick = function(){
      paths_x = [];
      paths_y = [];
      imgSizeArray = [];
      rotateVal = [];
      imgIndexArray = [];
      maxSizeArray = [];
      clear();
    }
  }
  


  //检查鼠标是否移动到UI界面，是则指定isMouseOnUi为true，鼠标移出则指定为false
  let isMouseOnUi = false;
  
  function checkMousePos() {
    var myBtn = document.getElementById("btn");
    var mainPanel=document.getElementById("mainPanel");
    var myCanvas = document.getElementById("defaultCanvas0");
    //添加touchstart和touchend事件监听器
    mainPanel.addEventListener("mouseover", handleMouseOver, false);
    mainPanel.addEventListener("mouseout", handleMouseOut, false);
    mainPanel.addEventListener("touchstart", handleTouchStart, false);
    mainPanel.addEventListener("touchend", handleTouchEnd, false);

    myBtn.addEventListener("mouseover", handleMouseOver, false);
    myBtn.addEventListener("mouseout", handleMouseOut, false);
    myBtn.addEventListener("touchstart", handleTouchStart, false);
    myBtn.addEventListener("touchend", handleTouchEnd, false);

    myCanvas.addEventListener("touchstart", resetTouchPos, false);
    
  }

  function handleMouseOver(evt) {

    isMouseOnUi = true;

  }
  
  function handleMouseOut(evt) {

    isMouseOnUi = false;

  }

  function handleTouchStart(evt) {

    isMouseOnUi = true;
    return false;

  }
  
  function handleTouchEnd(evt) {
    
    isMouseOnUi = false;   
    return false;

  }
  
  //触摸画板后将isMouseOnUi重新设置为false
  function resetTouchPos(evt){
    isMouseOnUi = false;   
    return false;
  }

  
