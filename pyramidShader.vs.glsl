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
    fragNormal = (vec4(vertNormal, 0.0)).xyz; 
    fragPos = vec3(mWorld * vec4(vertPosition, 1.0));  
    gl_Position = mProj * mView * mWorld * vec4(vertPosition , 1.0); 
}