precision mediump float;
	
varying vec3 fragNormal; 
varying vec3 fragColor;
varying vec3 fragPos; 
varying mat4 world;

void main() {
    vec3 ambientLight = vec3(0, 0, 0);
    float specularStrength = 0.5; 
    vec3 viewPos = vec3(0, 0, -3); 
    vec3 viewDirection = normalize(viewPos - fragPos);
    vec3 sunLightDirection = normalize(vec3(4.0,6.0, 2.0)); 
    vec3 reflectDir = reflect(-sunLightDirection, fragNormal); 
    float spec = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0); 
    vec3 specular = specularStrength * spec * ambientLight; 
        
    vec3 sunLight = vec3(1, 1, 0); 
    // light direction
      
    // ambient light + diffuse 
    vec3 lightIntenisity = ambientLight + max(sunLight * dot(fragNormal, sunLightDirection), 0.0) + specular; 
          //diffuse
    gl_FragColor = vec4(fragColor * lightIntenisity, 1.0); 
		
}