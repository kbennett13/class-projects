//////////////////////////////////////////
//
// Constants
//
//////////////////////////////////////////

// Part numbers
var numNodes = 10;
var torsoId = 0;
var headId  = 1;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

// Part measurements
var torsoHeight = 4.0;
var torsoWidth = 2.0;
var upperArmHeight = 2.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 2.0;
var headHeight = 1.5;
var headWidth = 1.0;

var vertices = [
                vec4( -0.5, -0.5,  0.5, 1.0 ),
                vec4( -0.5,  0.5,  0.5, 1.0 ),
                vec4( 0.5,  0.5,  0.5, 1.0 ),
                vec4( 0.5, -0.5,  0.5, 1.0 ),
                vec4( -0.5, -0.5, -0.5, 1.0 ),
                vec4( -0.5,  0.5, -0.5, 1.0 ),
                vec4( 0.5,  0.5, -0.5, 1.0 ),
                vec4( 0.5, -0.5, -0.5, 1.0 ),
                ];

var vertexColors = [
                    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
                    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
                    vec4( 1.0, 0.5, 0.0, 1.0 ),  // orange
                    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
                    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
                    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
                    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
                    vec4( 0.5, 0.0, 1.0, 1.0 ),  // purple
                    vec4( 0.5, 1.0, 0.0, 1.0 ),  // green-yellow
                    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
                    vec4( 1.0, 1.0, 1.0, 1.0 ),   // white
                    ];

var lightPosition = vec4(0.0, -2.0, 4.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 10.0;

var numVertices = 36;

//////////////////////////////////////////
//
// Variables
//
//////////////////////////////////////////

// User variables
var playing_animation = false; // playing routine?
var fps = 60;
var count = 0;
var playing_music = false; // playing music
var picking = false; // picking a body part to move?

// Rotation variables
var mouseDown = false;
var lastX;
var lastY;

// WebGL variables
var main;
var gl;
var program;
var framebuffer;
var left = -7;
var right = 7;
var ytop = -7;
var bottom = 7;
var near = -100;
var far = 100;
var modelViewMatrix, projectionMatrix, instanceMatrix;
var modelViewMatrixLoc;

var pointsArray = [];
var normalsArray = [];
var color = new Uint8Array(4);

// Figure variables
var stack = [];
var figure = [];
var current_object;
var theta = [0, 0, 180, 0, 180, 0, 180, 0, 180, 0];

//////////////////////////////////////////
//
// Cube Functions
//
//////////////////////////////////////////


function quad(a, b, c, d) {
  
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  normal = normalize(normal);
  
  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[b]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[a]);
  normalsArray.push(normal);
  pointsArray.push(vertices[c]);
  normalsArray.push(normal);
  pointsArray.push(vertices[d]);
  normalsArray.push(normal);
}


function createCube()
{
  quad( 1, 0, 3, 2 );
  quad( 2, 3, 7, 6 );
  quad( 3, 0, 4, 7 );
  quad( 6, 5, 1, 2 );
  quad( 4, 5, 6, 7 );
  quad( 5, 4, 0, 1 );
}

//////////////////////////////////////////
//
// Figure Functions
//
//////////////////////////////////////////

function scale4(a, b, c)
 {
 var result = mat4();
 result[0][0] = a;
 result[1][1] = b;
 result[2][2] = c;
 return result;
 }
 
 function createNode(transform, render, sibling, child)
 {
 var node = {
 transform: transform,
 render: render,
 sibling: sibling,
 child: child,
 }
 return node;
 }
 
