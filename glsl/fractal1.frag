
#define N 64.
#define B 4.

uniform vec2 resolution;
in vec2 uv;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.989,78.233))) * 43758.543);
}

float rseed = 0.;
vec2 random2() {
    vec2 seed = vec2(rseed++, rseed++);
    return vec2(random(seed + 0.342), random(seed + 0.756));
}

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
	vec2 c = uv * vec2(1., resolution.y / resolution.x) * 3. - vec2(.3,0.);
	vec2 z = vec2(0);
  float i;

  for(i=0.; i < N; i++) {
      z =	mat2(z, -z.y, z.x) * z +c;
			for(int j=0;j<8;j++) z = mat2(z, -z.y, z.x) * -c;
      if(dot(z, z) > B*B) break;
  }

	float sn = (i - log(log(dot(z, z)) / log(B)) / log(2.)) / N;
	vec3 col = i==N ?
		vec3(.4, .05, .1) :
		palette(fract(sn+.6), -vec3(random2(), (sin(z.y+1.)*.5)), vec3(.05, c*random2()), vec3(z.yx,4.2), vec3(.645, .4, .3));

	col = (col.zxy + col.zzy) * .5;
	col = (col.zyx + col.zyx) * .5;

	gl_FragColor = vec4(col, 1.);
}
