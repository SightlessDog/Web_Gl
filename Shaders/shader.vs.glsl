precision mediump float; 

// attributes because they change through the vertices
//we pass them from our app
// attribute vec3 vertColor; 
// varying vec3 fragColor; 
attribute vec3 vertPosition; 
attribute vec2 vertTexture; 
attribute vec3 vertNormal; 

varying vec2 fragTexCoord;
varying vec3 fragNormal;  


uniform mat4 mWorld; //model View
uniform mat4 mView; 
uniform mat4 mProj; 

void main () {
    fragTexCoord = vertTexture;  
    fragNormal =  (vec4(vertNormal, 0.0)).xyz; 
    gl_Position = mProj * mView * mWorld * vec4(vertPosition , 1.0); 
}