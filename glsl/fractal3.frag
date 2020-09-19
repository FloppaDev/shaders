
#define N 64.
#define B 4.

uniform vec2 resolution;
in vec2 uv;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
	vec2 c = uv * vec2(1., resolution.y / resolution.x) * 3. - vec2(.3,0.);
	vec2 z = vec2(0);
  float i;

  for(i=0.; i < N; i++) {
      z =	mat2(z, -z.y, z.x) * z + c;
			z = mat2(z, -z.y, z.x) * z;
			z = mat2(z, -z.y, z.x) * z;
      if(dot(z, z) > B*B) break;
  }

	float sn = (i - log(log(dot(z, z)) / log(B)) / log(2.)) / N;
	vec3 col = i==N ?
		vec3(.1, .05, .2) :
		palette(fract(sn+.6), vec3(c,z.y), vec3(.05), vec3(z,4.2), vec3(.645, .4, .3));

	gl_FragColor = vec4(col, 1.);
}
