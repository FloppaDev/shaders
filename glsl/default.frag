uniform vec2 resolution;
in vec2 uv;

void main(){
	gl_FragColor = vec4(uv, 0., 1.);
}