function initNodes(Id) {
 
 var m;
 
 switch(Id) {
 
 case torsoId:
 
 m = translate(0.0, 0.0, 0.0);
 m = mult(m,rotate(theta[torsoId], 0, 1, 0 ));
 figure[torsoId] = createNode( m, torso, null, headId);
 break;
 
 case headId:
 
 m = translate(0.0, torsoHeight+0.6*headHeight, 0.0);
 m = mult(m, rotate(theta[headId], 1, 0, 0))
 m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
 figure[headId] = createNode( m, head, leftUpperArmId, null);
 break;
 
 
 case leftUpperArmId:
 
 m = translate(-0.7*torsoWidth, torsoHeight, 0.0);
 m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
 figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
 break;
 
 case rightUpperArmId:
 
 m = translate(0.7*torsoWidth, torsoHeight, 0.0);
 m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
 figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
 break;
 
 case leftUpperLegId:
 
 m = translate(-0.4*torsoWidth, -0.1*upperLegHeight, 0.0);
 m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
 figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
 break;
 
 case rightUpperLegId:
 
 m = translate(0.4*torsoWidth, -0.1*upperLegHeight, 0.0);
 m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
 figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
 break;
 
 case leftLowerArmId:
 
 m = translate(0.0, 1.1*upperArmHeight, 0.0);
 m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
 figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
 break;
 
 case rightLowerArmId:
 
 m = translate(0.0, 1.1*upperArmHeight, 0.0);
 m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
 figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
 break;
 
 case leftLowerLegId:
 
 m = translate(0.0, 1.1*upperLegHeight, 0.0);
 m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
 figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
 break;
 
 case rightLowerLegId:
 
 m = translate(0.0, 1.1*upperLegHeight, 0.0);
 m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
 figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
 break;
 
 }
 
}
 
 function traverse(Id, unique) {
 
 if(Id == null) return;
 stack.push(modelViewMatrix);
 modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
 figure[Id].render(unique);
 if(figure[Id].child != null) traverse(figure[Id].child, unique);
 modelViewMatrix = stack.pop();
 if(figure[Id].sibling != null) traverse(figure[Id].sibling, unique);
 }
 
function torso(unique) {
 
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
 
  if (unique)
  {
    gl.uniform1i(gl.getUniformLocation(program, "i"), 1);
  }

  gl.drawArrays( gl.TRIANGLES, 0, numVertices );
  
}
 
 function head(unique) {
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
 instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 2);
   }
  gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function leftUpperArm(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 3);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function leftLowerArm(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 4);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function rightUpperArm(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 5);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function rightLowerArm(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 6);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function leftUpperLeg(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 7);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function leftLowerLeg(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 8);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function rightUpperLeg(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 9);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }
 
 function rightLowerLeg(unique) {
 
 instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
 instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
 gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
   if (unique)
   {
     gl.uniform1i(gl.getUniformLocation(program, "i"), 10);
   }
   gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 }


//////////////////////////////////////////
//
// WebGL Functions
//
//////////////////////////////////////////

window.onload = function init() {
  main = document.getElementById( "gl-canvas" );
  main.onmousedown = handleMouseDown;
  document.onkeydown = keyboard;
  document.onmousemove = handleMouseMove;
  document.onmouseup = handleMouseUp;
  
  var ctx = main.getContext("experimental-webgl", {preserveDrawingBuffer: true});
  
  gl = WebGLUtils.setupWebGL( main );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  
  gl.viewport( 0, 0, main.width, main.height );
  gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
  
  gl.enable(gl.CULL_FACE);
  
  var texture = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.generateMipmap(gl.TEXTURE_2D);
  
  // Allocate a frame buffer object
  
  framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);
  
  
  // Attach color buffer
  
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  
  // check for completeness
  
  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if(status != gl.FRAMEBUFFER_COMPLETE) alert('Frame Buffer Not Complete');
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  
  createCube();
  
  for (var i = 0; i < numNodes; i++)
  {
    figure[i] = createNode(null, null, null, null);
  }
  
  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
  
  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );
  
  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  
  viewerPos = vec3(0.0, 0.0, -20.0 );
  
  modelViewMatrix = mat4();
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  
  instanceMatrix = mat4();
  
  projectionMatrix = ortho(left, right, ytop, bottom, near, far);
  
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);
  
  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
                flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
                flatten(diffuseProduct) );
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
                flatten(specularProduct) );
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
                flatten(lightPosition) );
  
  gl.uniform1f(gl.getUniformLocation(program,
                                     "shininess"),materialShininess);
  
  gl.uniformMatrix4fv( gl.getUniformLocation(program,
                                             "modelViewMatrix"), false, flatten(modelViewMatrix) );
  
  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
                      false, flatten(projectionMatrix));
  
  document.getElementById("speed").onchange = function(event) {
    fps =  event.target.value;
  }
  
  for (i = 0; i < numNodes; i++)
  {
    initNodes(i);
  }
  
  render();
}

