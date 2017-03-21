//window.addEventListener('resize', resize);

document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
  // e.stopPropagation();
});

function loadApp() {

  console.log('Load App');

  var size = getSize();
  //console.log(size);

  // Create the flipbook

  $('.flipbook').turn({

      // Width
     width: size.width,
    
      
      // Height
     height: size.height,

      // Elevation
      elevation: 50,
      
      // Enable gradients
      gradients: true,
      
      // Auto center this flipbook
      autoCenter: true,
      

  });
 $('.flipbook').turn('display', 'single');
  
  
}

function getSize() {
  console.log('get size');
 // var width = document.body.clientWidth;
 // var height = document.body.clientHeight;
  var width = 640;
  var height = 832;
  return {
    width: width,
    height: height
  }
}

function resize() {
  console.log('resize event triggered');

  var size = getSize();
  console.log(size);

  if (size.width > size.height) { // landscape
    $('.flipbook').turn('display', 'double');
  }
  else {
    $('.flipbook').turn('display', 'single');
  }

  $('.flipbook').turn('size', size.width, size.height);
}

// Load App
loadApp();