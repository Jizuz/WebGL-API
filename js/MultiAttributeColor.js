var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec4 a_Color; \n' +
	'varying vec4 v_Color; \n' +
	'void main() { \n' +
	'	gl_Position = a_Position; \n' +
	'	gl_PointSize = 10.0; \n' +
	'	v_Color = a_Color; \n' +
	'} \n';

var FSHADER_SOURCE =
	/*
	 * 着色语言定了三种级别的精度：lowp, mediump, highp。
	 * 在顶点着色阶段，如果没有用户自定义的默认精度，那么 int 和 float 都默认为 highp 级别；
	 * 而在片元着色阶段，如果没有用户自定义的默认精度，那么就真的没有默认精度了，我们必须在每个变量前放置精度描述符。
	 */
	'precision mediump float; \n' +
	'varying vec4 v_Color; \n' +
	'void main() { \n' +
	'	gl_FragColor = v_Color; \n' +    //从顶点着色器接收数据
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

	//绘制一个点
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
	var verticesColors = new Float32Array([
			 0.0, 0.5, 1.0, 0.0, 0.0,
			-0.5, -0.5, 0.0, 1.0, 0.0,
			 0.5, -0.5, 0.0, 0.0, 1.0,
		]);

	var n = 3;

	//创建缓冲区对象
	var vertexColorBuffer = gl.createBuffer();
	if (!vertexColorBuffer) {
		console.log('Fail to create the buffer object ');
		return -1;
	}

	//将缓冲区对象绑定到目标
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

	//向缓冲区对象中写入数据
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

	var FSize = verticesColors.BYTES_PER_ELEMENT;

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Fail to get the position');
		return;
	}

	//将缓冲区对象分配给a_Position变量
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSize*5, 0);

	//连接a_Position变量与分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);

	//获取a_Color的存储位置，分配缓存区并开启
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		console.log('Fail to get the color');
		return;
	}
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSize*5, FSize*2);
	gl.enableVertexAttribArray(a_Color);

	return n;
}