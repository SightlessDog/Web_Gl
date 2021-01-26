function drawShape(gl, program, shapeVertices, shapeIndices, shapeNormals, shapeImage) {
  var boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(shapeVertices),
    gl.STATIC_DRAW
  );

  var boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(shapeIndices),
    gl.STATIC_DRAW
  );

  var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  if (!shapeImage) {
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

    gl.vertexAttribPointer(
      colorAttribLocation, // Attribute location
      3, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
      3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(colorAttribLocation);  
  }
  
  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  
  if (shapeNormals) {
    var shapeNormalsBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeNormalsBufferObject);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(shapeNormals), 
      gl.STATIC_DRAW
    ); 
    var normalsAttribLocation = gl.getAttribLocation(program, "vertNormal"); 
    gl.vertexAttribPointer(
      normalsAttribLocation,
      3,
      gl.FLOAT,
      gl.FALSE, 
      3 * Float32Array.BYTES_PER_ELEMENT,
      0
    )
    gl.enableVertexAttribArray(normalsAttribLocation); 
  }

  if (shapeImage) {
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord'); 
    gl.vertexAttribPointer(
      texCoordAttribLocation,
      2,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    ); 

    gl.enableVertexAttribArray(texCoordAttribLocation); 

    //
    // create Texture
    // 
    var boxTexture = gl.createTexture();  
    gl.bindTexture(gl.TEXTURE_2D, boxTexture); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE,
      document.getElementById('crate-image')
    ); 
    gl.activeTexture(gl.TEXTURE0); 
  }


  gl.enableVertexAttribArray(positionAttribLocation);

  gl.drawElements(gl.TRIANGLES, shapeIndices.length, gl.UNSIGNED_SHORT, 0);
}
