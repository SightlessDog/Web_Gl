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

  var program2 = initProg(
    gl,
    program2,
    objectFragmentShader,
    objectVertexShader
  );
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
  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);
  var angle = 0;

  //
  // Main render loop
  //
  var loop = function () {
    var prog = useProgram(
      gl,
      program,
      canvas,
      worldMatrix,
      viewMatrix,
      projMatrix,
      xRotationMatrix,
      yRotationMatrix,
      angle
    );

    // var prog2 = useProgram(
    //   gl,
    //   program2,
    //   canvas,
    //   worldMatrix,
    //   viewMatrix,
    //   projMatrix,
    //   xRotationMatrix,
    //   yRotationMatrix,
    //   angle
    // );

    gl.clearColor(1.0, 0.3, 0.7, 0.5);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // drawShape(gl, program2, boxVertices, boxIndices);

    drawShapeWithTexture(
      gl,
      program,
      susanVertices,
      susanIndices,
      susanNormals,
      susanTextCoords,
      objectImage
    );

    var prog2 = useProgram(
      gl,
      program2,
      canvas,
      worldMatrix,
      viewMatrix,
      projMatrix,
      xRotationMatrix,
      yRotationMatrix,
      angle
    );

    drawShape(gl, program2, boxVertices, boxIndices);
  };
  requestAnimationFrame(loop);
};
