function main() {
	//获取canvas元素
	var canvas = document.getElementById('example');

	//获取WebGL绘图上下文
	var gl = getWebGLContext(canvas);
	// if (!gl) {
	// 	console.log('Fail to get the rendering context for WebGL');
	// 	return;
	// }

	//初始化着色器
	// if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
	// 	console.log('Fail to initialize shaders.');
	// 	return;
	// }

	//设置<canvas>背景色
	gl.clearColor(0.0, 0.5, 0.0, 1.0);

	//清空
	gl.clear(gl.COLOR_BUFFER_BIT);

	//绘制一个点
//	gl.drawArrays(gl.TRIANGLES, 0, n);
}