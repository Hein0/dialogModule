;(function($){
	
	var Dialog=function(config){  //创建构造方法
		
		var _this_=this;
		
		//默认配置参数
		this.config={
			//对话框宽高
			width:"auto",
			height:"auto",
			//对话框提示信息
			message:null,
			//对话框类型
			type:"no",
			//按钮配置
			buttons:null,
			// 弹出框延迟多久关闭
			delay:null,
			//延迟弹框结束后的回调
			delayCallback:null,
			//对话框遮罩透明度
			maskOpacity:null,
			//配置点击遮罩层的关闭
			maskClose:null,
			//是否启用弹出动画
			effect:null,
			
		};
		
		//默认参数扩展  是否传值过来    是否传的是对象
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config)
			console.log(this.config)
		}else{
			//判断是否传值过来    没有传值过来
			this.isConfig=true;
		};
		
		//创建基本dom
		this.body=$('body');
		this.mask=$('<div class="g-contianer">');//创建遮罩层dom
		this.win=$('<div class="dialog-window">');//创建win窗口dom
		this.winHeader=$('<div class="dialog-header">');//创建头部图标 dom
		this.winContent=$('<div class="dialog-content">');//创建中间内容dom
		this.winFooter=$('<div class="dialog-footer">');//创建footer dom
		
		this.creat();//渲染dom 
		
		
	};
	//创建弹窗的层级
	Dialog.zindex=999;
	
	//原型扩展方法
	Dialog.prototype={
	//创建一个动画函数
	animate:function(){
		var _this_=this;
		this.win.css("-webkit-transform","scale(0,0)");
		window.setTimeout(function(){
		  _this_.win.css("-webkit-transform","scale(1,1)");	
		},100)
	},
	
	//创建弹出窗	
	creat:function(){
		
		var _this_=this,
		    config=this.config,
		    body=this.body,
		    mask=this.mask,
		    win=this.win,
		    header=this.winHeader,
		    content=this.winContent,
		    footer=this.winFooter;
		    
	  //当每次创建弹出框的时候都要累加一个层级
	        Dialog.zIndex++;
	        this.mask.css("zIndex",Dialog.zIndex);
		    
	  //如果没有传递任何配置参数，就弹出一个等待的图标形式弹框///
		if(this.isConfig){//没有传值
			//如果effect  有传值为true
			if(config.effect){   this.animate();	};
			
			win.append(header.addClass("sx"));
			mask.append(win);
			body.append(mask);
			
		}else{//根据配置的参数创建相应的弹框
			header.addClass(config.type);
			win.append(header);
			//如果传了文本信息
			if(config.message){  win.append(content.html(config.message));   };
			//如果配置了按钮
			if(config.buttons){
				this.creatBottn(footer,config.buttons);  //创建一个按钮方法
				win.append(footer)
			}
			
			//如果配置了宽度
			if(config.width !=="auto"){ win.width(config.width) };
			
			//如果配置了高度
			if(config.height !=="auto"){ win.height(config.height) };
			
			//如果配置了遮罩层的透明度
			if(config.maskOpacity){ mask.css("backgroundColor","rgba(0,0,0,"+ config.maskOpacity +")")}                       
			
			//如果配置了弹出框关闭时间
			if(config.delay && config.delay!=0){
				window.setTimeout(function(){
					_this_.close();//触发关闭方法    _this_指向当前作用域 creat()方法
					
					//如果配置了弹框回调就执行回调方法
					config.delayCallback&&config.delayCallback();
					
				},config.delay)
				
			};
			
			//如果effect  有传值为true
			if(config.effect){   this.animate();	}
			
			//如果配置了遮罩方法为true  那就给它创建一个tap事件
			if(config.maskClose){
				mask.tap(function(){
					_this_.close();
				})
			}
			
			//最后插入到页面
			mask.append(win);
			body.append(mask);
			
		};
		
	 },
	 
	 //根据配置的参数的botton创建按钮列表//////////////
	 creatBottn:function(footer,buttons){
	 	var _this_=this;
	 	
	 	$(buttons).each(function(i){
	 		var type=this.type ? " class='"+this.type+"'" : "";
	 		var butext=this.text ? this.text : "按钮"+(++i);
	 		var callback=this.callback ? this.callback : null;   //回调方法是否有
	 		
	 		var button=$('<button'+type+'>'+butext+'</button>');
	 		
	 		if(callback){ //是否为true
	 			button.tap(function(e){
	 				var isCole=callback();
	 				//阻止点击事件冒泡
	 				e.stopPropagation();
	 				
	 				if(isCole !=false ){
	 					_this_.close();
	 				}
	 			})
	 		}else{
	 			button.tap(function(e){
	 				//阻止点击事件冒泡
	 				e.stopPropagation();
	 				
	 				_this_.close();
	 			})
	 		};
	 		
	 		console.log(button)
	 		footer.append(button);
	 		
	 	});
	 	
	 },
	 
	//自动关闭弹出框  关闭方法
	close:function(){
		this.mask.remove()
	},
	
		
	}
	window.Dialog=Dialog;
	//通过外部直接调用 $.dialog()方法   
	$.dialog=function(config){
	   
	   return new Dialog(config);
	}
	//$.dialog()可传参数   参数如下：
	//对话框宽高         width:100,height:50,
    //对话框类型    type:"yes",(yes、not、sx)
    //对话框提示信息      message:"请输入提示内容",
    //按钮配置
//				buttons:[
//				   {
//				   	  type:"red",  按钮背景颜色  (red、green)
//				   	  text:"确认",     按钮内容
//				   	  callback:function(){  执行回调
//				   	  	
//				   	  	return false    点击按钮后不关闭
//				   	  }
//				   },
//				   可以多配置多个按钮
//				], 
    
      // 弹出框延迟多久关闭     delay:3000,
      //对话框遮罩透明度           maskOpacity:0.5,
	
})(Zepto);


