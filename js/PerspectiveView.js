var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec4 a_Color; \n' +
	'varying vec4 v_Color; \n' +
	'uniform mat4 u_ViewMatrix; \n' +
	'uniform mat4 u_ProjMatrix; \n' +
	'void main() { \n' +
	'	gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position; \n' +
	'	v_Color = a_Color; \n' +
	'} \n';

var FSHADER_SOURCE =
	'precision mediump float; \n' +
	'varying vec4 v_Color; \n' +
	'void main() { \n' +
	'	gl_FragColor = v_Color; \n' +    //从顶点着色器接收数据
	'} \n';

function load() {
	var canvas = document.getElementById('example');
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log("Fail to get the rendering context for WebGL");
		return;
	}

	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Fail to initialize shaders.");
		return;
	}

	var n = initVertexBuffers(gl);

	var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

	var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();

	viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
	projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);

	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

	gl.clearColor(0, 0, 0, 1);
	// 开启隐藏面消除
	gl.enable(gl.DEPTH_TEST);
	// 清空颜色缓冲区和深度缓冲区
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
	var verticesColor = new Float32Array ([
			// 左侧
			0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
		    0.25,-1.0, -4.0, 0.4, 1.0, 0.4,
		    1.25,-1.0, -4.0, 1.0, 0.4, 0.4,

		    0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
		    0.25,-1.0, 0.0, 0.4, 0.4, 1.0,
		    1.25,-1.0, 0.0, 1.0, 0.4, 0.4,

		    0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
		    0.25,-1.0, -2.0, 1.0, 1.0, 0.4,
		    1.25,-1.0, -2.0, 1.0, 0.4, 0.4,

		    // 右侧
			-0.75, 1.0, -4.0, 0.4, 1.0, 0.4,
		    -0.25,-1.0, -4.0, 0.4, 1.0, 0.4,
		    -1.25,-1.0, -4.0, 1.0, 0.4, 0.4,

		    -0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
		    -0.25,-1.0, -2.0, 1.0, 1.0, 0.4,
		    -1.25,-1.0, -2.0, 1.0, 0.4, 0.4,

		    -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
		    -0.25,-1.0, 0.0, 0.4, 0.4, 1.0,
		    -1.25,-1.0, 0.0, 1.0, 0.4, 0.4,
		]);

	var n = 18;

	// 创建缓冲区对象
	var vertexColorBuffer = gl.createBuffer();
	if (!vertexColorBuffer) {
		console.log('Fail to create the buffer object ');
		return -1;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Fail to get the position');
		return;
	}

	var FSize = verticesColor.BYTES_PER_ELEMENT;

	//将缓冲区对象分配给a_Position变量
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSize*6, 0);
	//连接a_Position变量与分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);

	//获取a_Color的存储位置，分配缓存区并开启
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Color < 0) {
		console.log('Fail to get the color');
		return;
	}
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSize*6, FSize*3);
	gl.enableVertexAttribArray(a_Color);

	return n;
}