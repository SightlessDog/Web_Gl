precision mediump float;
	
varying vec3 fragNormal; 
varying vec3 fragColor;
varying vec3 fragPos; 

void main() {
    vec3 ambientLight = vec3(0.2, 0.2, 0.5);
    vec3 sunLightDirection = normalize(vec3(4.0,6.0, 2.0));      
    vec3 sunLight = vec3(0.3922, 0.1059, 0.1059);  
    // ambient light + diffuse 
    vec3 lightIntenisity = ambientLight + max(sunLight * dot(fragNormal, sunLightDirection), 0.0); 
    gl_FragColor = vec4(lightIntenisity, fragPos); 
}