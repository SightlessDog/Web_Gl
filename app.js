var gl;
var model;

var InitDemo = function () {
  loadTextResource("/shader.vs.glsl", function (vsError, vsText) {
    if (vsError) {
      alert("Error with vs error");
      console.error(vsError);
    } else {
      loadTextResource("/shader.fs.glsl", function (fsError, fsText) {
        if (fsError) {
          alert("Error with fs");
          console.log(fsError);
        } else {
          loadJSONResource("/hand.json", function (err, obj) {
            if (err) {
              alert("error with the object");
              console.error(err);
            } else {
              loadImage("/handTextures.jpg", function (imgErr, image) {
                if (imgErr) {
                  alert("Error while loading the image");
                  console.error(imgErr);
                } else {
                  loadTextResource(
                    "/boxShader.fs.glsl",
                    function (bfsError, boxFragShader) {
                      if (bfsError) {
                        alert("Error with the box frag shader!");
                        console.log(bfsError);
                      } else {
                        loadTextResource(
                          "/boxShader.vs.glsl",
                          function (bvsError, boxVertShader) {
                            if (bvsError) {
                              alert("Error loading the boxVertexShader");
                            } else {
                              RunDemo(
                                vsText,
                                fsText,
                                boxFragShader,
                                boxVertShader,
                                image,
                                obj
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
};

var RunDemo = function (
  vertexShaderText,
  fragmentShaderText,
  objectFragmentShaderText,
  objectVertexShaderText,
  objectImage,
  SusanModel
) {
  console.log("This is working");
  // 1 for the lighting we need first the normal info from the model
  var canvas = document.getElementById("game-surface");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("Your browser does not support WebGL");
  }

  gl.clearColor(0.75, 0.85, 0.8, 0.5);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  //
  // Create shaders
  //
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  var objectFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  var objectVertexShader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.shaderSource(objectFragmentShader, objectFragmentShaderText);
  gl.shaderSource(objectVertexShader, objectVertexShaderText);

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

  gl.compileShader(objectFragmentShader);
  if (!gl.getShaderParameter(objectFragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling box fragment shader!",
      gl.getShaderInfoLog(objectFragmentShader)
    );
    return;
  }

  gl.compileShader(objectVertexShader);
  if (!gl.getShaderParameter(objectVertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling box vertex shader!",
      gl.getShaderInfoLog(objectVertexShader)
    );
    return;
  }

  var program = initProg(gl, program, fragmentShader, vertexShader);

  // handle mouse moves
  onmousemove = function (e) {
    mouseCallback(e.clientX, e.clientY);
  };

  //to create a moving camera ( Euler system )
  var firstMouse = true;
  var yaw = 0;
  var pitch = 0;
  var lastX = 400;
  var lastY = 300;

  var susanVertices = SusanModel.meshes[0].vertices;

  var susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);

  var susanTextCoords = SusanModel.meshes[0].texturecoords[0];

  //the normals needed to calculate the light
  var susanNormals = SusanModel.meshes[0].normals;

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);

  var prog = useProgram(
    gl,
    program,
    canvas,
    worldMatrix,
    viewMatrix,
    projMatrix
  );
  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);

  //
  // Main render loop
  //
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);
  var angle = 0;
  var loop = function (vMatrix) {
    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
    glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
    gl.uniformMatrix4fv(prog.matWorldUniformLocation, gl.FALSE, identityMatrix);

    gl.clearColor(1.0, 0.0, 0.0, 0.5);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    drawShapeWithTexture(
      gl,
      program,
      susanVertices,
      susanIndices,
      susanNormals,
      susanTextCoords,
      objectImage
    );

    var program2 = initProg(
      gl,
      program2,
      objectFragmentShader,
      objectVertexShader
    );

    var worldMatrix2 = new Float32Array(16);
    var viewMatrix2 = new Float32Array(16);
    var projMatrix2 = new Float32Array(16);

    var prog2 = useProgram(
      gl,
      program,
      canvas,
      worldMatrix2,
      viewMatrix2,
      projMatrix2
    );

    var xRotationMatrix2 = new Float32Array(16);
    var yRotationMatrix2 = new Float32Array(16);

    var identityMatrix2 = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix2);
    var angle2 = 0;

    angle2 = (performance.now() / 1000 / 6) * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix2, angle2, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix2, angle2 / 4, [
      1,
      0,
      0,
    ]);
    glMatrix.mat4.mul(worldMatrix2, yRotationMatrix2, xRotationMatrix2);
    gl.uniformMatrix4fv(
      prog2.matWorldUniformLocation,
      gl.FALSE,
      identityMatrix2
    );

    drawShape(gl, program2, boxVertices, boxIndices);
  };
  requestAnimationFrame(loop);

  // Still some work to do for the mouse to really work
  function mouseCallback(xPos, yPos) {
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
    glMatrix.mat4.lookAt(
      newViewMatrix,
      [0, 0, -30],
      [
        Math.cos(glMatrix.glMatrix.toRadian(yaw)) *
          Math.cos(glMatrix.glMatrix.toRadian(pitch)),

        Math.sin(glMatrix.glMatrix.toRadian(pitch)),
        Math.sin(glMatrix.glMatrix.toRadian(yaw)) *
          Math.cos(glMatrix.glMatrix.toRadian(pitch)),
      ],
      [0, 2, 0]
    );

    //
  }
};
