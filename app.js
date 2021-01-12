var vertexShaderText = /* glsl */ `
precision mediump float; 

// attributes because they change through the vertices
attribute vec3 vertPosition; 
attribute vec3 vertColor; 
attribute vec3 vertNormal; 

varying vec3 fragColor; 
varying vec3 fragNormal; 
varying vec3 fragPos; 


uniform mat4 mWorld; //model View
uniform mat4 mView; // our camera 
uniform mat4 mProj; 

void main () {
    fragColor = vertColor;
    fragNormal = vertNormal; 
    fragPos = vec3(mWorld * vec4(vertPosition, 1.0));  
    gl_Position = mProj * mView * mWorld * vec4(vertPosition , 1.0); 
}
`;

var fragmentShaderText = /* glsl*/ `
    precision mediump float;
	
    varying vec3 fragNormal; 
	  varying vec3 fragColor;
    varying vec3 fragPos; 
    varying mat4 world; 

    void main() {

        vec3 ambientLight = vec3(0, 0, 0);
        float specularStrength = 0.5; 
        vec3 viewPos = vec3(0, 0, -3); 
        vec3 viewDirection = normalize(viewPos - fragPos);
        vec3 sunLightDirection = normalize(vec3(4.0,6.0, 2.0)); 
        vec3 reflectDir = reflect(-sunLightDirection, fragNormal); 

        float spec = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0); 
        vec3 specular = specularStrength * spec * ambientLight; 
        
        vec3 sunLight = vec3(1, 1, 0); 
        // light direction
      
        // ambient light + diffuse 
        vec3 lightIntenisity = ambientLight + max(sunLight * dot(fragNormal, sunLightDirection), 0.0) + specular; 

          //diffuse
        gl_FragColor = vec4(fragColor * lightIntenisity, 1.0); 
		
    }
`;

