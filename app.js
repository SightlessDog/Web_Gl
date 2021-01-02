var vertexShaderText = /* glsl */ `
precision mediump float; 

// attributes because they change through the vertices
attribute vec3 vertPosition; 
attribute vec3 vertColor; 
attribute vec3 vertNormal; 
varying vec3 fragColor; 

uniform mat4 mWorld; //model View
uniform mat4 mView; 
uniform mat4 mProj; 

void main () {
    fragColor = vertColor; 
    gl_Position = mProj * mView *  mWorld *  vec4(vertPosition , 1.0); 
}
`;
var fragmentShaderText = /* glsl*/ `
    precision mediump float;
	
    varying vec3 fragColor; 

    void main() {

		gl_FragColor = vec4(fragColor, 1.0); 
		
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

  gl.clearColor(1.0, 0.0, 0.0, 1.0);
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

  //
  // Create buffer
  //
  var pyramidVertices = [
    // X, Y, Z           R, G, B
	// Bottom face
	0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 
	0.0, 0.0, -1.0,	0.5, 0.5, 0.5, 
	1.0, 0.0, -1.0,	0.5, 0.5, 0.5,
	0.0, 0.0, 0.0,	0.5, 0.5, 0.5,
	1.0, 0.0, -1.0,	0.5, 0.5, 0.5,
	1.0, 0.0, 0.0, 	0.5, 0.5, 0.5,

	// Front face 
	0.0, 0.0, 0.0, 0.75, 0.25, 0.25,
	1.0, 0.0, 0.0, 0.75, 0.25, 0.25, 
	0.5, 1.0, -0.5, 0.75, 0.25, 0.25,

	// Right face
	1.0, 0.0, 0.0, 1.0, 0.0, 0.15,
	1.0, 0.0, -1.0, 1.0, 0.0, 0.15,
	0.5, 1.0, -0.5, 1.0, 0.0, 0.15,


	// Back face
	1.0, 0.0, -1.0, 0.5, 0.5, 1.0,
	0.0, 0.0, -1.0, 0.5, 0.5, 1.0,
	0.5, 1.0, -0.5, 0.5, 0.5, 1.0,

	// Left face
	0.0, 0.0, -1.0, 0.25, 0.25, 0.75,
	0.0, 0.0, 0.0, 	0.25, 0.25, 0.75,
	0.5, 1.0, -0.5, 0.25, 0.25, 0.75,
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
	  0, 0, 0,
	  0, 0, 0, 
	  0, 1, 0,
	  0, 1, 0, 
	  1, -0.5, 0,	  
  ]

  var pyramidVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidVertices), gl.STATIC_DRAW);

  var pyramidIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBufferObject);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(pyramidIndices),
    gl.STATIC_DRAW
  );

  var pyramidNormalBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidNormalBufferObject); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidNormals), gl.STATIC_DRAW); 


  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidNormals); 
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
  var matViewUniformLocation = gl.getUniformLocation(program, "mView");
  var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0, 0, -3], [0, 0, 0], [0, 2, 0]);
  glMatrix.mat4.perspective(
    projMatrix,
    glMatrix.glMatrix.toRadian(120),
    canvas.width / canvas.height,
    0.001,
    1000.0
  );

  //gl.False so  it's not transposed
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  var translationMatrix = new Float32Array(16);
  var rotationMatrix = new Float32Array(16);

  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);

  //
  // Main render loop
  //
  var angle = 0;
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);
  var loop = function () {
    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
    glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(1.0, 0.0, 0.0, 0.5);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    // gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 0);

    gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};
