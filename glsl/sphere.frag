#define STEPS 64
#define EPSILON .01
#define FAR 1000.

#define COLOR vec3(1., .5, 1.)
#define LIGHT_COLOR vec3(1.)
#define LIGHT_POSITION vec3(-1., 3., -2.)
#define AMBIENT_INTENSITY .4
#define BACKGROUND vec3(.5, .7, 1.)
#define SPECULAR 1.

#define SUPERSAMPLING 8.

uniform vec2 resolution;
uniform float time;
in vec2 uv;

float sdSphere(vec3 p, vec3 c, float r) {
	return length(p-c) - r;
}

float sdf(vec3 p) {
	vec3 center = vec3(0.);
	float radius = 1.;
	float sphere = sdSphere(p, center, radius);

	return sphere;
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

	float ssSqrt = sqrt(SUPERSAMPLING);
	float ss = 2. / resolution.x / ssSqrt;
	vec2 rUv = uv * vec2(1.0, resolution.y / resolution.x);

	vec3 color = vec3(0.);
	float ssExtent = ssSqrt * .5;

	for(float i=-ssExtent; i<ssExtent; i+=1.)
	for(float j=-ssExtent; j<ssExtent; j+=1.) {
		vec2 ssUv = rUv + vec2(i*ss, j*ss);
		vec3 direction = vec3(ssUv, 1.0);
		color += raymarch(origin, direction);
	}

	color /= SUPERSAMPLING;

	gl_FragColor = vec4(color, 1.);
}
