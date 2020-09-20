#define STEPS 64
#define EPSILON .01
#define FAR 1000.

#define COLOR vec3(1., .5, 1.)
#define LIGHT_COLOR vec3(1.)
#define LIGHT_POSITION vec3(-1., 3., -2.)
#define AMBIENT_INTENSITY .4
#define BACKGROUND vec3(.5, .7, 1.)
#define SPECULAR 1.

uniform vec2 resolution;
uniform float time;
in vec2 uv;

float sdSphere(vec3 p, vec3 c, float r) {
	return length(p-c) - r;
}

float sdf(vec3 p) {
	float sphere = sdSphere(p, vec3(0.), 1.);

	float freq = 10.;
	vec3 d = freq * p + time * 5.;
	float displacement = sin(d.x) * sin(d.y) * sin(d.z) * .05;

	return sphere + displacement;
}

vec3 normal(vec3 p) {
	const vec3 step3 = vec3(EPSILON, 0., 0.);

	float gradientX = sdf(p + step3.xyy) - sdf(p - step3.xyy);
	float gradientY = sdf(p + step3.yxy) - sdf(p - step3.yxy);
	float gradientZ = sdf(p + step3.yyx) - sdf(p - step3.yyx);

	return normalize(vec3(gradientX, gradientY, gradientZ)) * .5 + .5;
}

vec3 raymarch(vec3 origin, vec3 direction) {
	float depth = 0.;

	for(int i = 0; i < STEPS; i++)
	{
		vec3 pos = origin + direction * depth;
		float distance = sdf(pos);

		if(distance < EPSILON) {
			vec3 normal = normal(pos);
      vec3 lightDir = normalize(pos - LIGHT_POSITION);
			vec3 light = max(0., dot(normal, -lightDir)) * LIGHT_COLOR;

			//TODO
			vec3 viewPos = vec3 (0., 0., -5.);
			vec3 viewDir = normalize(viewPos - pos);
			vec3 reflectDir = reflect(-lightDir, normal);
			float spec = pow(max(dot(viewDir, reflectDir), 0.), 6.);
			vec3 specular = SPECULAR * spec * LIGHT_COLOR;

			return (light + AMBIENT_INTENSITY * BACKGROUND) * COLOR + specular;
		}

		if(depth > FAR) break;

		depth += distance;
	}

	return BACKGROUND;
}

void main(){
	vec3 origin = vec3(0.,0.,-5.);
	vec2 rUv = uv * vec2(1.0, resolution.y / resolution.x);
	vec3 direction = vec3(rUv, 1.0);

	vec3 color = raymarch(origin, direction);

	gl_FragColor = vec4(color, 1.);
}