var InitDemo = function () {
  console.log("file loaded");

  var canvas = document.getElementById("game-surface");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support WebGL");
  }

  gl.clearColor(1.0, 0.0, 0.0, 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //
  // Create shaders
  //
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragment shader!",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getProgramInfoLog(program));
    return;
  }


  // handle mouse moves 
    onmousemove = function(e) {
      mouseCallback(e.clientX, e.clientY); 
    }


  //
  // Create buffer
  //
  const boxVertices = [
    // Front face       RGB
    -1.0, -1.0,  1.0,  1.0,  1.0,  1.0, 
    1.0, -1.0,  1.0, 1.0,  1.0,  1.0,
    1.0,  1.0,  1.0, 1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0, 1.0,  1.0,  1.0,

  // Back face
    -1.0, -1.0, -1.0, 1.0,  0.0,  0.0,
    -1.0,  1.0, -1.0, 1.0,  0.0,  0.0,
    1.0,  1.0, -1.0, 1.0,  0.0,  0.0,
    1.0, -1.0, -1.0, 1.0, 0.0, 0.0,

  // Top face
    -1.0,  1.0, -1.0, 0.0,  1.0,  0.0,
    -1.0,  1.0,  1.0, 0.0,  1.0,  0.0,
    1.0,  1.0,  1.0, 0.0,  1.0,  0.0,
    1.0,  1.0, -1.0, 0.0,  1.0,  0.0,

  // Bottom face
    -1.0, -1.0, -1.0, 0.0,  0.0,  1.0,
    1.0, -1.0, -1.0, 0.0,  0.0,  1.0,
    1.0, -1.0,  1.0, 0.0,  0.0,  1.0,
    -1.0, -1.0,  1.0, 0.0,  0.0,  1.0,

  // Right face
    1.0, -1.0, -1.0, 1.0,  1.0,  0.0,
    1.0,  1.0, -1.0, 1.0,  1.0,  0.0,
    1.0,  1.0,  1.0, 1.0,  1.0,  0.0,
    1.0, -1.0,  1.0, 1.0,  1.0,  0.0,

  // Left face
    -1.0, -1.0, -1.0, 1.0,  0.0,  1.0,
    -1.0, -1.0,  1.0, 1.0,  0.0,  1.0,
    -1.0,  1.0,  1.0, 1.0,  0.0,  1.0,
    -1.0,  1.0, -1.0, 1.0,  0.0,  1.0,
  ]

  const boxIndices = [
    //Front 
    0, 1, 2,
    0, 2, 3, 
    //Back 
    4, 5, 6, 
    4, 6, 7,
    //Top 
    8, 9, 10,
    8, 10, 11,
    //Bottom 
    12, 13, 14, 
    12, 14, 15,
    //Right
    16, 17, 18,
    16, 18, 19,
    //Left
    20, 21, 22,
    20, 22, 23
  ]

  const boxNormals = [
    // Front
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,

   // Back
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,

   // Top
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,

   // Bottom
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,

   // Right
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,

   // Left
   -1.0,  0.0,  0.0,
   -1.0,  0.0,  0.0,
   -1.0,  0.0,  0.0,
   -1.0,  0.0,  0.0
  ]



  const pyramidVertices = [
    // X, Y, Z           R, G, B
	// Bottom face
	0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
	0.0, 0.0, -1.0,	1.0, 0.0, 0.0, 
	1.0, 0.0, -1.0,	1.0, 0.0, 0.0,
	0.0, 0.0, 0.0,	1.0, 0.0, 0.0,
	1.0, 0.0, -1.0,	1.0, 0.0,0.0,
	1.0, 0.0, 0.0, 	1.0, 0.0, 0.0,

	// Front face 
	0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
	0.5, 1.0, -0.5, 1.0, 0.0, 0.0,

	// Right face
	1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
	1.0, 0.0, -1.0, 1.0, 0.0, 0.0,
	0.5, 1.0, -0.5, 1.0, 0.0, 0.0,


	// Back face
	1.0, 0.0, -1.0, 1.0, 0.0, 0.0,
	0.0, 0.0, -1.0, 1.0, 0.0, 0.0,
	0.5, 1.0, -0.5, 1.0, 0.0, 0.0,

	// Left face
	0.0, 0.0, -1.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 0.0, 	1.0, 0.0, 0.0,
	0.5, 1.0, -0.5, 1.0, 0.0, 0.0,
  ];

  var pyramidIndices = [
	0, 1, 2,
	3, 4, 5,
	6, 7, 8,
	9, 10, 11, 
	12, 13, 14,
	15, 16, 17, 
  ];

  var pyramidNormals = [
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,
    0.0, 0.0, 0.0,

    0.0, 0.5, 1.0,
    0.0, 0.5, 1.0,
    0.0, 0.5, 1.0, 
    
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    0.0, 0.5, 1.0, 
    0.0, 0.5, 1.0, 
    0.0, 0.5, 1.0, 

    1.0, -0.5, 0.0,
    1.0, -0.5, 0.0,
    1.0, -0.5, 0.0,	  
  ]

  var pyramidsPostions = [
    0.0, 0.0, 0.0,
    1.0, 1.0, -1.0,
    -1.5, -2.2, -2.5,
    -3.8, -2.0, -12.3
  ]

  var pyramidNormalBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidNormalBufferObject); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidNormals), gl.STATIC_DRAW); 
  var normalAttribLocation = gl.getAttribLocation(program, "vertNormal"); 
  gl.vertexAttribPointer(
	  normalAttribLocation, 
	  3, 
	  gl.FLOAT, 
	  gl.TRUE, 
	  3 * Float32Array.BYTES_PER_ELEMENT, 
	  0 * Float32Array.BYTES_PER_ELEMENT
  )
  gl.enableVertexAttribArray(normalAttribLocation); 

  //tell webGl which program we'rre using
  gl.useProgram(program);

  var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
  var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

  var worldMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  glMatrix.mat4.identity(worldMatrix);
  
  //to create a moving camera ( Euler system )
  var firstMouse = true; 
  var yaw = 0; 
  var pitch = 0; 
  var lastX = 400; 
  var lastY = 300; 

  glMatrix.mat4.perspective(
    projMatrix,
    glMatrix.glMatrix.toRadian(45),
    canvas.width / canvas.height,
    0.001,
    1000.0
  );

  //gl.False so  it's not transposed
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  var translationMatrix = new Float32Array(16);
  var translationMatrix2 = new Float32Array(16);
  var translationMatrix3 = new Float32Array(16); 

  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);

  var angle = 0;
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);

 // our camera
  var viewMatrix = new Float32Array(16);
    // lookAt (our view Matrix, position of the viewer, Point the viwer is looking at, vec3 pointing up)
  glMatrix.mat4.lookAt(viewMatrix, [0, 0, -30], [0, 0, 0], [0, 2, 0]);

  //
  // Main render loop
  //
  var loop = function (vMatrix) { 
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");

    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, vMatrix);

    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, 0, [1, 0, 0]);
    glMatrix.mat4.translate(translationMatrix, identityMatrix, [10, 3, -2]); 
    glMatrix.mat4.mul(worldMatrix, yRotationMatrix, translationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); 

    gl.clearColor(0.0, 1.0, 0.0, 0.5);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    // gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);    
    // gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);

    // glMatrix.mat4.translate(translationMatrix2, identityMatrix, [-3, 2, 1]); 
    // glMatrix.mat4.mul(worldMatrix, yRotationMatrix, translationMatrix2); 
    // gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); 
    // gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0); 

    // glMatrix.mat4.translate(translationMatrix3, identityMatrix, [-9, 4, 1]); 
    // glMatrix.mat4.mul(worldMatrix, yRotationMatrix, translationMatrix3); 
    // gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); 
    // gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);
    for (let i = 0; i < 10; i++) {
      drawShape(gl, program, pyramidVertices, pyramidIndices); 
      glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
      glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, 0, [1, 0, 0]);
      glMatrix.mat4.translate(translationMatrix, identityMatrix, [10, i, i]); 
      glMatrix.mat4.mul(worldMatrix, yRotationMatrix, translationMatrix);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); 
    }

    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, 0, [1, 0, 0]);
    glMatrix.mat4.translate(translationMatrix, identityMatrix, [3, 2, -2]); 
    glMatrix.mat4.mul(worldMatrix, yRotationMatrix, translationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); 
   
    drawShape(gl , program, boxVertices, boxIndices); 
  };
  loop(viewMatrix)



  // Still some work to do 

  function mouseCallback (xPos, yPos) {
    if (firstMouse) {
      lastX = xPos; 
      lastY = yPos; 
      firstMouse = false; 
    }

    //float 
    var xOffset;
    xOffset = xPos - lastX;  
    var yOffset; 
    yOffset = lastY - yPos;
    
    lastX = xPos; 
    lastY = yPos; 

    var sensitivity;
    sensitivity = 0.1; 
    
    xOffset = xOffset * sensitivity; 
    yOffset = yOffset * sensitivity; 

    yaw = xOffset + yaw; 
    pitch = yOffset + pitch; 

    

    var newViewMatrix = new Float32Array(16);


    // lookAt (our view Matrix, position of the viewer, Point the viwer is looking at, vec3 pointing up)
    glMatrix.mat4.lookAt(newViewMatrix, [0, 0, -30], [Math.cos(glMatrix.glMatrix.toRadian(yaw)) * Math.cos(glMatrix.glMatrix.toRadian(pitch))  
      
                                                  , Math.sin(glMatrix.glMatrix.toRadian(pitch))
                                                  , Math.sin(glMatrix.glMatrix.toRadian(yaw)) * Math.cos(glMatrix.glMatrix.toRadian(pitch))
    ]
    , [0, 2, 0]);


    loop(newViewMatrix)
  }
};
