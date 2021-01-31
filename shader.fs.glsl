    precision mediump float;
	
	varying vec2 fragTexCoord; 
    varying vec3 fragNormal;  

	uniform sampler2D sampler; 

    void main() {

        vec3 ambientLight = vec3(0.8, 0.8, 0.8);
        vec3 sunLightDirection = normalize(vec3(4.0,6.0, 2.0));      
        vec3 sunLight = vec3(1.0, 1.0, 1.0);

        vec4 texel = texture2D(sampler, fragTexCoord); 

        vec3 lightIntensity = ambientLight + max(sunLight * dot(fragNormal, sunLightDirection), 0.0);  

        gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
		//gl_FragColor = texture2D(sampler, fragTexCoord); 
		
    }