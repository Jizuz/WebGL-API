var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec4 a_Color; \n' +
	'uniform mat4 u_ProjMatrix; \n' +
	'varying vec4 v_Color; \n' +
	'void main() { \n' +
	'	gl_Position = u_ProjMatrix * a_Position; \n' +
	'	v_Color = a_Color; \n' +
	'} \n';

var FSHADER_SOURCE =
	'precision mediump float; \n' +
	'varying vec4 v_Color; \n' +
	'void main() { \n' +
	'	gl_FragColor = v_Color; \n' +    //从顶点着色器接收数据
	'} \n';

function main() {
	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl) {
		console.log("Fail to get the rendering context for WebGL");
		return;
	}

	var nf = document.getElementById('nearFar');
	if (!nf) {
		console.log("Fail to get the near and far value");
		return;
	}

	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Fail to initialize shaders.");
		return;
	}

	var n = initVertexBuffers(gl);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// 获取u_ViewMatrix变量的存储地址
	var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
	if (!u_ProjMatrix) {
		console.log("Fail to get the local address.");
		return;
	}

	// 设置视点、视线和上方向
	var projMatrix = new Matrix4();

	// 注册键盘事件响应函数
	document.onkeydown = function(ev) {
		keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf);
	};

	// 绘制图形
	draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function initVertexBuffers(gl) {
	var verticesColor = new Float32Array ([
			// 绿色三角形在最后
			0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
		   -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
		    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
		    // 黄色三角形在中间
		    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
		   -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
		    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
		    // 黄色三角形在中间
		    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
		   -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
		    0.5, -0.5, 0.0, 1.0, 0.4, 0.4
		]);

	var n = 9;

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

// 视点与近。远裁剪面距离
var g_near = 0.0, g_far = 0.5;
function keydown (ev, gl, n, u_ProjMatrix, projMatrix, nf) {
	switch (ev.keyCode) {
		case 39 : g_near += 0.01;
			break;
		case 37 : g_near -= 0.01;
			break;
		case 38 : g_far += 0.01;
			break;
		case 40 : g_far -= 0.01;
			break;
		default:
			return;
	}

	draw(gl, n, u_ProjMatrix, projMatrix, nf);
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
	// 使用矩阵设置的可视空间
	projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far);

	// 将投影矩阵传给U_ProjMatrix变量
	gl.uniformMatrix4fv (u_ProjMatrix, false, projMatrix.elements);

	// 清除<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// 显示当前的near和far值
	nf.innerHTML = 'near: ' + Math.round(g_near * 100) / 100 + ', far: ' + Math.round(g_far * 100) / 100;

	// 绘制三角形
	gl.drawArrays(gl.TRIANGLES, 0, n);
}