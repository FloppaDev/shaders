#define STEPS 50
#define EPSILON .01
#define FAR 50.

#define BACKGROUND vec3(.1, .2, .4)
#define SUPERSAMPLING 4.

uniform vec2 resolution;
uniform float time;
in vec2 uv;

float sdSphere(vec3 p, vec3 c, float r, float x) {
	return length(p-c) - (r * max(x, .5));
}

float sdf(vec3 p) {
	vec3 center = vec3(0.);
	float radius = .4;

	float x = fract(p.z / FAR);
	vec3 q = mod(p + vec3(sin(x * 10.), cos(x * 10.), 0.), 2.) - 1.;
	float sphere = sdSphere(q, center, radius, x);

	return sphere;
}

vec3 raymarch(vec3 origin, vec3 direction) {
	float depth = 0.;

	for(int i = 0; i < STEPS; i++)
	{
		vec3 pos = origin + direction * depth;
		float distance = sdf(pos);

		if(distance < EPSILON) {
			float df = depth / FAR;
			float x = fract(df);
			float r = sin(x * 10.);
			float b = cos(x * 10.);
			return mix(vec3(1. - df) * vec3(r, 0., b) * .5 + .5, BACKGROUND, min(depth/40., 1.));
		}

		if(depth > FAR) break;

		depth += distance;
	}

	return BACKGROUND;
}

void main(){
	float z = time * 5.;
	vec3 origin = vec3(0., 0., z);

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
