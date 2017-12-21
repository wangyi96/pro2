$(function () {
  canvasMove()

  function canvasMove() {
    var oc = document.querySelector('canvas');
    if (oc.getContext) {
      var ctx = oc.getContext('2d');
      oc.width = document.documentElement.clientWidth;
      oc.height = document.documentElement.clientHeight;
      var img = new Image();
      img.src = "img/a.png";
      img.onload = function () {
        draw(this);
      }
    }

    function draw(img) {
      ctx.drawImage(img, 0, 0, oc.width, oc.height);
    }

    oc.addEventListener('touchstart', function (ev) {
      ev = ev || event;
      var t = ev.changedTouches[0];
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineWidth = 40;
      ctx.moveTo(t.clientX - this.offsetLeft, t.clientY - this.offsetTop);
      ctx.lineTo(t.clientX - this.offsetLeft + 1, t.clientY - this.offsetTop + 1);
      ctx.stroke();
    })

    oc.addEventListener('touchmove', function (ev) {
      ev = ev || event;
      var t = ev.changedTouches[0];
      ctx.lineTo(t.clientX - this.offsetLeft, t.clientY - this.offsetTop);
      ctx.stroke();
    })

    oc.addEventListener('touchend', function () {
      var imgData = ctx.getImageData(0, 0, oc.width, oc.height);
      console.log(imgData)
      var all = imgData.width * imgData.height;
      var flag = 0;
      for (var i = 0; i < all; i++) {
        if (imgData.data[4 * i + 3] == 0) {
          flag++;
        }
      }
      console.log(flag)
      if (flag > all / 2) {
        console.log(1)
        this.style.opacity = 0;
      }
    })

    oc.addEventListener('transitionend', function () {
      oc.remove();
      $('.w_0_0').find('img').removeClass('hide')
      TouchMove();
    })

  }

  function TouchMove() {
    var direction = {
      up:1,
      down:2,
      left:3,
      right:4
    };

    var last = {row:-1,col:-1};
    var now = {row:1,col:0};

    //向上滑动
    $('.w').swipeUp(function () {
      last.col = now.col;
      last.row = now.row;
      console.log(last.col,last.row);
      if(last.col < 5 && last.row == 1){
        now.col = last.col+1;
        console.log(last.col,last.row);
        move(direction.up)
        // console.log(last,now);
      }
    })

    //向下滑动
    $('.w').swipeDown(function () {
      last.col = now.col;
      last.row = now.row;
      console.log(last.col,last.row);
      if(last.col > 1 && last.col <=5 && last.row == 1){
        now.col = last.col - 1;
        move(direction.down)
        // console.log(last,now);
      }
    })

    //向左滑动
    $('.w').swipeLeft(function () {
      last.col = now.col;
      last.row = now.row;
      if(last.col > 1 && last.col <5 && last.row == 1){
        now.col = last.col;
        now.row = last.row + 1;
        move(direction.left)
        // console.log(now.row,last.row);
      }
    })

    //向右滑动
    $('.w').swipeRight(function () {
      last.col = now.col;
      last.row = now.row;
      if(last.col > 1 && last.col <5 && last.row == 2){
        now.col = last.col;
        now.row = last.row - 1;
        move(direction.right)
        // console.log(now.row,last.row);
      }
    })

    function move(dir) {

      var lastClass = ".w_" + last.row + "_" + last.col + "";
      var nowClass = ".w_" + now.row + "_" + now.col + "";

      // console.log(lastClass,nowClass,dir);
      var outClass = '';
      var inClass = '';

      switch(dir){
        case direction.up:
          outClass = 'w_ToTop';
          inClass = 'w_FromBottom';
          break;
        case direction.down:
          outClass = 'w_ToBottom';
          inClass = 'w_FromTop';
          break;
        case direction.left:
          outClass = 'w_ToLeft';
          inClass = 'w_FromRight';
          break;
        case direction.right:
          outClass = 'w_ToRight';
          inClass = 'w_FromLeft';
      }

      // console.log(outClass,inClass);
      $(lastClass).addClass(outClass);
      $(nowClass).removeClass('hide');
      $(nowClass).addClass(inClass);

      setTimeout(function () {
      	$('.w_0_0').remove()
        $(lastClass).addClass('hide');
        $(lastClass).removeClass(outClass);
        $(lastClass).find('img').addClass('hide');

        $(nowClass).find('img').removeClass('hide');
        $(nowClass).removeClass(inClass);
      },600)
    }
  }

})