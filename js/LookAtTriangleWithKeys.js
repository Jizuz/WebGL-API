var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec4 a_Color; \n' +
	'varying vec4 v_Color; \n' +
	'uniform mat4 u_ViewMatrix; \n' +
	'void main() { \n' +
	'	gl_Position = u_ViewMatrix * a_Position; \n' +
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

	// 获取u_ViewMatrix变量的存储地址
	var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	if (!u_ViewMatrix) {
		console.log("Fail to get the local address.");
		return;
	}

	// 获取键盘控制的视图矩阵（视点、视线和上方向）
	var viewMatrix = new Matrix4();
	// 注册键盘响应事件
	document.onkeydown = function(event) {
		keyDown(event, gl, n, u_ViewMatrix, viewMatrix);
	};
	
	draw(gl, n, u_ViewMatrix, viewMatrix);
}

// 定义初始视点
var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25;
function keyDown(event, gl, n, u_ViewMatrix, viewMatrix) {
	if (event.keyCode == 39) {	// 右键
		g_eyeX += 0.01;
		draw(gl, n, u_ViewMatrix, viewMatrix);
	} else if (event.keyCode == 37) {	// 左键
		g_eyeX -= 0.01;
		draw(gl, n, u_ViewMatrix, viewMatrix);
	} else {	// 其他键
		draw(gl, n, u_ViewMatrix, viewMatrix);
	}
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
	// 设置视点和视图、上方向
	viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

	// 将视图矩阵传给u_ViewMatrix变量
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// 清除<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLES, 0, n);
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
	alert(FSize);

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