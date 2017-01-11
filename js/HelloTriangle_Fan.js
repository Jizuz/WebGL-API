var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'void main() { \n' +
	'	gl_Position = a_Position; \n' +
	'} \n';

var FSHADER_SOURCE =
	'void main() { \n' +
	'	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); \n' +
	'} \n';

function load() {
	//获取canvas元素
	var canvas = document.getElementById('example');

	//获取WebGL绘图上下文
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Fail to get the rendering context for WebGL');
		return;
	}

	//初始化着色器
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Fail to initialize shaders.');
		return;
	}

	var n = initVertexBuffers(gl);

	//设置<canvas>背景色
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	//清空
	gl.clear(gl.COLOR_BUFFER_BIT);

	//绘制图形
	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
		-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
		]);

	var n = 4;

	//创建缓冲区对象
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Fail to create the buffer object ');
		return -1;
	}

	//将缓冲区对象绑定到目标
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	//向缓冲区对象中写入数据
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Fail to get the position');
		return;
	}

	//将缓冲区对象分配给a_Position变量
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	//连接a_Position变量与分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);

	return n;
}