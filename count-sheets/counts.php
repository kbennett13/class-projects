<html>
  <script id="vertex-shader" type="x-shader/x-vertex">
    
    attribute  vec4 vPosition;
    attribute  vec3 vNormal;
    varying vec4 fColor;
    
    uniform vec4 ambientProduct, diffuseProduct, specularProduct;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec4 lightPosition;
    uniform float shininess;
    
    void main()
    {
      
      
      vec3 pos = -(modelViewMatrix * vPosition).xyz;
      vec3 light = lightPosition.xyz;
      vec3 L = normalize( light - pos );
      
      vec3 E = normalize( -pos );
      vec3 H = normalize( L + E );
      
      vec4 NN = vec4(vNormal,0);
      
      // Transform vertex normal into eye coordinates
      
      vec3 N = normalize( (modelViewMatrix*NN).xyz);
      
      // Compute terms in the illumination equation
      vec4 ambient = ambientProduct;
      
      float Kd = max( dot(L, N), 0.0 );
      vec4  diffuse = (Kd) * diffuseProduct;
      
      float Ks = pow( max(dot(N, H), 0.0), shininess );
      vec4  specular = (Ks) * specularProduct;
      
      if( (dot(L, N) < 0.0) ) {
        specular = vec4(0.0, 0.0, 0.0, 1.0);
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vPosition;
      fColor = ambient + diffuse + specular;
      
      fColor.a = 1.0;
    }
    </script>
  
  <script id="fragment-shader" type="x-shader/x-fragment">
    
    precision mediump float;
    
    uniform int i;
    
    varying vec4 fColor;
    
    void
    main()
    {
      vec4 c[11];
      c[0] = fColor;
      c[1] = vec4( 1.0, 0.0, 0.0, 1.0 );  // red
      c[2] = vec4( 1.0, 0.5, 0.0, 1.0 );  // orange
      c[3] = vec4( 1.0, 1.0, 0.0, 1.0 );  // yellow
      c[4] = vec4( 0.0, 1.0, 0.0, 1.0 );  // green
      c[5] = vec4( 0.0, 1.0, 1.0, 1.0 );  // cyan
      c[6] = vec4( 0.0, 0.0, 1.0, 1.0 );  // blue
      c[7] = vec4( 0.5, 0.0, 1.0, 1.0 );  // purple
      c[8] = vec4( 0.5, 1.0, 0.0, 1.0 );  // green-yellow
      c[9] = vec4( 1.0, 0.0, 1.0, 1.0 );  // magenta
      c[10] = vec4( 1.0, 1.0, 1.0, 1.0 );   // white

      
      
      if(i==0) gl_FragColor = c[0];
      else if(i==1) gl_FragColor = c[1];
      else if(i==2) gl_FragColor = c[2];
      else if(i==3) gl_FragColor = c[3];
      else if(i==4) gl_FragColor = c[4];
      else if(i==5) gl_FragColor = c[5];
      else if(i==6) gl_FragColor = c[6];
      else if(i==7) gl_FragColor = c[7];
      else if(i==8) gl_FragColor = c[8];
      else if(i==9) gl_FragColor = c[9];
      else if(i==10) gl_FragColor = c[10];
    }
    </script>
  <script>
    var project_name = "<?php echo $_POST["project"]; ?>";
    var music_name = "<?php echo $_POST["music"]; ?>";
  </script>

  <script type="text/javascript" src="Common/webgl-utils.js"></script>
  <script type="text/javascript" src="Common/initShaders.js"></script>
  <script type="text/javascript" src="Common/MV.js"></script>
  <script type="text/javascript" src="xml_handlers.js"></script>
  <script type="text/javascript" src="figure.js"></script>

  <body onload="importUserFiles()">
    <div style="float:left;">
      <canvas id="gl-canvas" width="525" height="525" style="border-style:solid;border-width:5px;">
        Oops ... your browser doesn't support the HTML5 canvas element
      </canvas>
      <br>
    </div>
    <div style="float:left;text-align:left;margin:10px;">
      <button id="save" onclick="exportXML()">Export Project</button>
      <br/>
      <br/>
      <br/>
      <div>
        Help<br>
        ---------------<br>
        P: Toggle picking.<br>
        <p id="picking">&nbsp;&nbsp;&nbsp;&nbsp;Picking: Off</p>
        Enter: Add frame to animation.<br>
        Backspace: Delete current frame from animation.<br>
        <p id="current_cycle">&nbsp;&nbsp;&nbsp;&nbsp;
        Current cycle: <select id="cycle" onchange="getFrame(figure)">
          <option>1</option>
        </select></p>
        <p id="current_count">&nbsp;&nbsp;&nbsp;&nbsp;
        Current count: <select id="count" onchange="getFrame(figure)">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select></p>
        Toggle playing of animation/music.
        <button id="playBoth" onclick="toggle()">Toggle Both</button>
        <button id="reset" onclick="reset(figure, playing_animation)">Reset</button>
        <br>
        <p>
        <button id="animation" onclick="toggleAnimation()">Toggle Animation</button></p><br>
        Animation Speed
        <br>Faster <input id="speed" type="range"
        min="1" max="60" step="1" value="30"
        /> Slower
        <br>
        <br/>
        <br/>
        L/N: See the previous/next frame.
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
    <div style="float:left;text-align:left;margin:10px;">
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div id="music_section">
      </div>
    </div>
  </body>
</html>