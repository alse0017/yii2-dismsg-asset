/*! Copyright (c) 2012 Алексеенко Сергей Александрович <sergei_alekseenk@list.ru>
 *
 *
 * Version: 2.0
 *
 * Методы вызова:
 $.disMsg("Текст",{position:"bottom left",time:7000})
 $(element).disMsg("Текст",{position:"bottom left",time:7000}) - Будет срабатывать по клику на элемент

 Опции:
 template: "шаблон"
 position: "top left"|"top center"|"top right"|"bottom left"|"bottom right"|"bottom center"|"center"
 time: 7000 (Число в милисекундах)
 type: "true"|"false" - тип окна
 max_count: число - максимальное количество сообщений за раз
 */
(function($){
	var
		count = 0, //Общий счетчик окон
		disMsg = [], //Объект окно
		disMsg_body = [], //Объект тело окна
		top,
		left,
		CloseInterval = [], //Интервал закрытия окон
		defaultOptions = {
			'position':"center",
			'time':7000,
			'max_count':1
		},
		options;

	//disMsg по элементу
	$.fn.disMsg = function(html, options){
		var element = $(this);

		if(element.is("strong,a,h1,h2,h3,h4,h5,img,b,li,ol,ul,em,table,tr,td,th,p,br,u,span,div"))
		{
			$(this).click(function(){
				$.disMsg.Show(html, options);
			});
		}

		return element;
	};

	//disMsg без элемента
	$.disMsg = function(html, options){
		$.disMsg.Show(html, options);
	};

	//Функция вывода окон
	$.disMsg.Show = function(html, options){
		count = count + 1; //С каждым разом прибавляем счетчик окон
		var c_count = count; //Берем номер текущего окна

		$.disMsg.init(); //Инициалтзируем окно

		options = $.extend({}, defaultOptions, options); //Объединяем опции

		if(options.template !== '') disMsg[count].addClass(options.template); //Задаем шаблон окна(по умолчанию нейтральный)

		disMsg[count].addClass("v--" + options.type); //Задаем класс окна(по умолчанию нейтральный)

		disMsg_body[count].html(html); //Записываем текст в окно

		//Типы позиций
		if(options.position === "center")
		{
			top = ($(window).outerHeight() / 2) - disMsg[c_count].outerHeight() / 2;
			left = (($(window).width() - disMsg[c_count].outerWidth()) / 2);
		}
		if(options.position === "bottom center")
		{
			top = ($(window).outerHeight() - disMsg[c_count].outerHeight()) - 5;
			left = (($(window).width() - disMsg[c_count].outerWidth()) / 2);
		}
		if(options.position === "bottom right")
		{
			top = ($(window).outerHeight() - disMsg[c_count].outerHeight()) - 5;
			left = ($(window).width() - disMsg[c_count].outerWidth()) - 5;
		}
		if(options.position === "bottom left")
		{
			top = ($(window).outerHeight() - disMsg[c_count].outerHeight()) - 5;
			left = 5;
		}
		if(options.position === "top right")
		{
			top = 5;
			left = ($(window).width() - disMsg[c_count].outerWidth()) - 5;
		}
		if(options.position === "top left")
		{
			top = 5;
			left = 5;
		}
		if(options.position === "top center")
		{
			top = 5;
			left = (($(window).width() - disMsg[c_count].outerWidth()) / 2);
		}

		//Сам вывод окна
		if(disMsg[c_count].is(":hidden"))
		{
			disMsg[c_count].css({top: top, left: left, display: 'flex'});
			setTimeout(function(){
				disMsg[c_count].css({opacity: 1, transform: 'scale(1)'})
			}, 10);
		}
		else
		{
			disMsg[c_count].animate({"width":disMsg[c_count].outerWidth(), "top":top, "left":left}, 300);
		}

		if(c_count > 1) //Если окон больше чем 1 то остальные смещаем
		{
			for(var i = 1; i < c_count; i++)
			{
				if(disMsg[i].length)
				{
					if(options.position === "bottom center" || options.position === "bottom right" || options.position === "bottom left" || options.position === "center")
					{
						disMsg[i].animate({"top":"-=" + (disMsg[c_count].outerHeight() + 5)}, 200)
					}
					else disMsg[i].animate({"top":"+=" + (disMsg[c_count].outerHeight() + 5)}, 200)
				}
			}
			if(options.max_count > 0)
			{
				for(i = 1; i <= (c_count - options.max_count); i++)
				{
					if(disMsg[i].length) $.disMsg.close(i);
				}
			}
		}

		if(options.time > 0) CloseInterval[c_count] = setInterval(function(){
			$.disMsg.close(c_count);
		}, options.time); //Назначаем интервал закрытия текущего окна
	};

	//Функция закрытия окна
	$.disMsg.close = function(c_count){
		clearInterval(CloseInterval[c_count]);
		disMsg[c_count].fadeOut(300).remove();
	};

	//Функция Установки опций по умолчанию
	$.disMsg.setOptions = function(setOptions){
		defaultOptions = $.extend({}, defaultOptions, setOptions); //Объединяем опции
	};

	//Функция инициализации окон
	$.disMsg.init = function(){
		var selector = '.disMsg[data-id=' + count + ']';
		if(!$(selector).length)
		{
			$('body').append(
				'<div class="disMsg" data-id="' + count + '">' +
				'<div class="disMsg__inner">' +
				'<div class="disMsg__close"></div>' +
				'<div class="disMsg__body"></div>' +
				'</div>'+
				'</div>'
			);
		}

		disMsg[count] = $(selector);
		disMsg_body[count] = $('.disMsg__body', disMsg[count]);
	};

	$(document).ready(function(){
		$(document).delegate('.disMsg', 'mouseover', function(){
			var c_count =  $(this).data("id");
			clearInterval(CloseInterval[c_count]);
		});
		$(document).delegate('.disMsg', 'mouseout', function(){
			var c_count =  $(this).data("id");
			CloseInterval[c_count] = setInterval(function(){
				$.disMsg.close(c_count);
			}, defaultOptions.time);
		});
		$(document).delegate('.disMsg__close', 'click', function(){
			var $disMsg = $(this).closest('.disMsg');
			$.disMsg.close($disMsg.data("id"))
		});
	});
})(jQuery);