function drawShapeWithTexture(gl, program ,shapeVertices, shapeIndices, shapeNormals, shapeTexture, objectImage) {

  var shapeVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeVertices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);

  var shapeIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shapeIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shapeIndices), gl.STATIC_DRAW);

  var shapeNormalsBufferObject = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeNormalsBufferObject); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeNormals), gl.STATIC_DRAW); 

  var normalAttribLocation = gl.getAttribLocation(program, "vertNormal"); 

  gl.vertexAttribPointer(
    normalAttribLocation,
    3,
    gl.FLOAT, 
    gl.TRUE, 
    3 * Float32Array.BYTES_PER_ELEMENT, 
    0 * Float32Array.BYTES_PER_ELEMENT,
  ); 

  gl.enableVertexAttribArray(normalAttribLocation); 

  var shapeTextureCoordBufferObject = gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeTextureCoordBufferObject); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeTexture), gl.STATIC_DRAW);  

  var textureAttribLocation = gl.getAttribLocation(program, "vertTexture");

  gl.vertexAttribPointer(
    textureAttribLocation, 
    2, 
    gl.FLOAT,
    gl.FALSE, 
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
  ); 
  
  gl.enableVertexAttribArray(textureAttribLocation); 


  var susanTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, susanTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    objectImage
  );
  gl.bindTexture(gl.TEXTURE_2D, null);

  gl.bindTexture(gl.TEXTURE_2D, susanTexture);
  gl.activeTexture(gl.TEXTURE0);

  // var colorAttribLocation = gl.getAttribLocation(program, "vertColor");


  // gl.vertexAttribPointer(
  //   colorAttribLocation, // Attribute location
  //   3, // Number of elements per attribute
  //   gl.FLOAT, // Type of elements
  //   gl.FALSE,
  //   6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  //   3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  // );
  
  // gl.enableVertexAttribArray(colorAttribLocation);

  gl.drawElements(gl.TRIANGLES, shapeIndices.length, gl.UNSIGNED_SHORT, 0); 
}