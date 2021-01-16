function useProgram(
  gl,
  program,
  canvas,
  worldMatrix,
  viewMatrix,
  projMatrix,
  xRotationMatrix,
  yRotationMatrix,
  angle
) {
  gl.useProgram(program);

  var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
  var matViewUniformLocation = gl.getUniformLocation(program, "mView");
  var matProjUniformLocation = gl.getUniformLocation(program, "mProj");
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);
  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0.5, 2, 1], [0, 0, 1], [0, 2, -20]);
  glMatrix.mat4.perspective(
    projMatrix,
    glMatrix.glMatrix.toRadian(45),
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000.0
  );

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
  glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
  glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
  glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, identityMatrix);

  return {
    matWorldUniformLocation,
    matViewUniformLocation,
    matProjUniformLocation,
  };
}