var render = function(){
  gl.clear( gl.COLOR_BUFFER_BIT );
  
  gl.uniform1i(gl.getUniformLocation(program, "i"), 0);
  
  traverse(torsoId, false);
  
  if (playing_animation)
  {
    if (count == document.getElementById("speed").value)
    {
      results = nextFrame(figure, playing_animation);
      figure = results[0];
      playing_animation = results[1];
      count = 0;
    }
    count++;
  }
  
  requestAnimFrame(render);
}

//////////////////////////////////////////
//
// Event Handlers
//
//////////////////////////////////////////

// handle keyboard input
function keyboard(e) {
  var key = e.keyCode ? e.keyCode : e.charCode;
  
  switch(key) {
    case 8: // backspace
      if (!playing_animation)
      {
        figure = deleteFrame(figure);
      }
      break;
    case 13: // enter
      if (!playing_animation)
      {
        addFrame(figure);
      }
      break;
    case 76: // l
      if (!playing_animation)
      {
        figure = lastFrame(figure);
      }
      break;
    case 78: // n
      if (!playing_animation)
      {
        results = nextFrame(figure, playing_animation);
        figure = results[0];
      }
      break;
    case 80: // p
      if (!playing_animation)
      {
        picking = !picking;
        document.getElementById("picking").innerHTML = (picking ? "&nbsp;&nbsp;&nbsp;&nbsp;Picking: On" : "&nbsp;&nbsp;&nbsp;&nbsp;Picking: Off");
      }
      break;
  }
}

function handleMouseDown(event) {
  if(picking)
  {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.clear( gl.COLOR_BUFFER_BIT);

    traverse(torsoId, true);
    
    var x = event.clientX - 13;
    var y = main.height + 13 - event.clientY;
    
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
    
    if(color[0]==255)
    {
      if(color[1]==255)
      {
        if (color[2]==255) current_object = rightLowerLegId;
        else current_object = leftUpperArmId;
      }
      else if(color[1]==127) current_object = headId;
      else if(color[2]==255) current_object = rightUpperLegId;
      else current_object = torsoId;
    }
    else if (color[0]==127)
    {
      if(color[1]==255) current_object = leftLowerLegId;
      else if (color[1]==127) current_object = null;
      else current_object = leftUpperLegId;
    }
    else if(color[1]==255)
    {
      if(color[2]==255) current_object = rightUpperArmId;
      else current_object = leftLowerArmId;
    }
    else if(color[2]==255) current_object = rightLowerArmId;
    else current_object = null;
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    gl.uniform1i(gl.getUniformLocation(program, "i"), 0);
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    traverse(torsoId, false);
  }
  else
  {
    mouseDown = true;
    lastX = event.clientX;
    lastY = event.clientY;
  }
}

function handleMouseUp(event) {
  mouseDown = false;
}

function handleMouseMove(event) {
  if (!mouseDown) {
    return;
  }
  
  // if part is picked
  if (current_object)
  {
    // determine change in mouse position
    var newX = event.clientX;
    var newY = event.clientY;
    var xDiff = newX - lastX;
    var yDiff = newY - lastY;
    
    // update figure transform
    var rotation = mult(mat4(), rotate(xDiff, [0, 1, 0]));
    rotation = mult(rotation, rotate(yDiff, [1, 0, 0]));
    figure[current_object].transform = mult(figure[current_object].transform, rotation);
    
    // update mouse position
    lastX = newX
    lastY = newY;
  }
}

function toggle()
{
  toggleAnimation();
  toggleMusic();
}

function toggleAnimation()
{
  playing_animation = !playing_animation;
  count = 0;
}

function toggleMusic()
{
  if (music_name)
  {
    audio = document.getElementById("audio");
    playing_music = !playing_music;
    if (playing_music)
    {
      audio.play();
    }
    else
    {
      audio.pause();
    }
  }
}

function playBoth()
{
  playing_animation = true;
  if (music_name)
  {
    playing_music = true;
  }
  count = 0;
  audio.play();
}