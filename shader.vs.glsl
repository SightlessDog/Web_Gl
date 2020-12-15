precision mediump float; 

// attributes because they change through the vertices
attribute vec3 vertPosition; 
attribute vec3 vertColor; 
varying vec3 fragColor; 
attribute vec2 vertTexCoord; 
varying vec2 fragTexCoord; 

uniform mat4 mWorld; //model View
uniform mat4 mView; 
uniform mat4 mProj; 

void main () {
    fragTexCoord = vertTexCoord;  
    gl_Position = mProj * mView * mWorld * vec4(vertPosition , 1.0); 
}